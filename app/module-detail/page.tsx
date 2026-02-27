'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { demoModules } from '@/lib/demo-data';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';

// Extended module data with learning objectives & topics
const moduleDetails: Record<number, { objectives: string[]; topics: string[] }> = {
  1: {
    objectives: [
      'Understand the importance of financial literacy in daily life',
      'Learn basic financial terminology and concepts',
      'Recognize the impact of financial decisions on your future',
      'Identify common financial mistakes and how to avoid them',
    ],
    topics: [
      'What is Financial Literacy?',
      'Why Financial Literacy Matters',
      'Basic Financial Concepts',
      'Financial Goals and Planning',
      'Common Financial Pitfalls',
    ],
  },
  2: {
    objectives: [
      'Create a personal or household budget',
      'Track income and expenses effectively',
      'Develop healthy saving habits',
      'Set realistic financial goals',
      'Use budgeting tools and apps',
    ],
    topics: [
      'Understanding Income and Expenses',
      'Creating Your First Budget',
      'The 50/30/20 Rule',
      'Saving Strategies',
      'Emergency Fund Basics',
      'Budgeting Tools and Apps',
    ],
  },
  3: {
    objectives: [
      'Understand different types of bank accounts',
      'Learn how to use ATMs and online banking safely',
      'Master mobile banking and digital payment apps',
      'Recognize and avoid digital fraud',
      'Use digital wallets effectively',
    ],
    topics: [
      'Types of Bank Accounts',
      'Opening a Bank Account',
      'ATM Usage and Safety',
      'Online Banking Features',
      'Mobile Banking Apps',
      'Digital Payment Systems (bKash, Nagad, Rocket)',
      'Security Best Practices',
    ],
  },
  4: {
    objectives: [
      'Understand the remittance process',
      'Compare different remittance channels',
      'Learn how to send and receive money safely',
      'Minimize remittance costs',
      'Track and manage remittances effectively',
    ],
    topics: [
      'What is Remittance?',
      'Formal vs Informal Channels',
      'Choosing the Right Service',
      'Cost Comparison',
      'Safety and Security',
      'Documentation Requirements',
      'Managing Received Remittances',
    ],
  },
  5: {
    objectives: [
      'Understand basic investment principles',
      'Learn about different investment options',
      'Recognize the importance of insurance',
      'Choose appropriate insurance coverage',
      'Balance risk and return in investments',
    ],
    topics: [
      'Introduction to Investing',
      'Types of Investments (Savings, Bonds, Stocks)',
      'Risk and Return',
      'Diversification Basics',
      'Types of Insurance (Life, Health, Property)',
      'Choosing Insurance Coverage',
      'Long-term Financial Planning',
    ],
  },
};

