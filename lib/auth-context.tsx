'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthContextType, UserRole } from './types';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('beneficiary');
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is authenticated via API
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
          setUserRole(data.user.role as UserRole);
          setUserName(data.user.name);
          setUserEmail(data.user.email || data.user.mobile);
        }
      })
      .catch(() => {
        // Not authenticated
      });
  }, []);

  const login = useCallback(async (mobile: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) return false;

      setIsLoggedIn(true);
      setUserRole(data.user.role as UserRole);
      setUserName(data.user.name);
      setUserEmail(data.user.email || data.user.mobile);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setUserRole('beneficiary');
    setUserName('User');
    setUserEmail('');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUserRole(role);
    setUserName(role.charAt(0).toUpperCase() + role.slice(1));
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userRole, userName, userEmail, login, logout, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
