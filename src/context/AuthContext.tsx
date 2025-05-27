import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  email: string;
  role: 'admin' | 'employee';
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password?: string) => {
    if (email === 'chat@shopeeia.com' && password === 'shopeeadmin') {
      setUser({ email, role: 'admin' });
      return true;
    }
    if (email.endsWith('@shopeemobile-external.com')) {
      setUser({ email, role: 'employee' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}; 