/**
 * src/components/layout/Sidebar.jsx
 * Fixed dark sidebar with navigation links (Tailwind).
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const NAV = [
    { to: '/', icon: '🏠', label: 'Dashboard', roles: null },
    { to: '/users', icon: '👥', label: 'Users', roles: ['ADMIN'] },
    { to: '/businesses', icon: '🏢', label: 'Businesses', roles: null },
    { to: '/inspections', icon: '📋', label: 'Inspections', roles: null },
    { to: '/inspectors', icon: '👷', label: 'Inspectors', roles: ['ADMIN', 'SUPERVISOR'] },
    { to: '/reports', icon: '📊', label: 'Reports', roles: ['ADMIN', 'COMMISSIONER', 'SUPERVISOR'] },
    { to: '/analytics', icon: '📈', label: 'Analytics', roles: ['ADMIN', 'COMMISSIONER'] },
    { to: '/alerts', icon: '🚨', label: 'Alerts', roles: null },
    { to: '/settings', icon: '⚙️', label: 'Settings', roles: ['ADMIN'] },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out');
        navigate('/login', { replace: true });
    };

    const visible = NAV.filter(({ roles }) => !roles || roles.includes(user?.role));

    return (
        <aside className="sidebar fixed left-0 top-0 h-screen flex flex-col z-50" style={{ width: 'var(--sidebar-width)' }}>
            {/* Brand */}
            <div className="px-5 py-5 border-b border-white/10">
                <p className="text-white font-bold text-base leading-tight">🍽️ Food Inspection</p>
                <p className="text-slate-400 text-xs mt-0.5">Monitor v1.0</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                {visible.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span>{icon}</span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User card + logout */}
            <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-2">
                <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <div className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                        {user?.fullName?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-xs font-medium truncate">{user?.fullName}</p>
                        <p className="text-slate-400 text-[10px] truncate">{user?.role}</p>
                    </div>
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="sidebar-link w-full text-left text-red-300 hover:bg-red-900/30 hover:text-red-100"
                >
                    <span>🚪</span><span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
