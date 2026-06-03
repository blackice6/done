import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { initialUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('gk_currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, password: string): boolean => {
    const user = initialUsers.find(u => u.email === email && u.password === password && u.isActive);
    if (user) {
      const userData = { id: user.id, username: user.username, email: user.email, phone: user.phone, password: '', role: user.role, isActive: user.isActive };
      setCurrentUser(userData);
      localStorage.setItem('gk_currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gk_currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
