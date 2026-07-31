/**
 * src/constants/api.js
 * All API endpoint paths – single source of truth.
 */
export const ENDPOINTS = Object.freeze({
    // Auth
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // Users
    USERS: '/users',
    MY_PROFILE: '/users/me',
    MY_PASSWORD: '/users/me/password',
});
