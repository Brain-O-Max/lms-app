'use client';

import { useAuth } from '@/lib/auth-context';
import { menuConfig } from '@/lib/menu-config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { userRole, logout } = useAuth();
  const pathname = usePathname();
  const menuItems = menuConfig[userRole] || menuConfig.beneficiary;

  return (
    <aside className={`sidebar${isOpen ? ' active' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">📚 LMS</div>
      </div>
      <nav className="sidebar-nav" id="sidebarNav">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={index}
              href={item.href}
              className={`sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button
          className="btn btn-danger btn-full"
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              logout();
              window.location.href = '/login';
            }
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
