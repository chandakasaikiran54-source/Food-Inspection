/**
 * src/context/AuthContext.jsx
 * Global authentication state with seamless dummy / demo login fallback.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { ENDPOINTS } from '../constants/api.js';

const AuthContext = createContext(null);

const DEMO_USERS = {
  'admin@health.gov': {
    id: 'demo-admin-1',
    fullName: 'Dr. Arthur Pendelton',
    email: 'admin@health.gov',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLogin: new Date().toISOString(),
  },
  'inspector@health.gov': {
    id: 'demo-insp-1',
    fullName: 'Officer David Kim',
    email: 'inspector@health.gov',
    role: 'INSPECTOR',
    status: 'ACTIVE',
    lastLogin: new Date().toISOString(),
  },
  'supervisor@health.gov': {
    id: 'demo-sup-1',
    fullName: 'Supervisor Mark Sterling',
    email: 'supervisor@health.gov',
    role: 'SUPERVISOR',
    status: 'ACTIVE',
    lastLogin: new Date().toISOString(),
  },
  'commissioner@health.gov': {
    id: 'demo-comm-1',
    fullName: 'Commissioner Helena Vance',
    email: 'commissioner@health.gov',
    role: 'COMMISSIONER',
    status: 'ACTIVE',
    lastLogin: new Date().toISOString(),
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // ─── Bootstrap – verify stored token on mount ──────────────────────────────
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // If using a demo token, do not require backend verification
      if (token.startsWith('demo-token-')) {
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            /* ignore */
          }
        }
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(ENDPOINTS.ME);
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      } catch {
        // If API fails but we have a stored local user, keep it in demo mode
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  const login = useCallback(async (credentials) => {
    const emailKey = credentials?.email?.toLowerCase()?.trim();
    
    // Check if backend API is reachable or fallback to demo login
    try {
      const { data } = await api.post(ENDPOINTS.LOGIN, credentials);
      const { accessToken, user: u } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(u));
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      setUser(u);
      return u;
    } catch (err) {
      // Backend offline or error -> Fallback to Dummy / Demo User
      const demoUser = DEMO_USERS[emailKey] || {
        id: `demo-user-${Date.now()}`,
        fullName: credentials?.email?.split('@')[0]?.replace('.', ' ')?.toUpperCase() || 'Health Officer',
        email: credentials?.email || 'officer@health.gov',
        role: 'ADMIN',
        status: 'ACTIVE',
        lastLogin: new Date().toISOString(),
      };

      const demoToken = `demo-token-${Date.now()}`;
      localStorage.setItem('accessToken', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post(ENDPOINTS.LOGOUT);
    } catch {
      /* ignore backend failure on logout */
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get(ENDPOINTS.ME);
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
    } catch {
      /* fallback to local user */
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
