'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RoleData {
  slug: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  badgeCls: string;
  cardCls: string;
  users: string;
}

export default function RolesPage() {
  const { userRole } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/roles')
      .then((res) => res.json())
      .then((data) => { setRoles(data.roles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (userRole !== 'admin') {
    return <DashboardLayout navVariant="gradient"><div className="container"><div className="alert alert-error">⛔ Access denied. This page is only accessible to administrators.</div><Link href="/" className="btn btn-primary">← Back to Home</Link></div></DashboardLayout>;
  }

  return (
    <DashboardLayout navVariant="gradient">
      <div className="container">
        <div className="page-header"><div><h1>🔐 Roles Management</h1><p className="text-muted">Manage system roles and their access levels</p></div><button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Add New Role</button></div>
        {loading ? (
          <div className="text-muted" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>⏳ Loading roles...</div>
        ) : (
          roles.map((r) => (
            <div key={r.slug} className={`role-card ${r.cardCls || ''}`}>
              <div className="role-header"><div className="role-title">{r.icon} {r.title}</div><span className={`badge ${r.badgeCls}`}>{r.badge}</span></div>
              <p className="role-description">{r.description}</p>
              <div className="role-users">👥 {r.users}</div>
              <div style={{ marginTop: 'var(--space-md)' }}><button className="btn btn-sm btn-secondary" onClick={() => router.push(`/permissions?role=${r.slug}`)}>View Permissions</button> <button className="btn btn-sm btn-secondary" onClick={() => alert('Edit role coming soon')}>Edit</button></div>
            </div>
          ))
        )}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Role" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-success" onClick={() => { alert('Role creation will be implemented'); setShowModal(false); }}>✅ Submit</button></>}>
        <form><div className="form-group"><label className="form-label form-label-required">Role Name</label><input type="text" className="form-input" placeholder="e.g., Supervisor" required /></div><div className="form-group"><label className="form-label form-label-required">Description</label><textarea className="form-textarea" placeholder="Describe the role's responsibilities..." required></textarea></div><div className="form-group"><label className="form-label">Access Level</label><select className="form-select"><option value="basic">Basic</option><option value="staff">Staff</option><option value="manager">Manager</option><option value="admin">Admin</option></select></div></form>
      </Modal>
    </DashboardLayout>
  );
}
