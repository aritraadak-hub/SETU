import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      localStorage.removeItem('setu_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const login = async (credentials: any) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('setu_token', res.data.token);
        }
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(res.data.error || 'Login failed');
    } catch (err: any) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('setu_token', res.data.token);
        }
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(res.data.error || 'Registration failed');
    } catch (err: any) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('setu_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
