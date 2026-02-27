'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
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
            {modules.map((mod) => (
              <div key={mod.id} className={`module-card ${mod.completed ? 'completed' : ''}`}>
                <div className="module-thumbnail" onClick={() => setSelectedModule(mod)}>
                  {mod.thumbnail ? (
                    <Image src={mod.thumbnail} alt={mod.title} width={300} height={180} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-100)', fontSize: 'var(--text-3xl)' }}>📚</div>
                  )}
                  <span className="module-badge">{mod.type}</span>
                </div>
                <div className="module-content">
                  <h3 className="module-title">{mod.title}</h3>
                  <p className="module-description">{mod.description}</p>
                  <div className="module-meta">
                    <span>⏱️ {mod.duration}</span>
                    <span>{mod.completed ? '✅ Completed' : '📝 Not Started'}</span>
                  </div>
                  <div className="module-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => setSelectedModule(mod)}>
                      {mod.completed ? '🔁 Review' : '▶️ Start'}
                    </button>
                    {userRole === 'beneficiary' && (
                      <button
                        className={`btn btn-sm ${mod.completed ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => handleToggleComplete(mod.id, !mod.completed)}
                      >
                        {mod.completed ? '↩️ Undo' : '✅ Complete'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
