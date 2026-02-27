'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { demoUsers } from './demo-data';
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
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      setIsLoggedIn(true);
      setUserRole((localStorage.getItem('userRole') as UserRole) || 'beneficiary');
      setUserName(localStorage.getItem('userName') || 'User');
      setUserEmail(localStorage.getItem('userEmail') || '');
    }
  }, []);

  const login = useCallback((email: string, _password: string): boolean => {
    const userInfo = demoUsers[email.trim()];
    if (!userInfo) return false;

    localStorage.setItem('userRole', userInfo.role);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userMobile', email);
    localStorage.setItem('userName', userInfo.name);
    localStorage.setItem('isLoggedIn', 'true');

    setIsLoggedIn(true);
    setUserRole(userInfo.role);
    setUserName(userInfo.name);
    setUserEmail(email);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole('beneficiary');
    setUserName('User');
    setUserEmail('');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', role.charAt(0).toUpperCase() + role.slice(1));
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
