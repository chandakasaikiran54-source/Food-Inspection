/**
 * src/layouts/MainLayout.jsx
 * Root layout: Sidebar + Navbar + page content area.
 */

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Navbar from '../components/layout/Navbar.jsx';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Navbar />
            <main className="page-content">
                <Outlet />
            </main>
        </div>
    );
}
