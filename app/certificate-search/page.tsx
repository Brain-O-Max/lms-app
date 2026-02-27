'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function CertificateSearchPage() {
  const { userRole } = useAuth();

  if (userRole !== 'admin') {
    return <DashboardLayout navVariant="gradient"><div className="container"><div className="alert alert-error">⛔ Access denied. This page is only accessible to administrators.</div><Link href="/" className="btn btn-primary">← Back to Home</Link></div></DashboardLayout>;
  }

  return (
    <DashboardLayout navVariant="gradient">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1>🎓 Certificate Search</h1>
          <p className="text-muted">Search and verify issued certificates</p>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>🔍 Search Certificates</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Certificate ID</label><input type="text" className="form-input" placeholder="e.g., LMS-2026-ABC123" /></div>
            <div className="form-group"><label className="form-label">Beneficiary Mobile</label><input type="tel" className="form-input" placeholder="01XXXXXXXXX" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">District</label><select className="form-select"><option value="">All Districts</option><option>Chattogram</option><option>Feni</option><option>Cumilla</option></select></div>
            <div className="form-group"><label className="form-label">Date Range</label><input type="date" className="form-input" /></div>
          </div>
          <button className="btn btn-primary">🔍 Search</button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>📋 Recent Certificates</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Certificate ID</th><th>Beneficiary</th><th>Course</th><th>Issued Date</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td>LMS-2026-ABC12</td><td>John Doe</td><td>Digital Financial Literacy</td><td>2026-01-12</td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('View certificate')}>View</button></td></tr>
                <tr><td>LMS-2026-DEF34</td><td>Jane Smith</td><td>Digital Financial Literacy</td><td>2026-01-10</td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('View certificate')}>View</button></td></tr>
                <tr><td>LMS-2026-GHI56</td><td>Abdul Haque</td><td>Digital Financial Literacy</td><td>2026-01-08</td><td><button className="btn btn-sm btn-secondary" onClick={() => alert('View certificate')}>View</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
