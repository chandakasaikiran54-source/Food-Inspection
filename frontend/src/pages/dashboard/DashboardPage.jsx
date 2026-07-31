/**
 * src/pages/dashboard/DashboardPage.jsx
 * GVMC Official Design – Role-Tailored Executive Dashboard
 * Food Safety Inspection Monitoring System
 * Government of Andhra Pradesh | GVMC | Public Health Department
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Building2,
  ClipboardCheck,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Server,
  Users,
  Award,
  Activity,
  Clock,
  CheckSquare,
  BarChart2,
  Sliders,
  Download,
  Shield,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  INITIAL_BUSINESSES,
  INITIAL_INSPECTIONS,
  INITIAL_ALERTS,
  INITIAL_INSPECTORS,
  MONTHLY_TREND_DATA,
  COMPLIANCE_DISTRIBUTION,
  VIOLATION_CATEGORIES,
} from '../../services/mockData.js';

// Design tokens – reused inline for chart colors
const C = {
  primary: '#3D405B',
  secondary: '#81B29A',
  accent: '#E07A5F',
  highlight: '#F2CC8F',
};

// Admin System Data
const SYSTEM_TRAFFIC_DATA = [
  { time: '08:00', requests: 1200, dbQueries: 3400, activeSessions: 42 },
  { time: '10:00', requests: 3800, dbQueries: 9100, activeSessions: 118 },
  { time: '12:00', requests: 4500, dbQueries: 11200, activeSessions: 145 },
  { time: '14:00', requests: 3200, dbQueries: 8400, activeSessions: 98 },
  { time: '16:00', requests: 2900, dbQueries: 7200, activeSessions: 84 },
  { time: '18:00', requests: 1500, dbQueries: 4100, activeSessions: 52 },
];

const USER_ROLE_DISTRIBUTION = [
  { name: 'Field Inspectors', value: 18, color: C.secondary },
  { name: 'District Supervisors', value: 6, color: C.highlight },
  { name: 'Commissioners', value: 3, color: C.primary },
  { name: 'System Administrators', value: 2, color: C.accent },
];

const INSPECTOR_ROUTE_DATA = [
  { day: 'Mon', completed: 4, passed: 4, failed: 0 },
  { day: 'Tue', completed: 5, passed: 4, failed: 1 },
  { day: 'Wed', completed: 3, passed: 3, failed: 0 },
  { day: 'Thu', completed: 4, passed: 3, failed: 1 },
  { day: 'Fri', completed: 2, passed: 2, failed: 0 },
];

const OFFICER_WORKLOAD_DATA = [
  { name: 'Ravi Kumar', active: 5, completed: 18, avgScore: 86.4 },
  { name: 'Smt. Sowjanya', active: 4, completed: 22, avgScore: 91.2 },
  { name: 'P. Narasimha Rao', active: 3, completed: 14, avgScore: 84.0 },
  { name: 'Dr. S. Prasad', active: 2, completed: 16, avgScore: 89.5 },
];

// ── Shared Components ──────────────────────────────────

function KpiCard({ label, value, trend, icon: Icon, accentColor, trendBg, trendColor }) {
  return (
    <div className="card-modern p-5 space-y-3" style={{ borderTop: `3px solid ${accentColor}` }}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}18` }}>
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: trendBg, color: trendColor }}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: C.primary }}>{value}</p>
        <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

function HeroCard({ badge, badgeStyle, title, subtitle, children }) {
  return (
    <div
      className="card-modern p-6 sm:p-8 text-white"
      style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #2e3147 100%)`, border: 'none' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
            style={badgeStyle}>
            {badge}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
          <p className="text-white/60 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Role Banner */}
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs"
        style={{ backgroundColor: 'var(--gov-primary-subtle)', borderColor: '#c8cad8', color: C.primary }}
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: C.secondary }} />
          <span className="font-bold">Active Privilege View:</span>
          <span
            className="font-extrabold px-2.5 py-0.5 rounded-md"
            style={{ backgroundColor: 'var(--gov-secondary)', color: 'white' }}
          >
            {role} DASHBOARD
          </span>
        </div>
        <span className="text-gray-500 text-[11px]">
          Tailored for <strong style={{ color: C.primary }}>{user?.fullName || 'User'}</strong>
        </span>
      </div>

      {role === 'ADMIN' && <AdminDashboard navigate={navigate} />}
      {role === 'INSPECTOR' && <InspectorDashboard navigate={navigate} user={user} />}
      {role === 'SUPERVISOR' && <SupervisorDashboard navigate={navigate} />}
      {role === 'COMMISSIONER' && <CommissionerDashboard navigate={navigate} />}
      {role === 'BUSINESS' && <ShopOwnerDashboard navigate={navigate} user={user} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   1. ADMIN DASHBOARD
══════════════════════════════════════════════════════════════ */
function AdminDashboard({ navigate }) {
  const kpis = [
    { label: 'Active System Users', value: '29 Users', trend: '100% Online', icon: Users, accentColor: C.primary, trendBg: '#ecedf3', trendColor: C.primary },
    { label: 'Server Health', value: '99.99%', trend: 'Operational', icon: Server, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Registered Businesses', value: INITIAL_BUSINESSES.length, trend: '+8 New', icon: Building2, accentColor: C.accent, trendBg: 'var(--gov-accent-subtle)', trendColor: '#a0432e' },
    { label: 'Daily API Requests', value: '14.2k', trend: 'Normal Load', icon: Activity, accentColor: C.highlight, trendBg: 'var(--gov-highlight-subtle)', trendColor: '#8a6e20' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <HeroCard
        badge="System Administrator Command"
        badgeStyle={{ backgroundColor: 'rgba(129,178,154,0.2)', color: '#a8d5bf', border: '1px solid rgba(129,178,154,0.3)' }}
        title="Technical Infrastructure & Security Center"
        subtitle={`Surveillance API: Healthy (0 Latency Spikes). Database replication active.`}
      >
        <button onClick={() => navigate('/users')} className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20">
          <Users className="w-4 h-4" /> Manage Users
        </button>
        <button onClick={() => navigate('/settings')} className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20">
          <Sliders className="w-4 h-4" /> Settings
        </button>
      </HeroCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Load Chart */}
        <div className="card-modern lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold" style={{ color: C.primary }}>API Throughput & Database Load</h2>
              <p className="text-xs text-gray-500">HTTP requests processed per hour across inspection endpoints</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'var(--gov-primary-subtle)', color: C.primary }}>
              Live Monitor
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SYSTEM_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="govRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeecdf" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: C.primary, borderRadius: '10px', color: '#fff', border: 'none', fontSize: 12 }} />
                <Area type="monotone" dataKey="requests" stroke={C.primary} strokeWidth={2} fill="url(#govRequests)" name="API Requests/hr" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Pie Chart */}
        <div className="card-modern space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>Role Distribution</h2>
            <p className="text-xs text-gray-500">Provisioned accounts by RBAC access tier</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={USER_ROLE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                  {USER_ROLE_DISTRIBUTION.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: C.primary, borderRadius: '10px', color: '#fff', border: 'none', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-2 border-t text-xs" style={{ borderColor: '#eeecdf' }}>
            {USER_ROLE_DISTRIBUTION.map((r) => (
              <div key={r.name} className="flex justify-between font-medium" style={{ color: C.primary }}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.name}
                </span>
                <span className="font-bold">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   2. INSPECTOR DASHBOARD
══════════════════════════════════════════════════════════════ */
function InspectorDashboard({ navigate, user }) {
  const kpis = [
    { label: 'Pending Audits Today', value: '5 Venues', trend: '2 Urgent', icon: Calendar, accentColor: C.primary, trendBg: 'var(--gov-accent-subtle)', trendColor: '#a0432e' },
    { label: 'Completed This Month', value: '18 Audits', trend: '+4 vs Goal', icon: CheckSquare, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Audit Approval Rate', value: '94.2%', trend: 'Grade A Avg', icon: Award, accentColor: C.highlight, trendBg: 'var(--gov-highlight-subtle)', trendColor: '#8a6e20' },
    { label: 'Re-inspections Due', value: '2 Venues', trend: 'High Priority', icon: AlertTriangle, accentColor: C.accent, trendBg: 'var(--gov-accent-subtle)', trendColor: '#a0432e' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <HeroCard
        badge="Field Officer Dispatch Hub"
        badgeStyle={{ backgroundColor: 'rgba(129,178,154,0.2)', color: '#a8d5bf', border: '1px solid rgba(129,178,154,0.3)' }}
        title={`Good day, ${user?.fullName || 'Food Safety Officer Ravi Kumar'}`}
        subtitle="Assigned Ward: MVP Colony & RK Beach. You have 5 scheduled inspections today."
      >
        <button onClick={() => navigate('/inspections?action=new')} className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20">
          <Plus className="w-4 h-4" /> Start Field Audit
        </button>
      </HeroCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bar */}
        <div className="card-modern space-y-4">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>My Weekly Audit Completion</h2>
            <p className="text-xs text-gray-500">Field audits completed this week</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INSPECTOR_ROUTE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeecdf" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: C.primary, borderRadius: '10px', color: '#fff', border: 'none', fontSize: 12 }} />
                <Bar dataKey="completed" fill={C.secondary} radius={[6, 6, 0, 0]} name="Audits Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* My Queue */}
        <div className="card-modern space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>My Assigned Inspection Queue</h2>
            <span className="text-xs font-bold" style={{ color: C.secondary }}>Today's Route</span>
          </div>
          <div className="space-y-3">
            {INITIAL_BUSINESSES.slice(0, 3).map((b, i) => (
              <div key={b.id} className="p-3.5 rounded-xl border flex items-center justify-between gap-3"
                style={{ backgroundColor: '#faf9f2', borderColor: '#e5e2d5' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold" style={{ color: C.secondary }}>#{i + 1}</span>
                    <p className="text-xs font-bold" style={{ color: C.primary }}>{b.name}</p>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{b.district} · {b.riskLevel} RISK</p>
                </div>
                <button onClick={() => navigate('/inspections')} className="btn-ghost text-xs font-semibold" style={{ color: C.primary }}>
                  Launch →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   3. SUPERVISOR DASHBOARD
══════════════════════════════════════════════════════════════ */
function SupervisorDashboard({ navigate }) {
  const kpis = [
    { label: 'Ward Venues Managed', value: '452 Venues', trend: 'Ward 1 & 2', icon: Building2, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Active Field Officers', value: '4 Officers', trend: '100% Active', icon: UserCheck, accentColor: C.primary, trendBg: 'var(--gov-primary-subtle)', trendColor: C.primary },
    { label: 'District Avg Score', value: '86.4 / 100', trend: 'Grade A Target', icon: Award, accentColor: C.highlight, trendBg: 'var(--gov-highlight-subtle)', trendColor: '#8a6e20' },
    { label: 'Overdue Re-inspections', value: '3 Backlogged', trend: 'Needs Assign', icon: AlertCircle, accentColor: C.accent, trendBg: 'var(--gov-accent-subtle)', trendColor: '#a0432e' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <HeroCard
        badge="District Supervisor Command"
        badgeStyle={{ backgroundColor: 'rgba(242,204,143,0.2)', color: '#f2cc8f', border: '1px solid rgba(242,204,143,0.3)' }}
        title="District Operations & Officer Workload"
        subtitle="Surveillance area: Dwaraka Nagar & Seethammadhara Wards. 4 active officers dispatched."
      >
        <button onClick={() => navigate('/inspectors')} className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20">
          <UserCheck className="w-4 h-4" /> Manage Inspectors
        </button>
      </HeroCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-modern lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>Officer Workload & Monthly Completion</h2>
            <p className="text-xs text-gray-500">Total audits completed this month by each lead inspector</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OFFICER_WORKLOAD_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeecdf" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: C.primary, borderRadius: '10px', color: '#fff', border: 'none', fontSize: 12 }} />
                <Bar dataKey="completed" fill={C.highlight} radius={[6, 6, 0, 0]} name="Completed Audits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-modern space-y-4">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>Ward Venue Risk Tiers</h2>
            <p className="text-xs text-gray-500">Breakdown of risk levels in District 1</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'High Risk (Audit Required)', value: '142 Establishments (31%)', color: C.accent, bg: 'var(--gov-accent-subtle)' },
              { label: 'Medium Risk Deli & Provisions', value: '210 Establishments (46%)', color: '#8a6e20', bg: 'var(--gov-highlight-subtle)' },
              { label: 'Low Risk Bakeries & Tea Stalls', value: '100 Establishments (23%)', color: '#3d7a60', bg: 'var(--gov-secondary-subtle)' },
            ].map((r) => (
              <div key={r.label} className="p-3 rounded-xl border" style={{ backgroundColor: r.bg, borderColor: `${r.color}30` }}>
                <p className="text-xs font-bold" style={{ color: r.color }}>{r.label}</p>
                <p className="text-base font-bold mt-0.5" style={{ color: C.primary }}>{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   4. COMMISSIONER DASHBOARD
══════════════════════════════════════════════════════════════ */
function CommissionerDashboard({ navigate }) {
  const kpis = [
    { label: 'Citywide Compliance Index', value: '98.4%', trend: '+1.2% YoY', icon: ShieldAlert, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Emergency License Holds', value: '2 Venues', trend: 'Enforced', icon: AlertTriangle, accentColor: C.accent, trendBg: 'var(--gov-accent-subtle)', trendColor: '#a0432e' },
    { label: 'Grade A Quality Ratio', value: '58.0%', trend: 'Top Tier', icon: Award, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Public Outbreak Hazard Risk', value: 'LEVEL 0', trend: 'Safe', icon: CheckCircle2, accentColor: C.primary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <HeroCard
        badge="Public Health Commissioner Command"
        badgeStyle={{ backgroundColor: 'rgba(242,204,143,0.2)', color: '#f2cc8f', border: '1px solid rgba(242,204,143,0.3)' }}
        title="Executive Citywide Health Surveillance"
        subtitle="Macro Overview: 98.4% Public Compliance Index across all GVMC health sectors."
      >
        <button onClick={() => navigate('/reports')} className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20">
          <Download className="w-4 h-4" /> Executive Report
        </button>
      </HeroCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-modern lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>Citywide Monthly Hygiene Trend</h2>
            <p className="text-xs text-gray-500">Longitudinal evaluation of monthly inspections and passed sanitation audits</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.secondary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.secondary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeecdf" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: C.primary, borderRadius: '10px', color: '#fff', border: 'none', fontSize: 12 }} />
                <Area type="monotone" dataKey="inspections" stroke={C.secondary} strokeWidth={2} fill="url(#commGrad)" name="Total Audits" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-modern space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>Hygiene Grade Distribution</h2>
            <p className="text-xs text-gray-500">Percentage by Grade for GVMC registered businesses</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COMPLIANCE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={4} dataKey="value">
                  {COMPLIANCE_DISTRIBUTION.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: C.primary, borderRadius: '10px', color: '#fff', border: 'none', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-2 border-t text-xs" style={{ borderColor: '#eeecdf' }}>
            {COMPLIANCE_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex justify-between font-medium" style={{ color: C.primary }}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   5. SHOP OWNER DASHBOARD
══════════════════════════════════════════════════════════════ */
function ShopOwnerDashboard({ navigate, user }) {
  const kpis = [
    { label: 'Business Status', value: 'Active', trend: 'Operational', icon: Activity, accentColor: C.primary, trendBg: 'var(--gov-primary-subtle)', trendColor: C.primary },
    { label: 'Food License No.', value: 'FSSAI-8910', trend: 'Verified', icon: Building2, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'License Expiry', value: 'Dec 2026', trend: 'Valid', icon: Clock, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Last Inspection', value: 'Feb 2026', trend: 'Passed', icon: CheckSquare, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Next Inspection', value: 'Oct 2026', trend: 'Upcoming', icon: Calendar, accentColor: C.highlight, trendBg: 'var(--gov-highlight-subtle)', trendColor: '#8a6e20' },
    { label: 'Compliance Score', value: '92/100', trend: 'Grade A', icon: Award, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Total Fine Amount', value: '₹0', trend: 'Clear', icon: CheckCircle2, accentColor: C.primary, trendBg: 'var(--gov-primary-subtle)', trendColor: C.primary },
    { label: 'Pending Fine', value: '₹0', trend: 'No Dues', icon: AlertCircle, accentColor: C.primary, trendBg: 'var(--gov-primary-subtle)', trendColor: C.primary },
    { label: 'Total Violations', value: '0', trend: 'Safe', icon: ShieldAlert, accentColor: C.secondary, trendBg: 'var(--gov-secondary-subtle)', trendColor: '#3d7a60' },
    { label: 'Active Notices', value: '2', trend: 'Action Reqd', icon: AlertTriangle, accentColor: C.accent, trendBg: 'var(--gov-accent-subtle)', trendColor: '#a0432e' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <HeroCard
        badge="Registered Food Business Portal"
        badgeStyle={{ backgroundColor: 'rgba(242,204,143,0.2)', color: '#f2cc8f', border: '1px solid rgba(242,204,143,0.3)' }}
        title={`Welcome, ${user?.fullName || 'Shop Owner'}`}
        subtitle="Manage your FSSAI License, view inspection certificates, and respond to safety alerts."
      >
        <button className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20">
          <Download className="w-4 h-4" /> Download Certificate
        </button>
      </HeroCard>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-modern lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>My Business Standing: Compliance %</h2>
            <p className="text-xs text-gray-500">Historical Tracking of Compliance Score</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="shopGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.secondary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.secondary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeecdf" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#8a8880', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: C.primary, borderRadius: '10px', color: '#fff', border: 'none', fontSize: 12 }} />
                <Area type="monotone" dataKey="inspections" stroke={C.secondary} strokeWidth={2} fill="url(#shopGrad)" name="Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-modern space-y-4">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.primary }}>Recent Safety Notices (Alerts)</h2>
            <p className="text-xs text-gray-500">Direct notifications from GVMC</p>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl border flex gap-3 bg-red-50 border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-red-700">Storage hygiene review scheduled</p>
                <p className="text-[11px] text-red-600 mt-0.5">Please ensure all raw material labels are visible before next week.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl border flex gap-3 bg-blue-50 border-blue-200">
              <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-700">License Renewal Reminder</p>
                <p className="text-[11px] text-blue-600 mt-0.5">Your FSSAI license is valid until Dec 2026. File extensions early.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
