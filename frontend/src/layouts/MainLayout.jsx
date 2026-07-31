/**
 * src/layouts/MainLayout.jsx
 * Root layout: Sidebar + Navbar + Government-styled page container.
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Navbar from '../components/layout/Navbar.jsx';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: 'var(--gov-bg)', color: 'var(--gov-primary)', fontFamily: 'var(--font-family-main)' }}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="page-content-wrapper animate-fade-in">
        <div className="max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>

      {/* ── Government Footer ──────────────────── */}
      <footer
        className="text-center py-4 text-[11px] font-medium border-t"
        style={{
          marginLeft: 'var(--sidebar-width)',
          backgroundColor: '#efe9d0',
          borderColor: '#ddd9c9',
          color: 'rgba(61,64,91,0.55)',
        }}
      >
        Government of Andhra Pradesh · Greater Visakhapatnam Municipal Corporation · Public Health Department · Version 1.0
      </footer>
    </div>
  );
}
