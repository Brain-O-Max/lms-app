'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    roleName: string;
    gender: string | null;
    dob: string | null;
    nid: string | null;
    familyMembers: number | null;
    monthlyIncome: number | null;
    relationToMigrant: string | null;
    primaryEarnings: string | null;
    migrantCountry: string | null;
    yearsAbroad: number | null;
    monthlyRemittance: number | null;
    bankAccountUsage: boolean | null;
    insuranceCoverage: boolean | null;
    digitalAppUsage: boolean | null;
  };
  progress: { completedCount: number; totalModules: number; progressPercent: number } | null;
}

export default function ProfilePage() {
  const { userRole } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    // Collect form data from input fields
    const inputs = document.querySelectorAll('#profileForm input, #profileForm select');
    const formData: Record<string, string> = {};
    inputs.forEach((input) => {
      const el = input as HTMLInputElement | HTMLSelectElement;
      if (el.name) formData[el.name] = el.value;
    });

    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    alert('Profile updated successfully! ✅');
    setEditMode(false);
    // Refresh data
    const res = await fetch('/api/profile');
    setData(await res.json());
  };

  if (loading) {
    return <DashboardLayout navVariant="white"><div className="container"><div className="text-muted" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>⏳ Loading profile...</div></div></DashboardLayout>;
  }

  const u = data?.user;
  const p = data?.progress;

  return (
    <DashboardLayout navVariant="white">
      <div className="container" style={{ maxWidth: '900px' }} id="profileForm">
        <div className="profile-header">
          <div className="profile-avatar-large">{u?.name?.charAt(0).toUpperCase() || 'U'}</div>
          <div className="profile-info">
            <div className="profile-name">{u?.name || 'User'}</div>
            <div className="profile-role">{u?.roleName || 'User'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          {!editMode ? (
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
          ) : (
            <><button className="btn btn-success" onClick={handleSave}>✅ Save Changes</button><button className="btn btn-secondary" onClick={() => setEditMode(false)}>❌ Cancel</button></>
          )}
        </div>

        <div className="info-section">
          <h3>👤 Personal Information</h3>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Full Name</span>{editMode ? <input type="text" name="name" className="form-input" defaultValue={u?.name || ''} /> : <span className="info-value">{u?.name || '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Email</span>{editMode ? <input type="email" name="email" className="form-input" defaultValue={u?.email || ''} /> : <span className="info-value">{u?.email || '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Mobile Number</span><span className="info-value">{u?.mobile || '-'}</span></div>
            <div className="info-item"><span className="info-label">Date of Birth</span>{editMode ? <input type="date" name="dob" className="form-input" defaultValue={u?.dob?.split('T')[0] || ''} /> : <span className="info-value">{u?.dob ? new Date(u.dob).toLocaleDateString() : '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Gender</span>{editMode ? <select name="gender" className="form-select" defaultValue={u?.gender || ''}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select> : <span className="info-value">{u?.gender || '-'}</span>}</div>
            <div className="info-item"><span className="info-label">National ID (NID)</span>{editMode ? <input type="text" name="nid" className="form-input" defaultValue={u?.nid || ''} /> : <span className="info-value">{u?.nid || '-'}</span>}</div>
          </div>
        </div>

        <div className="info-section">
          <h3>🏠 Household Details</h3>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Family Members</span>{editMode ? <input type="number" name="familyMembers" className="form-input" defaultValue={u?.familyMembers || ''} /> : <span className="info-value">{u?.familyMembers ?? '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Monthly Income (BDT)</span>{editMode ? <input type="number" name="monthlyIncome" className="form-input" defaultValue={u?.monthlyIncome || ''} /> : <span className="info-value">{u?.monthlyIncome?.toLocaleString() ?? '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Relationship to Migrant</span>{editMode ? <select name="relationToMigrant" className="form-select" defaultValue={u?.relationToMigrant || ''}><option value="self">Self</option><option value="spouse">Spouse</option><option value="parent">Parent</option><option value="child">Child</option></select> : <span className="info-value">{u?.relationToMigrant || '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Primary Earnings Source</span>{editMode ? <input type="text" name="primaryEarnings" className="form-input" defaultValue={u?.primaryEarnings || ''} /> : <span className="info-value">{u?.primaryEarnings || '-'}</span>}</div>
          </div>
        </div>

        <div className="info-section">
          <h3>✈️ Migration &amp; Financial Details</h3>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Migrant Country</span>{editMode ? <input type="text" name="migrantCountry" className="form-input" defaultValue={u?.migrantCountry || ''} /> : <span className="info-value">{u?.migrantCountry || '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Years Abroad</span>{editMode ? <input type="number" name="yearsAbroad" className="form-input" defaultValue={u?.yearsAbroad || ''} /> : <span className="info-value">{u?.yearsAbroad ?? '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Monthly Remittance (BDT)</span>{editMode ? <input type="number" name="monthlyRemittance" className="form-input" defaultValue={u?.monthlyRemittance || ''} /> : <span className="info-value">{u?.monthlyRemittance?.toLocaleString() ?? '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Bank Account Usage</span>{editMode ? <select name="bankAccountUsage" className="form-select" defaultValue={u?.bankAccountUsage ? 'yes' : 'no'}><option value="yes">Yes</option><option value="no">No</option></select> : <span className="info-value">{u?.bankAccountUsage ? 'Yes' : u?.bankAccountUsage === false ? 'No' : '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Insurance Coverage</span>{editMode ? <select name="insuranceCoverage" className="form-select" defaultValue={u?.insuranceCoverage ? 'yes' : 'no'}><option value="yes">Yes</option><option value="no">No</option></select> : <span className="info-value">{u?.insuranceCoverage ? 'Yes' : u?.insuranceCoverage === false ? 'No' : '-'}</span>}</div>
            <div className="info-item"><span className="info-label">Digital App Usage</span>{editMode ? <select name="digitalAppUsage" className="form-select" defaultValue={u?.digitalAppUsage ? 'yes' : 'no'}><option value="yes">Yes</option><option value="no">No</option></select> : <span className="info-value">{u?.digitalAppUsage ? 'Yes' : u?.digitalAppUsage === false ? 'No' : '-'}</span>}</div>
          </div>
        </div>

        {userRole === 'beneficiary' && p && (
          <div className="info-section">
            <h3>📊 Learning Progress</h3>
            <div className="grid grid-cols-1 grid-md-2 gap-lg">
              <div><div className="info-label">Modules Completed</div><div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--space-sm)' }}>{p.completedCount}/{p.totalModules}</div><div className="progress"><div className="progress-bar" style={{ width: `${p.progressPercent}%` }}></div></div></div>
              <div><div className="info-label">Overall Progress</div><div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--space-sm)' }}>{p.progressPercent}%</div><Link href="/contents" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>Continue Learning →</Link></div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
