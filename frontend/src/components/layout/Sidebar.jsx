/**
 * src/components/layout/Sidebar.jsx
 * GVMC Official Design – Sidebar Navigation
 * Food Safety Inspection Monitoring System
 * Government of Andhra Pradesh – GVMC
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import GvmcLogo from './GvmcLogo.jsx';
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
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: null },
  { to: '/businesses', icon: Building2, label: 'Food Businesses', roles: null },
  { to: '/inspections', icon: ClipboardCheck, label: 'Inspections', roles: null, badge: '5 New' },
  { to: '/inspectors', icon: UserCheck, label: 'Inspectors', roles: ['ADMIN', 'SUPERVISOR'] },
  { to: '/alerts', icon: Bell, label: 'Safety Alerts', roles: null, badge: 'Critical', badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30' },
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`sidebar fixed left-0 top-0 h-screen flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        style={{ width: 'var(--sidebar-width)' }}
      >
        {/* ── Brand Header ─────────────────────── */}
        <div className="px-5 py-5 border-b border-white/10">
          {/* GVMC Logo + App Title */}
          <div className="flex items-center gap-3 mb-4">
            <GvmcLogo size="lg" rounded="xl" />
            <div>
              <p className="text-white font-bold text-sm leading-tight">GVMC</p>
              <p className="text-white/60 text-[10px] leading-snug">Greater Visakhapatnam</p>
              <p className="text-white/60 text-[10px] leading-snug">Municipal Corporation</p>
            </div>
          </div>

          {/* App Name Card */}
          <div className="bg-white/8 rounded-xl p-3 border border-white/10">
            <p className="text-white font-bold text-sm leading-snug">
              Food Safety Inspection
            </p>
            <p className="text-white/60 text-[11px] font-medium mt-0.5">
              Monitoring System
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <ShieldCheck className="w-3 h-3 text-green-400" />
              <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
                Govt. of Andhra Pradesh
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation ───────────────────────── */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
          <p className="gov-section-label">Main Navigation</p>
          {visibleItems.map(({ to, icon: Icon, label, badge, badgeColor }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link group ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor || 'bg-white/15 text-white/80 border-white/20'
                    }`}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer User Card ─────────────────── */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-all group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 text-white shadow"
              style={{ backgroundColor: 'var(--gov-secondary)' }}
            >
              {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">
                {user?.fullName ?? 'Authorized Officer'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider truncate">
                  {user?.role ?? 'Officer'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* ── Footer Tag ──────────────────────── */}
        <div className="px-5 py-3 border-t border-white/10">
          <p className="text-white/30 text-[10px] text-center font-medium">
            Govt. of Andhra Pradesh · GVMC · Public Health Department
          </p>
        </div>
      </aside>
    </>
  );
}
