/**
 * src/components/layout/Navbar.jsx
 * GVMC Official Design – Top Navigation Bar
 * Food Safety Inspection Monitoring System
 * Government of Andhra Pradesh – GVMC
 */

import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import GvmcLogo from './GvmcLogo.jsx';
import {
  Menu,
  Search,
  Bell,
  User,
  ShieldAlert,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { INITIAL_ALERTS } from '../../services/mockData.js';

const ROUTE_NAMES = {
  '/': 'Dashboard Overview',
  '/businesses': 'Food Businesses',
  '/inspections': 'Inspection Management',
  '/inspectors': 'Inspectors Directory',
  '/reports': 'Health Reports & Certificates',
  '/analytics': 'Analytics & Safety Metrics',
  '/alerts': 'Urgent Safety Alerts',
  '/users': 'User & Role Administration',
  '/settings': 'System Settings',
  '/profile': 'My Account Profile',
  '/profile/password': 'Change Password',
};

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentTitle = ROUTE_NAMES[location.pathname] || 'Government Portal';
  const unreadAlerts = INITIAL_ALERTS.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/businesses?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="navbar-glass">
      <div className="w-full flex items-center justify-between gap-4">

        {/* ── Left: Mobile Toggle + Branding ─── */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--gov-primary)' }}
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop branding: single GVMC logo + app title */}
          <div className="hidden lg:flex items-center gap-3">
            <GvmcLogo size="md" rounded="lg" className="border border-gray-200" />
            <div className="leading-tight">
              <p className="text-sm font-bold" style={{ color: 'var(--gov-primary)' }}>
                Food Safety Inspection Monitoring System
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                Government of Andhra Pradesh · Greater Visakhapatnam Municipal Corporation · Public Health Department
              </p>
            </div>
          </div>

          {/* Mobile: Page Title */}
          <div className="lg:hidden min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: 'var(--gov-primary)' }}>
              {currentTitle}
            </p>
          </div>
        </div>

        {/* ── Center: Global Search ─────────── */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs hidden xl:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search business, license #, ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none placeholder:text-gray-400 transition-all"
            />
          </div>
        </form>

        {/* ── Right: Actions + Profile ──────── */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              style={{ color: 'var(--gov-primary)' }}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts.length > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white animate-pulse"
                  style={{ backgroundColor: 'var(--gov-accent)' }}
                />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="p-4 flex items-center justify-between border-b border-gray-100" style={{ backgroundColor: 'var(--gov-primary)' }}>
                  <div className="flex items-center gap-2 text-white">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="font-semibold text-sm">Safety Alerts</span>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                    style={{ backgroundColor: 'rgba(224,122,95,0.2)', color: '#f9c3b6', borderColor: 'rgba(224,122,95,0.4)' }}
                  >
                    {unreadAlerts.length} Urgent
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {unreadAlerts.map((alert) => (
                    <Link
                      key={alert.id}
                      to="/alerts"
                      onClick={() => setShowNotifications(false)}
                      className="p-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors block"
                    >
                      <div
                        className="p-2 rounded-lg shrink-0 mt-0.5"
                        style={{
                          backgroundColor: alert.severity === 'CRITICAL' ? 'var(--gov-accent-subtle)' : 'var(--gov-highlight-subtle)',
                          color: alert.severity === 'CRITICAL' ? 'var(--gov-accent)' : '#8a6e20',
                        }}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-900 truncate">{alert.businessName}</p>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{alert.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{alert.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                  <Link
                    to="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: 'var(--gov-primary)' }}
                  >
                    View All Safety Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm"
                style={{ backgroundColor: 'var(--gov-primary)' }}
              >
                {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold leading-tight" style={{ color: 'var(--gov-primary)' }}>
                  {user?.fullName ?? 'Officer'}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  {user?.role ?? 'Role'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2 animate-fade-in">
                <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                  <p className="text-xs font-bold text-gray-900">{user?.fullName}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" /> Account Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-gray-400" /> System Preferences
                </Link>

                <div className="h-px bg-gray-100 my-1" />

                <button
                  onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  style={{ color: 'var(--gov-accent)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--gov-accent-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
