/**
 * src/components/layout/Navbar.jsx
 * Top navigation bar with page title and user actions.
 */

import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const PAGE_TITLES = {
    '/': 'Dashboard',
    '/users': 'User Management',
    '/businesses': 'Businesses',
    '/inspections': 'Inspections',
    '/inspectors': 'Inspectors',
    '/reports': 'Reports',
    '/analytics': 'Analytics',
    '/alerts': 'Alerts',
    '/settings': 'Settings',
    '/profile': 'My Profile',
    '/profile/password': 'Change Password',
};

export default function Navbar() {
    const { pathname } = useLocation();
    const { user } = useAuth();
    const title = PAGE_TITLES[pathname] ?? 'Food Inspection Monitor';

    return (
        <header className="navbar">
            <div className="flex-1">
                <h1 className="font-semibold text-gray-800 text-base">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-gray-500 hover:text-gray-800 text-lg" title="Notifications">
                    🔔
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">0</span>
                </button>
                <span className="text-sm text-gray-600 font-medium hidden sm:block">{user?.fullName}</span>
            </div>
        </header>
    );
}
