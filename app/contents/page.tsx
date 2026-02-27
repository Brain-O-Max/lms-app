'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';

interface ModuleData {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  type: string;
  completed: boolean;
}

export default function ContentsPage() {
  const { userRole } = useAuth();
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);

  useEffect(() => {
    fetch('/api/modules')
      .then((res) => res.json())
      .then((data) => { setModules(data.modules || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleToggleComplete = async (moduleId: string, completed: boolean) => {
    await fetch(`/api/modules/${moduleId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, completed } : m))
    );
  };

  const completedModules = modules.filter((m) => m.completed).length;
  const totalModules = modules.length;
  const completionPercentage = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);

  return (
    <DashboardLayout navVariant="gradient">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>📖 Learning Modules</h1>
            <p className="text-muted">Access your financial literacy training materials</p>
          </div>
          {userRole !== 'beneficiary' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Add Module</button>
          )}
        </div>

        {userRole === 'beneficiary' && totalModules > 0 && (
          <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
              <div>
                <h3>📊 Your Progress</h3>
                <p className="text-muted">{completedModules} of {totalModules} modules completed</p>
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--primary)' }}>
                {completionPercentage}%
              </div>
            </div>
            <div className="progress" style={{ marginTop: 'var(--space-md)' }}>
              <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-muted" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>⏳ Loading modules...</div>
        ) : (
          <div className="modules-grid">
            {modules.map((mod, index) => {
              const thumbnail = mod.thumbnail || 'images/module-placeholder.png';
              
              let statusBadge = null;
              let statusClass = '';
              let actionBtnClass = 'btn-start';
              let buttonText = 'Start';
              
              if (mod.completed) {
                statusBadge = <span className="badge badge-success" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', background: '#dcfce7', color: '#166534', fontWeight: '600' }}>Completed</span>;
                statusClass = 'completed';
                actionBtnClass = 'btn-completed';
                buttonText = 'Review';
              }

              return (
                <div key={mod.id} className={`module-card ${statusClass}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedModule(mod)}>
                  <div className="module-thumbnail-container">
                    {statusBadge && (
                      <div className="module-status-badge">
                        {statusBadge}
                      </div>
                    )}
                    {thumbnail.startsWith('/') || thumbnail.startsWith('http') || thumbnail.startsWith('images') ? (
                      // We fall back to a standard img tag because next/image requires configuration for external URLs and valid paths
                      <img src={thumbnail.startsWith('images/') ? `/${thumbnail}` : thumbnail} alt={mod.title} className="module-thumbnail" />
                    ) : (
                      <div className="module-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-100)', fontSize: '3rem' }}>📚</div>
                    )}
                  </div>
                  <div className="module-content">
                    <div className="module-header">
                      <span className="module-number">Module {index + 1}</span>
                      <span className="module-type">{mod.type}</span>
                    </div>
                    <h3 className="module-title">{mod.title}</h3>
                    <p className="module-description">{mod.description}</p>
                    <div className="module-footer">
                      <div className="module-duration">
                        ⏱️ {mod.duration}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {userRole === 'beneficiary' && (
                          <button
                            className={`module-action-btn ${mod.completed ? 'btn-secondary' : 'btn-success'}`}
                            style={{ 
                              padding: '0.4rem 0.8rem', 
                              borderRadius: 'var(--radius-md)', 
                              fontSize: 'var(--text-sm)', 
                              fontWeight: '600', 
                              border: 'none', 
                              cursor: 'pointer',
                              background: mod.completed ? '#e5e7eb' : '#dcfce7',
                              color: mod.completed ? '#4b5563' : '#166534'
                            }}
                            onClick={(e) => { e.stopPropagation(); handleToggleComplete(mod.id, !mod.completed); }}
                          >
                            {mod.completed ? '↩️ Undo' : '✅ Complete'}
                          </button>
                        )}
                        <button
                          className={`module-action-btn ${actionBtnClass}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                          onClick={(e) => { e.stopPropagation(); setSelectedModule(mod); }}
                        >
                          {buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <Modal isOpen={!!selectedModule} onClose={() => setSelectedModule(null)} title={selectedModule?.title || ''} size="lg">
        {selectedModule?.videoUrl && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={selectedModule.videoUrl}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 'var(--radius-lg)' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </Modal>

      {/* Add Module Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Module"
        footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-success" onClick={() => { alert('Module creation coming soon'); setShowModal(false); }}>✅ Submit</button></>}
      >
        <form>
          <div className="form-group"><label className="form-label form-label-required">Module Title</label><input type="text" className="form-input" required /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" rows={3}></textarea></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Duration</label><input type="text" className="form-input" placeholder="e.g., 45 min" /></div>
            <div className="form-group"><label className="form-label">Video URL</label><input type="url" className="form-input" placeholder="https://youtube.com/..." /></div>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
