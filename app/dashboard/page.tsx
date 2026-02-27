'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import { demoModules } from '@/lib/demo-data';
import Link from 'next/link';

export default function DashboardPage() {
  const { userRole, userName } = useAuth();

  const getModuleProgress = () => {
    if (typeof window === 'undefined') return {};
    const progress = localStorage.getItem('moduleProgress');
    return progress ? JSON.parse(progress) : {};
  };

  const progress = getModuleProgress();
  const completedModules = Object.values(progress).filter((v) => v === true).length;
  const totalModules = demoModules.length;
  const completionPercentage = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);

  return (
    <DashboardLayout navVariant="white">

      <div className="container">
        <h1>Welcome to Your Dashboard</h1>
        <p className="text-muted">Track your learning progress and manage your activities</p>

        {/* Stats Grid */}
        <div className="stats-grid">
          {userRole === 'beneficiary' ? (
            <>
              <div className="stat-card">
                <div className="stat-header"><div className="stat-icon">📚</div></div>
                <div className="stat-label">Total Modules</div>
                <div className="stat-value">{totalModules}</div>
              </div>
              <div className="stat-card success">
                <div className="stat-header"><div className="stat-icon success">✅</div></div>
                <div className="stat-label">Completed</div>
                <div className="stat-value">{completedModules}</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-header"><div className="stat-icon warning">⏳</div></div>
                <div className="stat-label">In Progress</div>
                <div className="stat-value">{totalModules - completedModules}</div>
              </div>
              <div className="stat-card info">
                <div className="stat-header"><div className="stat-icon info">📊</div></div>
                <div className="stat-label">Progress</div>
                <div className="stat-value">{completionPercentage}%</div>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card">
                <div className="stat-header"><div className="stat-icon">👥</div></div>
                <div className="stat-label">Total Beneficiaries</div>
                <div className="stat-value">1,248</div>
                <div className="stat-change">↑ 12% this month</div>
              </div>
              <div className="stat-card success">
                <div className="stat-header"><div className="stat-icon success">✅</div></div>
                <div className="stat-label">Completed Courses</div>
                <div className="stat-value">856</div>
                <div className="stat-change">↑ 8% this month</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-header"><div className="stat-icon warning">📅</div></div>
                <div className="stat-label">Active Sessions</div>
                <div className="stat-value">24</div>
              </div>
              <div className="stat-card info">
                <div className="stat-header"><div className="stat-icon info">🎓</div></div>
                <div className="stat-label">Certificates Issued</div>
                <div className="stat-value">742</div>
                <div className="stat-change">↑ 15% this month</div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          {userRole === 'beneficiary' ? (
            <>
              <Link href="/contents" className="action-btn">
                <div className="action-icon">📚</div>
                <div className="action-content"><h4>Continue Learning</h4><p>Resume your modules</p></div>
              </Link>
              <Link href="/profile" className="action-btn">
                <div className="action-icon">👤</div>
                <div className="action-content"><h4>My Profile</h4><p>Update your information</p></div>
              </Link>
              {completionPercentage === 100 && (
                <Link href="/contents#certificate" className="action-btn">
                  <div className="action-icon">🎓</div>
                  <div className="action-content"><h4>Get Certificate</h4><p>Download your certificate</p></div>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/analytics" className="action-btn">
                <div className="action-icon">📈</div>
                <div className="action-content"><h4>View Analytics</h4><p>Check performance metrics</p></div>
              </Link>
              <Link href="/reports" className="action-btn">
                <div className="action-icon">📄</div>
                <div className="action-content"><h4>Generate Reports</h4><p>Download Excel reports</p></div>
              </Link>
              <Link href="/contents" className="action-btn">
                <div className="action-icon">📚</div>
                <div className="action-content"><h4>Manage Contents</h4><p>Upload and configure modules</p></div>
              </Link>
              {userRole === 'admin' && (
                <Link href="/admin-settings" className="action-btn">
                  <div className="action-icon">⚙️</div>
                  <div className="action-content"><h4>System Settings</h4><p>Configure LMS settings</p></div>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <p className="card-subtitle">Your latest learning activities</p>
          </div>
          <div className="card-body">
            <p className="text-muted">No recent activity to display</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