function ModuleDetailContent() {
  const searchParams = useSearchParams();
  const moduleId = parseInt(searchParams.get('id') || '1');
  const mod = demoModules.find(m => m.id === moduleId) || demoModules[0];
  const details = moduleDetails[moduleId] || moduleDetails[1];

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState(0);

  const getModuleProgress = () => {
    if (typeof window === 'undefined') return {};
    const p = localStorage.getItem('moduleProgress');
    return p ? JSON.parse(p) : {};
  };

  const [progress, setProgress] = useState<Record<number, boolean>>(getModuleProgress());
  const isCompleted = progress[moduleId] === true;

  const handleMarkComplete = useCallback(() => {
    if (isCompleted) {
      alert('This module is already marked as complete!');
      return;
    }
    if (confirm('Mark this module as complete?')) {
      const updated = { ...progress, [moduleId]: true };
      setProgress(updated);
      localStorage.setItem('moduleProgress', JSON.stringify(updated));

      // Check if all modules completed
      const allDone = demoModules.every(m => updated[m.id] === true);
      if (allDone) {
        setTimeout(() => {
          if (confirm("Congratulations! You've completed all modules. Would you like to view your certificate?")) {
            window.location.href = '/certificate';
          }
        }, 500);
      } else {
        alert('Module marked as complete! 🎉');
      }
    }
  }, [isCompleted, progress, moduleId]);

  const handleDownload = useCallback(() => {
    setDownloading(true);
    setDownloadPercent(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setDownloadPercent(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloading(false);
          alert('Video downloaded successfully! You can now watch it offline.');
        }, 500);
      }
    }, 100);
  }, []);

  const prevId = moduleId > 1 ? moduleId - 1 : null;
  const nextId = moduleId < demoModules.length ? moduleId + 1 : null;

  return (
    <DashboardLayout navVariant="white">
      {/* Module Hero */}
      <div className="module-hero">
        <div className="container">
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 'var(--text-base)', padding: '0.5rem 1rem', marginBottom: 'var(--space-md)', display: 'inline-block' }}>
            Module {moduleId} of {demoModules.length}
          </span>
          <h1 style={{ color: 'white' }}>{mod.title}</h1>
          <p>{mod.description}</p>
          <div className="module-meta-hero">
            <div className="meta-item"><span>⏱️</span><span>{mod.duration}</span></div>
            <div className="meta-item"><span>📹</span><span>{mod.type}</span></div>
            <div className="meta-item">
              <span>{isCompleted ? '✅' : '⏳'}</span>
              <span>{isCompleted ? 'Completed' : 'Not Started'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Container */}
      <div className="module-container">
        {/* Back Button */}
        <Link href="/contents" className="btn btn-secondary" style={{ marginBottom: 'var(--space-lg)', display: 'inline-block' }}>
          ← Back to Contents
        </Link>

        {/* Video Section */}
        <div className="video-section">
          <h2>📹 Video Lesson</h2>
          <div className="video-wrapper">
            {!videoLoaded ? (
              <div className="video-placeholder">
                <div className="play-button" onClick={() => setVideoLoaded(true)}>▶</div>
                <p>Click to start the lesson</p>
              </div>
            ) : (
              <iframe
                src={`${mod.videoUrl}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={mod.title}
              />
            )}
          </div>
          <div className="video-controls">
            <button className="btn btn-primary" onClick={() => setVideoLoaded(true)}>▶️ Play Video</button>
            <button className="btn btn-secondary" onClick={handleDownload}>📥 Download for Offline</button>
            <button
              className={`btn ${isCompleted ? 'btn-secondary' : 'btn-success'}`}
              onClick={handleMarkComplete}
            >
              {isCompleted ? '✅ Completed' : '✅ Mark as Complete'}
            </button>
          </div>
          {downloading && (
            <div className="download-progress active">
              <p><strong>📥 Downloading video for offline viewing...</strong></p>
              <div className="progress progress-lg" style={{ marginTop: 'var(--space-md)' }}>
                <div className="progress-bar" style={{ width: `${downloadPercent}%` }}></div>
              </div>
              <p className="text-muted" style={{ marginTop: 'var(--space-sm)', marginBottom: 0 }}>
                {downloadPercent}% complete
              </p>
            </div>
          )}
        </div>

        {/* Learning Objectives */}
        <div className="content-section">
          <h2>🎯 Learning Objectives</h2>
          <ul className="learning-objectives">
            {details.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Key Topics */}
        <div className="content-section">
          <h2>📚 Key Topics Covered</h2>
          <div className="grid grid-cols-1 grid-md-2 gap-md">
            {details.topics.map((topic, i) => (
              <div key={i} style={{ padding: 'var(--space-md)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="navigation-buttons">
          {prevId ? (
            <Link href={`/module-detail?id=${prevId}`} className="btn btn-secondary">← Previous Module</Link>
          ) : (
            <button className="btn btn-secondary" disabled style={{ opacity: 0.5 }}>← Previous Module</button>
          )}
          {nextId ? (
            <Link href={`/module-detail?id=${nextId}`} className="btn btn-primary">Next Module →</Link>
          ) : (
            <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>Next Module →</button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ModuleDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>Loading module...</div>}>
      <ModuleDetailContent />
    </Suspense>
  );
}
