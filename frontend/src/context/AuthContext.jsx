/**
 * src/context/AuthContext.jsx
 * Global authentication state.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { ENDPOINTS } from '../constants/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
    });
    const [loading, setLoading] = useState(true);

    // ─── Bootstrap – verify stored token on mount ──────────────────────────────
    useEffect(() => {
        const verify = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) { setLoading(false); return; }
            try {
                const { data } = await api.get(ENDPOINTS.ME);
                setUser(data.data);
                localStorage.setItem('user', JSON.stringify(data.data));
            } catch {
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
        const { data } = await api.post(ENDPOINTS.LOGIN, credentials);
        const { accessToken, user: u } = data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(u));
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        setUser(u);
        return u;
    }, []);

    const logout = useCallback(async () => {
        try { await api.post(ENDPOINTS.LOGOUT); } catch { /* ignore */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        delete api.defaults.headers.common.Authorization;
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const { data } = await api.get(ENDPOINTS.ME);
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
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
