import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/auth';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospitalId?: string;
  doctorId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token: string, statistics?: object) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Decode JWT payload and check exp without a library */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');

    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // corrupted storage — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('statistics');
      }
    } else if (storedToken) {
      // Token is expired — clean up
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('statistics');
    }

    setIsLoading(false);
  }, []);

  const login = useCallback((newUser: AuthUser, newToken: string, statistics?: object) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    if (statistics) {
      localStorage.setItem('statistics', JSON.stringify(statistics));
    }
    setUser(newUser);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('statistics');
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
