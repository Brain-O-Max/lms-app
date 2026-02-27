'use client';

import { useAuth } from '@/lib/auth-context';
import { roleLabels, UserRole } from '@/lib/types';
import Link from 'next/link';

interface NavbarProps {
  variant?: 'white' | 'gradient';
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export default function Navbar({ variant = 'gradient', onToggleSidebar, showSidebarToggle = true }: NavbarProps) {
  const { userName, userRole, logout, switchRole } = useAuth();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    if (newRole) {
      switchRole(newRole);
    }
  };

  return (
    <nav className={`navbar ${variant === 'white' ? 'navbar-white' : 'navbar-gradient'}`}>
      {showSidebarToggle && (
        <button className="menu-toggle" id="menuToggle" onClick={onToggleSidebar}>
          ☰
        </button>
      )}
      <Link href="/" className="navbar-brand">
        📚 LMS Solution
      </Link>
      <div className="navbar-actions">
        <select
          className="form-select"
          style={{
            fontSize: 'var(--text-sm)',
            padding: '0.5rem',
            ...(variant === 'gradient'
              ? {
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                }
              : {}),
          }}
          onChange={handleRoleChange}
          defaultValue=""
        >
          <option value="" style={{ color: '#333' }}>
            🔄 Switch Role
          </option>
          <option value="admin" style={{ color: '#333' }}>Admin</option>
          <option value="headoffice" style={{ color: '#333' }}>Head Office</option>
          <option value="territorymanager" style={{ color: '#333' }}>Territory Manager</option>
          <option value="unitmanager" style={{ color: '#333' }}>Unit Manager</option>
          <option value="ro" style={{ color: '#333' }}>RO</option>
          <option value="beneficiary" style={{ color: '#333' }}>Beneficiary</option>
        </select>
        <Link href="/profile" className="navbar-user">
          <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{userName.split('@')[0]}</div>
            <div className="user-role">{roleLabels[userRole] || 'User'}</div>
          </div>
        </Link>
        <button
          className={`btn btn-sm ${variant === 'gradient' ? 'btn-nav' : 'btn-secondary'}`}
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              logout();
              window.location.href = '/login';
            }
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
