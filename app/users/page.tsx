'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useState } from 'react';

export default function UsersPage() {
  const { userRole } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (userRole !== 'admin') {
    return <DashboardLayout navVariant="gradient"><div className="container"><div className="alert alert-error">⛔ Access denied. This page is only accessible to administrators.</div><Link href="/" className="btn btn-primary">← Back to Home</Link></div></DashboardLayout>;
  }

  const users = [
    { name: 'Admin User', email: 'admin@lms.com', role: 'Admin', roleCls: 'badge-error', district: '-', status: 'Active', statusCls: 'badge-success', lastLogin: 'Today, 10:30 AM' },
    { name: 'Karim Rahman', email: 'karim@lms.com', role: 'Head Office', roleCls: 'badge-warning', district: 'Dhaka', status: 'Active', statusCls: 'badge-success', lastLogin: 'Today, 9:15 AM' },
    { name: 'Fatima Begum', email: 'fatima@lms.com', role: 'Territory Manager', roleCls: 'badge-info', district: 'Chittagong', status: 'Active', statusCls: 'badge-success', lastLogin: 'Yesterday' },
    { name: 'Mohammad Ali', email: 'ali@lms.com', role: 'Unit Manager', roleCls: 'badge-info', district: 'Cumilla', status: 'Active', statusCls: 'badge-success', lastLogin: '2 days ago' },
    { name: 'Rashida Khatun', email: 'rashida@lms.com', role: 'RO', roleCls: 'badge-primary', district: 'Feni', status: 'Active', statusCls: 'badge-success', lastLogin: '3 days ago' },
    { name: 'Abdul Haque', email: 'abdul@example.com', role: 'Beneficiary', roleCls: 'badge-success', district: 'Tangail', status: 'Active', statusCls: 'badge-success', lastLogin: '1 week ago' },
    { name: 'Sadia Islam', email: 'sadia@example.com', role: 'Beneficiary', roleCls: 'badge-success', district: 'Narsingdi', status: 'Inactive', statusCls: 'badge-warning', lastLogin: '2 weeks ago' },
  ];

  return (
    <DashboardLayout navVariant="gradient">
      <div className="container">
        <div className="page-header"><div><h1>👤 User Management</h1><p className="text-muted">Manage system users and their roles</p></div><button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Add New User</button></div>
        <div className="stats-row">
          <div className="stat-mini"><div className="stat-mini-value">1,390</div><div className="stat-mini-label">Total Users</div></div>
          <div className="stat-mini"><div className="stat-mini-value">1,248</div><div className="stat-mini-label">Beneficiaries</div></div>
          <div className="stat-mini"><div className="stat-mini-value">135</div><div className="stat-mini-label">Staff Members</div></div>
          <div className="stat-mini"><div className="stat-mini-value">7</div><div className="stat-mini-label">Admins</div></div>
        </div>
        <div className="filters">
          <input type="text" className="form-input filter-input" placeholder="🔍 Search users..." />
          <select className="form-select"><option value="">All Roles</option><option>Admin</option><option>Head Office</option><option>Territory Manager</option><option>Unit Manager</option><option>RO</option><option>Beneficiary</option></select>
          <select className="form-select"><option value="">All Status</option><option>Active</option><option>Inactive</option></select>
        </div>
        <div className="card"><div className="table-wrapper"><table className="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>District</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>
          {users.map((u, i) => (<tr key={i}><td><strong>{u.name}</strong></td><td>{u.email}</td><td><span className={`badge ${u.roleCls}`}>{u.role}</span></td><td>{u.district}</td><td><span className={`badge ${u.statusCls}`}>{u.status}</span></td><td>{u.lastLogin}</td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('Edit functionality coming soon')}>Edit</button></td></tr>))}
        </tbody></table></div></div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New User" size="lg" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-success" onClick={() => { alert('User creation will be implemented in backend'); setShowModal(false); }}>✅ Submit</button></>}>
        <form><div className="form-row"><div className="form-group"><label className="form-label form-label-required">First Name</label><input type="text" className="form-input" required /></div><div className="form-group"><label className="form-label form-label-required">Last Name</label><input type="text" className="form-input" required /></div></div><div className="form-row"><div className="form-group"><label className="form-label form-label-required">Email</label><input type="email" className="form-input" required /></div><div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" /></div></div><div className="form-row"><div className="form-group"><label className="form-label form-label-required">Role</label><select className="form-select" required><option value="">Select Role</option><option value="admin">Administrator</option><option value="headoffice">Head Office</option><option value="territorymanager">Territory Manager</option><option value="unitmanager">Unit Manager</option><option value="ro">Regional Officer</option><option value="beneficiary">Beneficiary</option></select></div><div className="form-group"><label className="form-label">District</label><select className="form-select"><option value="">Select District</option><option>Chattogram</option><option>Feni</option><option>Cumilla</option><option>Munshiganj</option><option>Narsingdi</option><option>Tangail</option></select></div></div><div className="form-row"><div className="form-group"><label className="form-label form-label-required">Password</label><input type="password" className="form-input" required /></div><div className="form-group"><label className="form-label form-label-required">Confirm Password</label><input type="password" className="form-input" required /></div></div></form>
      </Modal>
    </DashboardLayout>
  );
}
