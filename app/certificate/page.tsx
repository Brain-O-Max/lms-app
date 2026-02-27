'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function CertificatePage() {
  return (
    <DashboardLayout navVariant="gradient">
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: 'var(--space-3xl)', borderRadius: 'var(--radius-2xl)', marginBottom: 'var(--space-2xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🎓</div>
          <h1 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>Certificate of Completion</h1>
          <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9 }}>Digital Financial Literacy Course</p>
        </div>

        <div className="card" style={{ textAlign: 'left' }}>
          <div className="card-header"><h3 className="card-title">Certificate Details</h3></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certificate ID</strong><p>LMS-2026-ABC123</p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issued Date</strong><p>February 27, 2026</p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Course Name</strong><p>Digital Financial Literacy</p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modules Completed</strong><p>5/5</p></div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={() => alert('Certificate download will be implemented with backend')}>📥 Download Certificate</button>
            <button className="btn btn-secondary" onClick={() => alert('Certificate sharing will be implemented')}>📤 Share</button>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: 'var(--space-xl)', textAlign: 'left' }}>
          <strong>ℹ️ Note:</strong> Complete all 5 modules of the Digital Financial Literacy course to get your certificate. Certificate generation will be implemented in the backend.
        </div>
      </div>
    </DashboardLayout>
  );
}
