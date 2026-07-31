/**
 * src/pages/analytics/AnalyticsPage.jsx
 * Advanced Food Safety Analytics, Hazard Breakdowns, and District Heatmap Metrics.
 */

import { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  ShieldAlert,
  Award,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { VIOLATION_CATEGORIES, MONTHLY_TREND_DATA, COMPLIANCE_DISTRIBUTION } from '../../services/mockData.js';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('MONTH');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" /> Analytics & Hazard Surveillance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Statistical breakdown of sanitation violations, district compliance rates, and hazard trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="select-field text-xs w-44"
          >
            <option value="MONTH">Current Month</option>
            <option value="QUARTER">Q3 2026 Quarter</option>
            <option value="YEAR">Year 2026</option>
          </select>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-modern p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Citywide Avg Health Score</p>
          <p className="text-3xl font-extrabold text-indigo-600">88.4 / 100</p>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            +2.1% Improvement vs Q2
          </p>
        </div>

        <div className="card-modern p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Hazard Rate</p>
          <p className="text-3xl font-extrabold text-rose-600">6.2%</p>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            -1.4% Hazard Reduction
          </p>
        </div>

        <div className="card-modern p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Audits Completed</p>
          <p className="text-3xl font-extrabold text-slate-900">429 Audits</p>
          <p className="text-xs text-slate-500 font-medium">Across 4 Municipal Districts</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violation Categories Bar Chart */}
        <div className="card-modern space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Most Frequent Safety Violations</h2>
            <p className="text-xs text-slate-500">Distribution of non-compliance codes detected in field audits</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VIOLATION_CATEGORIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Violation Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Grade Share */}
        <div className="card-modern space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Health Score Distribution</h2>
            <p className="text-xs text-slate-500">Proportion of restaurants per health grade tier</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMPLIANCE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {COMPLIANCE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
