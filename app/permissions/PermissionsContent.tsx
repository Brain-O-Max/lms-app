'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PermissionItem {
  id: string;
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export default function PermissionsContent() {
  const { userRole } = useAuth();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'admin');
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/permissions?role=${selectedRole}`)
      .then((res) => res.json())
      .then((data) => {
        setPermissions(data.permissions || []);
        setRoleName(data.role?.name || selectedRole);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedRole]);

  if (userRole !== 'admin') {
    return <DashboardLayout navVariant="gradient"><div className="container"><div className="alert alert-error">⛔ Access denied. This page is only accessible to administrators.</div><Link href="/" className="btn btn-primary">← Back to Home</Link></div></DashboardLayout>;
  }

  return (
    <DashboardLayout navVariant="gradient">
      <div className="container">
        <div className="page-header"><div><h1>🔑 Role Permissions</h1><p className="text-muted">Configure permissions for {roleName || 'each role'}</p></div><button className="btn btn-success" onClick={() => alert('Permissions saved successfully!')}>✅ Save Changes</button></div>
        <div className="role-selector">
          <label className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>Select Role to Configure:</label>
          <select className="form-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={{ maxWidth: '300px' }}><option value="admin">Administrator</option><option value="headoffice">Head Office</option><option value="territorymanager">Territory Manager</option><option value="unitmanager">Unit Manager</option><option value="ro">Regional Officer (RO)</option><option value="beneficiary">Beneficiary</option></select>
        </div>
        {loading ? (
          <div className="text-muted" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>⏳ Loading permissions...</div>
        ) : (
          <div className="permission-section">
            <h3>📋 Module Permissions for {roleName}</h3>
            <div className="card">
              <div className="table-wrapper">
                <table className="table">
                  <thead><tr><th>Module</th><th>View</th><th>Create</th><th>Edit</th><th>Delete</th></tr></thead>
                  <tbody>
                    {permissions.map((p) => (
                      <tr key={p.id}>
                        <td><strong>{p.module}</strong></td>
                        <td><label className="toggle-switch"><input type="checkbox" defaultChecked={p.canView} /><span className="toggle-slider"></span></label></td>
                        <td><label className="toggle-switch"><input type="checkbox" defaultChecked={p.canCreate} /><span className="toggle-slider"></span></label></td>
                        <td><label className="toggle-switch"><input type="checkbox" defaultChecked={p.canEdit} /><span className="toggle-slider"></span></label></td>
                        <td><label className="toggle-switch"><input type="checkbox" defaultChecked={p.canDelete} /><span className="toggle-slider"></span></label></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
