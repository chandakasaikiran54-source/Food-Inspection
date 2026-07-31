/**
 * src/context/AuthContext.jsx
 * Global authentication state with seamless dummy / demo login fallback.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { ENDPOINTS } from '../constants/api.js';

const AuthContext = createContext(null);

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
      // Stop completely if no token exists in local storage organically natively
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(ENDPOINTS.ME);
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      } catch (error) {
        // Validation thoroughly failed -> Wipe stored memory elegantly safely cleanly
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  const login = useCallback(async (credentials) => {
    // Check real backend API natively robustly inherently securely
    const { data } = await api.post(ENDPOINTS.LOGIN, credentials);
    const { accessToken, user: u } = data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(u));
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setUser(u);
    return u;
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
