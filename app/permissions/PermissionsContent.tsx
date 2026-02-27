'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PermissionsContent() {
  const { userRole } = useAuth();
  const searchParams = useSearchParams();
  const selectedRole = searchParams.get('role') || 'admin';

  if (userRole !== 'admin') {
    return <DashboardLayout navVariant="gradient"><div className="container"><div className="alert alert-error">⛔ Access denied. This page is only accessible to administrators.</div><Link href="/" className="btn btn-primary">← Back to Home</Link></div></DashboardLayout>;
  }

  const permissionSections = [
    { title: '📚 Content Management', perms: [{ name: 'View Courses', desc: 'Access and view course content' }, { name: 'Create Courses', desc: 'Add new courses and modules' }, { name: 'Edit Courses', desc: 'Modify existing course content' }, { name: 'Delete Courses', desc: 'Remove courses from the system' }] },
    { title: '👥 Session Management', perms: [{ name: 'View Sessions', desc: 'Access session list and details' }, { name: 'Create Sessions', desc: 'Add new training sessions' }, { name: 'Edit Sessions', desc: 'Modify session details' }, { name: 'Delete Sessions', desc: 'Remove sessions from the system' }] },
    { title: '📈 Reports & Analytics', perms: [{ name: 'View Analytics', desc: 'Access analytics dashboard' }, { name: 'Generate Reports', desc: 'Create and download reports' }, { name: 'Export Data', desc: 'Export data to Excel/CSV' }] },
    { title: '👤 User Management', perms: [{ name: 'View Users', desc: 'Access user list' }, { name: 'Create Users', desc: 'Add new user accounts' }, { name: 'Edit Users', desc: 'Modify user details' }, { name: 'Assign Roles', desc: 'Change user role assignments' }] },
  ];

  return (
    <DashboardLayout navVariant="gradient">
      <div className="container">
        <div className="page-header"><div><h1>🔑 Role Permissions</h1><p className="text-muted">Configure permissions for each role</p></div><button className="btn btn-success" onClick={() => alert('Permissions saved successfully!')}>✅ Save Changes</button></div>
        <div className="role-selector">
          <label className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>Select Role to Configure:</label>
          <select className="form-select" defaultValue={selectedRole} style={{ maxWidth: '300px' }}><option value="admin">Administrator</option><option value="headoffice">Head Office</option><option value="territorymanager">Territory Manager</option><option value="unitmanager">Unit Manager</option><option value="ro">Regional Officer (RO)</option><option value="beneficiary">Beneficiary</option></select>
        </div>
        {permissionSections.map((section, i) => (
          <div key={i} className="permission-section">
            <h3>{section.title}</h3>
            {section.perms.map((perm, j) => (
              <div key={j} className="permission-row"><div><div className="permission-name">{perm.name}</div><div className="permission-desc">{perm.desc}</div></div><label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label></div>
            ))}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
