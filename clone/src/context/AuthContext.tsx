import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '../types';
import { users, loginCredentials } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('gk_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, password: string) => {
    const cred = loginCredentials.find(c => c.email === email && c.password === password);
    if (!cred) return { success: false, error: 'Invalid email or password' };

    const foundUser = users.find(u => u.email === email)!;
    setUser(foundUser);
    sessionStorage.setItem('gk_user', JSON.stringify(foundUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('gk_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
