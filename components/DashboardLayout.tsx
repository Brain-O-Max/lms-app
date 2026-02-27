'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navVariant?: 'white' | 'gradient';
  pageStyles?: React.CSSProperties;
}

export default function DashboardLayout({ children, navVariant = 'gradient', pageStyles }: DashboardLayoutProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <Navbar variant={navVariant} onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="main-content" style={pageStyles}>
        {children}
      </main>
    </>
  );
}
