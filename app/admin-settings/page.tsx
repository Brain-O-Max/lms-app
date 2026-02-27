'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const { userRole } = useAuth();

  if (userRole !== 'admin') {
    return <DashboardLayout navVariant="white"><div className="container"><div className="alert alert-error">⛔ Access denied. This page is only accessible to administrators.</div><Link href="/" className="btn btn-primary">← Back to Home</Link></div></DashboardLayout>;
  }

  return (
    <DashboardLayout navVariant="white">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-2xl)' }}><h1>⚙️ Admin Settings</h1><p className="text-muted">Manage system configurations and settings</p></div>

        <div className="settings-section">
          <h3>📚 Content Configuration</h3>
          <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>Manage course modules and learning content</p>
          <div className="alert alert-info" style={{ marginBottom: 'var(--space-lg)' }}><strong>ℹ️ Note:</strong> Content management features will be fully implemented in the backend with .NET Core and PostgreSQL.</div>
          <div className="grid grid-cols-1 grid-md-2 gap-lg">
            <button className="btn btn-primary btn-lg" onClick={() => alert('Module upload will be implemented in backend')}>➕ Upload New Module</button>
            <button className="btn btn-secondary btn-lg" onClick={() => alert('Module management will be implemented in backend')}>📝 Manage Modules</button>
            <button className="btn btn-secondary btn-lg" onClick={() => alert('Module ordering will be implemented in backend')}>🔄 Reorder Modules</button>
            <button className="btn btn-secondary btn-lg" onClick={() => alert('Module settings will be implemented in backend')}>⚙️ Module Settings</button>
          </div>
        </div>

        <div className="settings-section">
          <h3>👥 User Management</h3>
          <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>Manage users and assign roles</p>
          <div className="table-wrapper"><table className="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            <tr><td>Admin User</td><td>admin@lms.com</td><td><span className="badge badge-error">Admin</span></td><td><span className="badge badge-success">Active</span></td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('User edit will be implemented in backend')}>Edit</button></td></tr>
            <tr><td>Head Office User</td><td>ho@lms.com</td><td><span className="badge badge-warning">Head Office</span></td><td><span className="badge badge-success">Active</span></td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('User edit will be implemented in backend')}>Edit</button></td></tr>
            <tr><td>Beneficiary User</td><td>beneficiary@lms.com</td><td><span className="badge badge-primary">Beneficiary</span></td><td><span className="badge badge-success">Active</span></td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('User edit will be implemented in backend')}>Edit</button></td></tr>
          </tbody></table></div>
          <button className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }} onClick={() => alert('Add user will be implemented in backend')}>➕ Add New User</button>
        </div>

        <div className="settings-section">
          <h3>🗺️ Geo-location Data Management</h3>
          <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>Manage districts, upazilas, and unions</p>
          <div className="grid grid-cols-1 grid-md-3 gap-md">
            <div className="card"><h4>Districts</h4><p className="text-muted">8 Districts</p><button className="btn btn-secondary btn-full" onClick={() => alert('District management will be implemented in backend')}>Manage</button></div>
            <div className="card"><h4>Upazilas</h4><p className="text-muted">Multiple Upazilas</p><button className="btn btn-secondary btn-full" onClick={() => alert('Upazila management will be implemented in backend')}>Manage</button></div>
            <div className="card"><h4>Unions</h4><p className="text-muted">Multiple Unions</p><button className="btn btn-secondary btn-full" onClick={() => alert('Union management will be implemented in backend')}>Manage</button></div>
          </div>
        </div>

        <div className="settings-section">
          <h3>🏢 Unit Office Management</h3>
          <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>Manage unit offices and assignments</p>
          <div className="table-wrapper"><table className="table"><thead><tr><th>Office Name</th><th>District</th><th>Unit Manager</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            <tr><td>Dhaka Central</td><td>Dhaka</td><td>Karim Rahman</td><td><span className="badge badge-success">Active</span></td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('Office edit will be implemented in backend')}>Edit</button></td></tr>
            <tr><td>Chittagong South</td><td>Chittagong</td><td>Fatima Begum</td><td><span className="badge badge-success">Active</span></td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('Office edit will be implemented in backend')}>Edit</button></td></tr>
          </tbody></table></div>
          <button className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }} onClick={() => alert('Add office will be implemented in backend')}>➕ Add New Office</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
