'use client';

import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isLoggedIn, userRole, userName } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const commonItems = [
    { icon: '📊', title: 'Analytics', desc: 'View insights & metrics', href: '/analytics', primary: true },
    { icon: '📚', title: 'Courses', desc: 'Browse courses', href: '/courses' },
    { icon: '📖', title: 'Modules', desc: 'Learning content', href: '/contents' },
  ];

  const staffItems = [
    { icon: '📄', title: 'Reports', desc: 'Generate reports', href: '/reports' },
    { icon: '🎓', title: 'Certificates', desc: 'Search certificates', href: '/certificate-search' },
  ];

  const adminItems = [
    { icon: '🔐', title: 'Roles', desc: 'Manage roles', href: '/roles' },
    { icon: '🔑', title: 'Permissions', desc: 'Role permissions', href: '/permissions' },
    { icon: '👤', title: 'Users', desc: 'User management', href: '/users' },
    { icon: '⚙️', title: 'Settings', desc: 'System settings', href: '/admin-settings' },
  ];

  const profileItem = { icon: '👤', title: 'Profile', desc: 'Your profile', href: '/profile' };

  let mainMenuItems: typeof commonItems;
  let showAdminSection = false;
  let welcomeMessage = 'Manage your learning management system with ease. Select a feature below to get started.';

  if (userRole === 'beneficiary') {
    mainMenuItems = [
      { icon: '📚', title: 'My Learning', desc: 'Continue learning', href: '/contents', primary: true },
      { icon: '📊', title: 'My Progress', desc: 'Track progress', href: '/analytics' },
      { ...profileItem, primary: false },
    ];
    welcomeMessage = 'Continue your learning journey. Access your courses and track your progress.';
  } else {
    mainMenuItems = [...commonItems, ...staffItems, { ...profileItem, primary: false }];
    if (userRole === 'admin') {
      showAdminSection = true;
    }
  }

  return (
    <>
      <Navbar variant="gradient" showSidebarToggle={false} />

      {/* Hero Section */}
      <div className="landing-hero">
        <h1>Welcome to LMS Solution</h1>
        <p>{welcomeMessage}</p>
      </div>

      {/* Main Features */}
      <h2 className="section-title">📌 Quick Access</h2>
      <div className="menu-grid">
        {mainMenuItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`menu-card${item.primary ? ' primary' : ''}`}
          >
            <span className="menu-card-icon">{item.icon}</span>
            <div className="menu-card-title">{item.title}</div>
            <div className="menu-card-desc">{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* Admin Tools Section */}
      {showAdminSection && (
        <div>
          <hr className="section-divider" />
          <h2 className="section-title">⚙️ Administration</h2>
          <div className="menu-grid">
            {adminItems.map((item, i) => (
              <Link key={i} href={item.href} className="menu-card">
                <span className="menu-card-icon">{item.icon}</span>
                <div className="menu-card-title">{item.title}</div>
                <div className="menu-card-desc">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
