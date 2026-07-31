/**
 * src/routes/index.jsx
 * Application router with protected routes and RBAC.
 */

import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout.jsx';

// Auth
import LoginPage from '../pages/auth/LoginPage.jsx';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

// Protected pages
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import ProfilePage from '../pages/profile/ProfilePage.jsx';
import ChangePasswordPage from '../pages/profile/ChangePasswordPage.jsx';
import UserManagementPage from '../pages/users/UserManagementPage.jsx';
import BusinessesPage from '../pages/businesses/BusinessesPage.jsx';
import InspectorsPage from '../pages/inspectors/InspectorsPage.jsx';
import InspectionsPage from '../pages/inspections/InspectionsPage.jsx';
import ReportsPage from '../pages/reports/ReportsPage.jsx';
import AnalyticsPage from '../pages/analytics/AnalyticsPage.jsx';
import AlertsPage from '../pages/alerts/AlertsPage.jsx';
import SettingsPage from '../pages/settings/SettingsPage.jsx';

// Guard
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';

const router = createBrowserRouter([
    // ─── Public ──────────────────────────────────────────────────────────────
    { path: '/login', element: <LoginPage /> },
    { path: '/unauthorized', element: <UnauthorizedPage /> },
    { path: '*', element: <NotFoundPage /> },

    // ─── Protected – any authenticated user ──────────────────────────────────
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: '/', element: <DashboardPage /> },
                    { path: '/profile', element: <ProfilePage /> },
                    { path: '/profile/password', element: <ChangePasswordPage /> },
                    { path: '/businesses', element: <BusinessesPage /> },
                    { path: '/inspections', element: <InspectionsPage /> },
                    { path: '/alerts', element: <AlertsPage /> },
                ],
            },
        ],
    },

    // ─── Protected – ADMIN + SUPERVISOR ──────────────────────────────────────
    {
        element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: '/inspectors', element: <InspectorsPage /> },
                ],
            },
        ],
    },

    // ─── Protected – ADMIN + COMMISSIONER + SUPERVISOR ───────────────────────
    {
        element: <ProtectedRoute allowedRoles={['ADMIN', 'COMMISSIONER', 'SUPERVISOR']} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: '/reports', element: <ReportsPage /> },
                ],
            },
        ],
    },

    // ─── Protected – ADMIN + COMMISSIONER ────────────────────────────────────
    {
        element: <ProtectedRoute allowedRoles={['ADMIN', 'COMMISSIONER']} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: '/analytics', element: <AnalyticsPage /> },
                ],
            },
        ],
    },

    // ─── Protected – ADMIN only ───────────────────────────────────────────────
    {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: '/users', element: <UserManagementPage /> },
                    { path: '/settings', element: <SettingsPage /> },
                ],
            },
        ],
    },
]);

export default router;
