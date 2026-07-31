/**
 * src/components/layout/Sidebar.jsx
 * Modern, clean, dark-themed sidebar navigation using lucide-react icons.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardCheck,
  UserCheck,
  FileBarChart,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  UtensilsCrossed,
  ShieldCheck,
  ChevronRight,
  UserCircle2,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: null },
  { to: '/businesses', icon: Building2, label: 'Businesses', roles: null },
  { to: '/inspections', icon: ClipboardCheck, label: 'Inspections', roles: null, badge: '5 New' },
  { to: '/inspectors', icon: UserCheck, label: 'Inspectors', roles: ['ADMIN', 'SUPERVISOR'] },
  { to: '/alerts', icon: Bell, label: 'Alerts', roles: null, badge: 'Critical', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { to: '/reports', icon: FileBarChart, label: 'Reports', roles: ['ADMIN', 'COMMISSIONER', 'SUPERVISOR'] },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', roles: ['ADMIN', 'COMMISSIONER'] },
  { to: '/users', icon: Users, label: 'User Directory', roles: ['ADMIN'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['ADMIN'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const visibleItems = NAV_ITEMS.filter(({ roles }) => !roles || roles.includes(user?.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`sidebar fixed left-0 top-0 h-screen flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: 'var(--sidebar-width)' }}
      >
        {/* Brand Logo & Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 ring-1 ring-white/20">
              <UtensilsCrossed className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-base tracking-tight">FoodInspect</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Health Dept Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-1.5 scrollbar-thin">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {visibleItems.map(({ to, icon: Icon, label, badge, badgeColor }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link group ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    badgeColor || 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Action Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-1 ring-white/10 shrink-0">
              {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-100 text-xs font-semibold truncate group-hover:text-indigo-300 transition-colors">
                {user?.fullName ?? 'Authorized User'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-slate-400 text-[11px] font-medium truncate uppercase tracking-wider">
                  {user?.role ?? 'Officer'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
