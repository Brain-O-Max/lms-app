'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RolesPage() {
  const { userRole } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  if (userRole !== 'admin') {
    return <DashboardLayout navVariant="gradient"><div className="container"><div className="alert alert-error">⛔ Access denied. This page is only accessible to administrators.</div><Link href="/" className="btn btn-primary">← Back to Home</Link></div></DashboardLayout>;
  }

  const roles = [
    { cls: 'admin', icon: '👑', title: 'Administrator', badge: 'Super Admin', badgeCls: 'badge-error', desc: 'Full system access including user management, content management, reports, and system configuration.', users: '2 users assigned', role: 'admin' },
    { cls: 'headoffice', icon: '🏢', title: 'Head Office', badge: 'Senior Access', badgeCls: 'badge-warning', desc: 'Access to all sessions, reports, analytics, and content. Cannot modify system settings.', users: '5 users assigned', role: 'headoffice' },
    { cls: 'manager', icon: '🗺️', title: 'Territory Manager', badge: 'Manager', badgeCls: 'badge-info', desc: 'Manage sessions and view analytics for assigned territory. Can generate reports.', users: '12 users assigned', role: 'territorymanager' },
    { cls: 'manager', icon: '🏠', title: 'Unit Manager', badge: 'Manager', badgeCls: 'badge-info', desc: 'Manage sessions for assigned unit. Can view content and add training sessions.', users: '45 users assigned', role: 'unitmanager' },
    { cls: 'manager', icon: '📋', title: 'Regional Officer (RO)', badge: 'Staff', badgeCls: 'badge-primary', desc: 'View and manage sessions. Can access content and basic reporting.', users: '78 users assigned', role: 'ro' },
    { cls: 'beneficiary', icon: '👤', title: 'Beneficiary', badge: 'Learner', badgeCls: 'badge-success', desc: 'Access to learning content and modules. Can view own progress and download certificates.', users: '1,248 users assigned', role: 'beneficiary' },
  ];

  return (
    <DashboardLayout navVariant="gradient">
      <div className="container">
        <div className="page-header"><div><h1>🔐 Roles Management</h1><p className="text-muted">Manage system roles and their access levels</p></div><button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Add New Role</button></div>
        {roles.map((r, i) => (
          <div key={i} className={`role-card ${r.cls}`}>
            <div className="role-header"><div className="role-title">{r.icon} {r.title}</div><span className={`badge ${r.badgeCls}`}>{r.badge}</span></div>
            <p className="role-description">{r.desc}</p>
            <div className="role-users">👥 {r.users}</div>
            <div style={{ marginTop: 'var(--space-md)' }}><button className="btn btn-sm btn-secondary" onClick={() => router.push(`/permissions?role=${r.role}`)}>View Permissions</button> <button className="btn btn-sm btn-secondary" onClick={() => alert('Edit role coming soon')}>Edit</button></div>
          </div>
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Role" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-success" onClick={() => { alert('Role creation will be implemented in backend'); setShowModal(false); }}>✅ Submit</button></>}>
        <form><div className="form-group"><label className="form-label form-label-required">Role Name</label><input type="text" className="form-input" placeholder="e.g., Supervisor" required /></div><div className="form-group"><label className="form-label form-label-required">Description</label><textarea className="form-textarea" placeholder="Describe the role's responsibilities..." required></textarea></div><div className="form-group"><label className="form-label">Access Level</label><select className="form-select"><option value="basic">Basic</option><option value="staff">Staff</option><option value="manager">Manager</option><option value="admin">Admin</option></select></div></form>
      </Modal>
    </DashboardLayout>
  );
}
