/**
 * src/constants/routes.js
 * All frontend route paths in one place.
 * Import in router and navigation – never hard-code strings.
 */

const ROUTES = Object.freeze({
    // Auth
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',

    // App
    DASHBOARD: '/',
    BUSINESSES: '/businesses',
    BUSINESS_DETAIL: '/businesses/:id',
    INSPECTORS: '/inspectors',
    INSPECTOR_DETAIL: '/inspectors/:id',
    INSPECTIONS: '/inspections',
    INSPECTION_DETAIL: '/inspections/:id',
    REPORTS: '/reports',
    ANALYTICS: '/analytics',
    ALERTS: '/alerts',
    SETTINGS: '/settings',
});

export default ROUTES;
