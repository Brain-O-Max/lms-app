'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  roleCls: string;
  district: string;
  status: string;
  statusCls: string;
  lastLogin: string;
}

export default function UsersPage() {
  const { userRole } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, beneficiaries: 0, staff: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => { setUsers(data.users || []); setStats(data.stats || stats); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  if (userRole !== 'admin') {
    return <DashboardLayout navVariant="gradient"><div className="container"><div className="alert alert-error">⛔ Access denied. This page is only accessible to administrators.</div><Link href="/" className="btn btn-primary">← Back to Home</Link></div></DashboardLayout>;
  }

  const handleCreateUser = async () => {
    const form = document.getElementById('addUserForm') as HTMLFormElement;
    if (!form) return;
    const formData = new FormData(form);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        roleSlug: formData.get('role'),
        district: formData.get('district'),
        password: formData.get('password'),
      }),
    });
    if (res.ok) {
      setShowModal(false);
      fetchUsers();
      alert('User created successfully! 🎉');
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to create user');
    }
  };

  return (
    <DashboardLayout navVariant="gradient">
      <div className="container">
        <div className="page-header"><div><h1>👤 User Management</h1><p className="text-muted">Manage system users and their roles</p></div><button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Add New User</button></div>
        <div className="stats-row">
          <div className="stat-mini"><div className="stat-mini-value">{stats.totalUsers.toLocaleString()}</div><div className="stat-mini-label">Total Users</div></div>
          <div className="stat-mini"><div className="stat-mini-value">{stats.beneficiaries.toLocaleString()}</div><div className="stat-mini-label">Beneficiaries</div></div>
          <div className="stat-mini"><div className="stat-mini-value">{stats.staff.toLocaleString()}</div><div className="stat-mini-label">Staff Members</div></div>
          <div className="stat-mini"><div className="stat-mini-value">{stats.admins}</div><div className="stat-mini-label">Admins</div></div>
        </div>
        <div className="filters">
          <input type="text" className="form-input filter-input" placeholder="🔍 Search users..." />
          <select className="form-select"><option value="">All Roles</option><option>Admin</option><option>Head Office</option><option>Territory Manager</option><option>Unit Manager</option><option>RO</option><option>Beneficiary</option></select>
          <select className="form-select"><option value="">All Status</option><option>Active</option><option>Inactive</option></select>
        </div>
        <div className="card">
          <div className="table-wrapper">
            {loading ? (
              <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>⏳ Loading users...</div>
            ) : (
              <table className="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>District</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>
                {users.map((u) => (<tr key={u.id}><td><strong>{u.name}</strong></td><td>{u.email}</td><td><span className={`badge ${u.roleCls}`}>{u.role}</span></td><td>{u.district}</td><td><span className={`badge ${u.statusCls}`}>{u.status}</span></td><td>{u.lastLogin}</td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('Edit functionality coming soon')}>Edit</button></td></tr>))}
              </tbody></table>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New User" size="lg" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-success" onClick={handleCreateUser}>✅ Submit</button></>}>
        <form id="addUserForm"><div className="form-row"><div className="form-group"><label className="form-label form-label-required">First Name</label><input type="text" name="firstName" className="form-input" required /></div><div className="form-group"><label className="form-label form-label-required">Last Name</label><input type="text" name="lastName" className="form-input" required /></div></div><div className="form-row"><div className="form-group"><label className="form-label form-label-required">Email</label><input type="email" name="email" className="form-input" required /></div><div className="form-group"><label className="form-label">Phone</label><input type="tel" name="phone" className="form-input" /></div></div><div className="form-row"><div className="form-group"><label className="form-label form-label-required">Role</label><select name="role" className="form-select" required><option value="">Select Role</option><option value="admin">Administrator</option><option value="headoffice">Head Office</option><option value="territorymanager">Territory Manager</option><option value="unitmanager">Unit Manager</option><option value="ro">Regional Officer</option><option value="beneficiary">Beneficiary</option></select></div><div className="form-group"><label className="form-label">District</label><select name="district" className="form-select"><option value="">Select District</option><option>Chattogram</option><option>Feni</option><option>Cumilla</option><option>Munshiganj</option><option>Narsingdi</option><option>Tangail</option></select></div></div><div className="form-row"><div className="form-group"><label className="form-label form-label-required">Password</label><input type="password" name="password" className="form-input" required /></div><div className="form-group"><label className="form-label form-label-required">Confirm Password</label><input type="password" className="form-input" required /></div></div></form>
      </Modal>
    </DashboardLayout>
  );
}
