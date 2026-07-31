/**
 * src/components/layout/Navbar.jsx
 * Modern, glassmorphic top navigation bar with breadcrumbs, search, notifications dropdown, and quick profile controls.
 */

import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Menu,
  Search,
  Bell,
  User,
  ShieldAlert,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  X,
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
        {/* Left Section: Mobile Menu Toggle + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Health Dept</span>
              <span>/</span>
              <span className="text-indigo-600 font-semibold">{currentTitle}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Center: Global Instant Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search business name, license #, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </form>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span className="font-semibold text-sm">System Alerts</span>
                  </div>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-semibold border border-rose-500/30">
                    {unreadAlerts.length} Urgent
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {unreadAlerts.map((alert) => (
                    <Link
                      key={alert.id}
                      to="/alerts"
                      onClick={() => setShowNotifications(false)}
                      className="p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors block"
                    >
                      <div
                        className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {alert.businessName}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {alert.description}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{alert.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <Link
                    to="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View All Safety Notifications &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* User Profile Quick Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.fullName ?? 'Officer'}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {user?.role ?? 'Role'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" /> Account Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" /> System Preferences
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
