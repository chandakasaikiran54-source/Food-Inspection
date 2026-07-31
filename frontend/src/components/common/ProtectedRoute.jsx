/**
 * src/components/common/ProtectedRoute.jsx
 * Wraps routes that require authentication.
 * Redirects to /login if not authenticated.
 * Redirects to /unauthorized if authenticated but wrong role.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
