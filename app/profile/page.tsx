'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import { demoModules } from '@/lib/demo-data';
import { roleLabels } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
  const { userName, userRole } = useAuth();
  const [editMode, setEditMode] = useState(false);

  const getModuleProgress = () => {
    if (typeof window === 'undefined') return {};
    const p = localStorage.getItem('moduleProgress');
    return p ? JSON.parse(p) : {};
  };

  const progress = getModuleProgress();
  const completedCount = Object.values(progress).filter((v) => v === true).length;
  const totalModules = demoModules.length;
  const progressPercent = totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100);

  return (
    <DashboardLayout navVariant="white">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="profile-header">
          <div className="profile-avatar-large">{userName.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <div className="profile-name">{userName.split('@')[0]}</div>
            <div className="profile-role">{roleLabels[userRole] || 'User'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          {!editMode ? (
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
          ) : (
            <><button className="btn btn-success" onClick={() => { alert('Profile updated successfully! ✅'); setEditMode(false); }}>✅ Save Changes</button><button className="btn btn-secondary" onClick={() => setEditMode(false)}>❌ Cancel</button></>
          )}
        </div>

        <div className="info-section">
          <h3>👤 Personal Information</h3>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Full Name</span>{editMode ? <input type="text" className="form-input" defaultValue="John Doe" /> : <span className="info-value">John Doe</span>}</div>
            <div className="info-item"><span className="info-label">Email</span>{editMode ? <input type="email" className="form-input" defaultValue="john@example.com" /> : <span className="info-value">john@example.com</span>}</div>
            <div className="info-item"><span className="info-label">Mobile Number</span>{editMode ? <input type="tel" className="form-input" defaultValue="+880 1XXX-XXXXXX" /> : <span className="info-value">+880 1XXX-XXXXXX</span>}</div>
            <div className="info-item"><span className="info-label">Date of Birth</span>{editMode ? <input type="date" className="form-input" defaultValue="1990-01-01" /> : <span className="info-value">January 1, 1990</span>}</div>
            <div className="info-item"><span className="info-label">Gender</span>{editMode ? <select className="form-select"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select> : <span className="info-value">Male</span>}</div>
            <div className="info-item"><span className="info-label">National ID (NID)</span>{editMode ? <input type="text" className="form-input" defaultValue="XXXXXXXXXXXX" /> : <span className="info-value">XXXXXXXXXXXX</span>}</div>
          </div>
        </div>

        <div className="info-section">
          <h3>🏠 Household Details</h3>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Family Members</span>{editMode ? <input type="number" className="form-input" defaultValue={5} /> : <span className="info-value">5</span>}</div>
            <div className="info-item"><span className="info-label">Monthly Income (BDT)</span>{editMode ? <input type="number" className="form-input" defaultValue={25000} /> : <span className="info-value">25,000</span>}</div>
            <div className="info-item"><span className="info-label">Relationship to Migrant</span>{editMode ? <select className="form-select"><option value="self">Self</option><option value="spouse">Spouse</option><option value="parent">Parent</option><option value="child">Child</option></select> : <span className="info-value">Spouse</span>}</div>
            <div className="info-item"><span className="info-label">Primary Earnings Source</span>{editMode ? <input type="text" className="form-input" defaultValue="Agriculture" /> : <span className="info-value">Agriculture</span>}</div>
          </div>
        </div>

        <div className="info-section">
          <h3>✈️ Migration &amp; Financial Details</h3>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Migrant Country</span>{editMode ? <input type="text" className="form-input" defaultValue="Saudi Arabia" /> : <span className="info-value">Saudi Arabia</span>}</div>
            <div className="info-item"><span className="info-label">Years Abroad</span>{editMode ? <input type="number" className="form-input" defaultValue={5} /> : <span className="info-value">5</span>}</div>
            <div className="info-item"><span className="info-label">Monthly Remittance (BDT)</span>{editMode ? <input type="number" className="form-input" defaultValue={30000} /> : <span className="info-value">30,000</span>}</div>
            <div className="info-item"><span className="info-label">Bank Account Usage</span>{editMode ? <select className="form-select"><option value="yes">Yes</option><option value="no">No</option></select> : <span className="info-value">Yes</span>}</div>
            <div className="info-item"><span className="info-label">Insurance Coverage</span>{editMode ? <select className="form-select"><option value="yes">Yes</option><option value="no">No</option></select> : <span className="info-value">No</span>}</div>
            <div className="info-item"><span className="info-label">Digital App Usage</span>{editMode ? <select className="form-select"><option value="yes">Yes</option><option value="no">No</option></select> : <span className="info-value">Yes</span>}</div>
          </div>
        </div>

        {userRole === 'beneficiary' && (
          <div className="info-section">
            <h3>📊 Learning Progress</h3>
            <div className="grid grid-cols-1 grid-md-2 gap-lg">
              <div><div className="info-label">Modules Completed</div><div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--space-sm)' }}>{completedCount}/{totalModules}</div><div className="progress"><div className="progress-bar" style={{ width: `${progressPercent}%` }}></div></div></div>
              <div><div className="info-label">Overall Progress</div><div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 'var(--space-sm)' }}>{progressPercent}%</div><Link href="/contents" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>Continue Learning →</Link></div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
