'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function ReportsPage() {
  const reports = [
    { icon: '📊', title: 'Beneficiary Progress Report', desc: 'Comprehensive report of all beneficiaries with their course completion percentages and status.', format: 'Excel Format', records: '1,248 Records', type: 'beneficiary-progress' },
    { icon: '📅', title: 'Session Summary Report', desc: 'Detailed information about all training sessions including participants, locations, and outcomes.', format: 'Excel Format', records: '24 Sessions', type: 'session-summary' },
    { icon: '🗺️', title: 'Location-wise Distribution', desc: 'Geographic breakdown of beneficiaries and completion rates by district, upazila, and union.', format: 'Excel Format', records: '8 Districts', type: 'location-distribution' },
    { icon: '👥', title: 'Gender Analysis Report', desc: 'Statistical analysis of male and female participation, completion rates, and demographics.', format: 'Excel Format', records: 'Full Analytics', type: 'gender-analysis' },
    { icon: '🎯', title: 'Unit Manager Performance', desc: 'Performance metrics for each Unit Manager including sessions conducted and participants trained.', format: 'Excel Format', records: '15 Managers', type: 'um-performance' },
    { icon: '🎓', title: 'Certificate Issuance Report', desc: 'List of all certificates issued with beneficiary details, completion dates, and certificate IDs.', format: 'Excel Format', records: '742 Certificates', type: 'certificate-issuance' },
    { icon: '📚', title: 'Module-wise Completion', desc: 'Detailed completion rates and analytics for each individual course module.', format: 'Excel Format', records: '5 Modules', type: 'module-completion' },
  ];

  const downloadReport = (reportType: string) => {
    alert(`Downloading ${reportType} report...`);
  };

  return (
    <DashboardLayout navVariant="white">

      <div className="container">
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1>Reports</h1>
          <p className="text-muted">Generate and download comprehensive reports</p>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>📅 Report Filters</h3>
          <div className="grid grid-cols-1 grid-md-2 grid-lg-3 gap-md">
            <div className="form-group"><label className="form-label" htmlFor="startDate">Start Date</label><input type="date" id="startDate" className="form-input" defaultValue="2026-01-01" /></div>
            <div className="form-group"><label className="form-label" htmlFor="endDate">End Date</label><input type="date" id="endDate" className="form-input" defaultValue="2026-01-12" /></div>
            <div className="form-group"><label className="form-label" htmlFor="reportDistrict">District</label><select id="reportDistrict" className="form-select"><option value="">All Districts</option><option value="Dhaka">Dhaka</option><option value="Chittagong">Chittagong</option><option value="Sylhet">Sylhet</option></select></div>
          </div>
        </div>

        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Available Reports</h2>
        <div className="reports-grid">
          {reports.map((r) => (
            <div key={r.type} className="report-card">
              <div className="report-icon">{r.icon}</div>
              <h3 className="report-title">{r.title}</h3>
              <p className="report-description">{r.desc}</p>
              <div className="report-meta">
                <div className="report-meta-item"><span>📄</span><span>{r.format}</span></div>
                <div className="report-meta-item"><span>{r.icon}</span><span>{r.records}</span></div>
              </div>
              <button className="btn btn-primary btn-full" onClick={() => downloadReport(r.type)}>📥 Download Report</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
