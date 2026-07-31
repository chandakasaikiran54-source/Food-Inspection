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
  AlertTriangle,
  Award,
  Wallet,
  FileText,
  HelpCircle,
  CalendarDays,
  FileBadge2
} from 'lucide-react';

const NAV_ITEMS = [
  // ──────────────── Shared & Internal Roles ────────────────
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'] },
  { to: '/businesses', icon: Building2, label: 'Food Businesses', roles: ['ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'] },
  { to: '/inspections', icon: ClipboardCheck, label: 'Inspections', roles: ['ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'], badge: '5 New' },
  { to: '/alerts', icon: Bell, label: 'Safety Alerts', roles: ['ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'], badge: 'Critical', badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { to: '/reports', icon: FileBarChart, label: 'Reports', roles: ['ADMIN', 'COMMISSIONER', 'SUPERVISOR'] },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', roles: ['ADMIN', 'COMMISSIONER'] },
  { to: '/users', icon: Users, label: 'User Directory', roles: ['ADMIN'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'] },

  // ──────────────── STRICTLY SHOP OWNER (BUSINESS) ROLES ────────────────
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['BUSINESS'] },
  { to: '/#my-business', icon: Building2, label: 'My Business', roles: ['BUSINESS'] },
  { to: '/#license', icon: FileBadge2, label: 'License & Certificates', roles: ['BUSINESS'] },
  { to: '/#inspection-history', icon: ClipboardCheck, label: 'Inspection History', roles: ['BUSINESS'] },
  { to: '/#inspection-schedule', icon: CalendarDays, label: 'Inspection Schedule', roles: ['BUSINESS'] },
  { to: '/#violations', icon: AlertTriangle, label: 'Violations & Notices', roles: ['BUSINESS'] },
  { to: '/#fines', icon: Wallet, label: 'Fines & Payments', roles: ['BUSINESS'] },
  { to: '/#documents', icon: FileText, label: 'Documents', roles: ['BUSINESS'] },
  { to: '/alerts', icon: Bell, label: 'Alerts & Notifications', roles: ['BUSINESS'] },
  { to: '/profile', icon: UserCheck, label: 'Profile & Business Details', roles: ['BUSINESS'] },
  { to: '/#support', icon: HelpCircle, label: 'Help & Support', roles: ['BUSINESS'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const getInitials = (name, role) => {
    if (!name) return role?.substring(0, 2).toUpperCase() || 'AD';
    const parts = name.trim().split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // Safe checks locking out exact views
  const visibleItems = NAV_ITEMS.filter(({ roles }) => roles?.includes(user?.role));

  const isBusiness = user?.role === 'BUSINESS';

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
          {isBusiness ? (
            <p className="gov-section-label">BUSINESS PORTAL</p>
          ) : (
            <p className="gov-section-label">Main Navigation</p>
          )}

          {visibleItems.map(({ to, icon: Icon, label, badge, badgeColor }) => (
            <NavLink
              key={`${to}-${label}`}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => {
                // If it's a hash link, NavLink's isActive alone won't work well without tracking hash, 
                // but native isActive still checks location. So we can just rely on standard NavLink.
                // However, since to="/#hash" matches when hash changes, we must rely on it manually.
                const isHashActive = to.includes('#') && window.location.hash === to.split('/')[1];
                const active = isActive || isHashActive;
                return `sidebar-link group ${active ? 'active' : ''}`;
              }}
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
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 text-white shadow"
              style={{ backgroundColor: 'var(--gov-secondary)', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              {getInitials(user?.fullName, user?.role)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">
                {user?.fullName ?? (isBusiness ? 'Business Owner' : 'Authorized Officer')}
              </p>

              {isBusiness ? (
                <>
                  <p className="text-white/60 text-[9px] font-medium leading-snug truncate mt-0.5 tracking-wider">
                    REGISTERED FOOD BUSINESS
                  </p>
                  <p className="text-white/80 text-[11px] font-semibold truncate mt-0.5">
                    {user?.businessName || user?.fullName || 'Business Outlet'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <p className="text-white/50 text-[10px] uppercase tracking-wider truncate">
                      Status: {user?.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider truncate">
                    {user?.role ?? 'Officer'}
                  </p>
                </div>
              )}
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
