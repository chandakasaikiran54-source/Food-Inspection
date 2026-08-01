/**
 * src/services/api.js
 * Axios instance with automatic JWT injection and 401 redirect.
 */

import axios from 'axios';
import config from '../config/config.js';

const API_BASE = config.apiUrl;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor – attach access token ────────────────────────────────
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ─── Response interceptor – handle 401 (token refresh or logout) ─────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token) => {
    failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return api(original);
                });
            }

            original._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
                const newToken = data.data?.accessToken;
                if (newToken) {
                    localStorage.setItem('accessToken', newToken);
                    api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    original.headers.Authorization = `Bearer ${newToken}`;
                    return api(original);
                }
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
