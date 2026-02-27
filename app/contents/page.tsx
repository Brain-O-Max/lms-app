'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useAuth } from '@/lib/auth-context';
import { demoModules } from '@/lib/demo-data';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ContentsPage() {
  const { userRole } = useAuth();
  const [showContentModal, setShowContentModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const getModuleProgress = () => {
    if (typeof window === 'undefined') return {};
    const p = localStorage.getItem('moduleProgress');
    return p ? JSON.parse(p) : {};
  };

  const progress = getModuleProgress();
  const completedCount = Object.values(progress).filter(v => v === true).length;
  const isAdmin = userRole === 'admin';

  return (
    <DashboardLayout navVariant="white">

      <div className="container">
        {isAdmin && (
          <div className="admin-controls">
            <h3>📝 Content Management</h3>
            <p className="text-muted">Upload and configure course modules</p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setShowContentModal(true)}>➕ Add New Content</button>
              <button className="btn btn-primary" onClick={() => setShowModuleModal(true)}>➕ Add New Module</button>
              <button className="btn btn-secondary" onClick={() => setShowSettingsModal(true)}>⚙️ Module Settings</button>
            </div>
          </div>
        )}
      </div>

      {/* Course Header */}
      <div className="course-header">
        <h1>📚 Digital Financial Literacy</h1>
        <p>Master essential financial skills for managing money, banking, remittances, and investments</p>
        <div className="course-stats">
          <div className="course-stat"><span className="course-stat-value">5</span><span className="course-stat-label">Modules</span></div>
          <div className="course-stat"><span className="course-stat-value">{completedCount}</span><span className="course-stat-label">Completed</span></div>
          <div className="course-stat"><span className="course-stat-value">4h 10m</span><span className="course-stat-label">Total Duration</span></div>
        </div>
      </div>

      <h2>Course Modules</h2>
      <div className="modules-grid">
        {demoModules.map((mod, i) => {
          const isCompleted = progress[mod.id] === true;
          return (
            <div key={mod.id} className={`module-card${isCompleted ? ' completed' : ''}`}>
              <div className="module-thumbnail-container">
                <Image src={mod.thumbnail} alt={mod.title} width={400} height={160} className="module-thumbnail" style={{ objectFit: 'cover' }} />
                {isCompleted && <span className="badge badge-success" style={{ position: 'absolute', top: 'var(--space-sm)', right: 'var(--space-sm)', zIndex: 10 }}>✅ COMPLETED</span>}
              </div>
              <div className="module-content">
                <div className="module-header">
                  <span className="module-number">Module {i + 1}</span>
                  <span className="module-type">{mod.type}</span>
                </div>
                <div className="module-title">{mod.title}</div>
                <div className="module-description">{mod.description}</div>
                <div className="module-footer">
                  <span className="module-duration">⏱️ {mod.duration}</span>
                  <Link
                    href={`/module-detail?id=${mod.id}`}
                    className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-primary'}`}
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    {isCompleted ? '✅ Review' : '▶ Start'}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Content Modal */}
      <Modal isOpen={showContentModal} onClose={() => setShowContentModal(false)} title="📚 Add New Content/Course" size="lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowContentModal(false)}>Cancel</button><button className="btn btn-success">✅ Create Course</button></>}>
        <form>
          <div className="form-group"><label className="form-label form-label-required">Course Title</label><input type="text" className="form-input" placeholder="e.g., Digital Financial Literacy" /></div>
          <div className="form-group"><label className="form-label form-label-required">Description</label><textarea className="form-textarea" placeholder="Describe the course..."></textarea></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label form-label-required">Category</label><select className="form-select"><option value="">Select</option><option>Financial Literacy</option><option>Digital Skills</option></select></div>
            <div className="form-group"><label className="form-label">Total Duration</label><input type="text" className="form-input" placeholder="e.g., 4h 30m" /></div>
          </div>
        </form>
      </Modal>

      {/* Add Module Modal */}
      <Modal isOpen={showModuleModal} onClose={() => setShowModuleModal(false)} title="➕ Add New Module" size="lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowModuleModal(false)}>Cancel</button><button className="btn btn-success">✅ Add Module</button></>}>
        <form>
          <div className="form-group"><label className="form-label form-label-required">Select Content/Course</label><select className="form-select"><option value="">Choose...</option><option>Digital Financial Literacy</option></select></div>
          <div className="form-group"><label className="form-label form-label-required">Module Title</label><input type="text" className="form-input" placeholder="e.g., Introduction to Budgeting" /></div>
          <div className="form-group"><label className="form-label form-label-required">Description</label><textarea className="form-textarea" placeholder="What students will learn..."></textarea></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label form-label-required">Module Number</label><input type="number" className="form-input" min={1} /></div>
            <div className="form-group"><label className="form-label form-label-required">Duration</label><input type="text" className="form-input" placeholder="e.g., 45 min" /></div>
          </div>
          <div className="form-group"><label className="form-label form-label-required">Video URL</label><input type="url" className="form-input" placeholder="https://www.youtube.com/watch?v=..." /></div>
        </form>
      </Modal>

      {/* Module Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="⚙️ Module Settings" size="lg"
        footer={<button className="btn btn-primary" onClick={() => setShowSettingsModal(false)}>Close</button>}>
        <h4 style={{ marginBottom: 'var(--space-lg)' }}>Manage Existing Modules</h4>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Module #</th><th>Title</th><th>Duration</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {demoModules.map((mod, i) => (
                <tr key={mod.id}><td>{i + 1}</td><td>{mod.title}</td><td>{mod.duration}</td><td><span className="badge badge-success">Active</span></td>
                  <td><button className="btn btn-sm btn-secondary" onClick={() => alert('Edit module')}>Edit</button> <button className="btn btn-sm btn-danger" onClick={() => alert('Delete module')}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <div className="alert alert-info"><strong>ℹ️ Note:</strong> Module reordering, editing, and deletion will be fully implemented in the backend with .NET Core.</div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
