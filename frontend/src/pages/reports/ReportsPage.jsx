/**
 * src/pages/reports/ReportsPage.jsx
 * GVMC Official Design – Health Audit Reports & Official Certificate
 * Food Safety Inspection Monitoring System
 * Government of Andhra Pradesh – GVMC – Public Health Department
 */

import { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import GvmcLogo from '../../components/layout/GvmcLogo.jsx';
import { INITIAL_BUSINESSES } from '../../services/mockData.js';

const C = {
  primary: '#3D405B',
  secondary: '#81B29A',
  accent: '#E07A5F',
  highlight: '#F2CC8F',
  bg: '#F4F1DE',
};

/* ══════════════════════════════════════════════════════
   Official GVMC Printable Certificate
══════════════════════════════════════════════════════ */
function GovCertificate({ business }) {
  const certNo = `GVMC/PHD/FSW/${business.id}/2026`;
  const grade = business.grade;
  const gradeColor =
    grade === 'A' ? C.secondary :
      grade === 'B' ? C.primary :
        grade === 'C' ? '#8a6e20' : C.accent;

  return (
    <div
      className="relative rounded-2xl overflow-hidden border-2 print:shadow-none"
      style={{ borderColor: C.secondary, backgroundColor: '#fff', fontFamily: 'var(--font-family-main)' }}
    >
      {/* ── Certificate Header ─────────────── */}
      <div
        className="flex items-center gap-6 px-8 py-6"
        style={{ backgroundColor: C.primary }}
      >
        {/* GVMC official logo */}
        <GvmcLogo size="xl" rounded="xl" className="shadow-lg border-2 border-white/30 shrink-0" />

        {/* Title Block */}
        <div className="flex-1 text-white text-center">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
            Government of Andhra Pradesh
          </p>
          <h2 className="text-white font-bold text-xl leading-tight mt-1">
            Greater Visakhapatnam Municipal Corporation
          </h2>
          <p className="text-white/80 text-sm font-semibold mt-0.5">
            Public Health Department
          </p>
          <div className="mt-2 pt-2 border-t border-white/20">
            <p className="text-white/60 text-xs font-medium">
              Food Safety Inspection Monitoring System
            </p>
          </div>
        </div>

        {/* Right: Cert label */}
        <div
          className="shrink-0 px-4 py-3 rounded-xl text-center border"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Document</p>
          <p className="text-white font-bold text-sm mt-0.5">Health</p>
          <p className="text-white font-bold text-sm">Certificate</p>
        </div>
      </div>

      {/* ── Accent Bars ───────────────────── */}
      <div className="h-1.5" style={{ backgroundColor: C.secondary }} />
      <div className="h-0.5" style={{ backgroundColor: C.highlight }} />

      {/* ── Certificate Body ──────────────── */}
      <div className="px-8 py-6 space-y-5" style={{ backgroundColor: '#fdfcf8' }}>

        {/* Cert Number + Grade */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Certificate Number</p>
            <p className="font-mono font-bold text-sm mt-0.5" style={{ color: C.primary }}>{certNo}</p>
          </div>
          <div
            className="px-5 py-2 rounded-xl text-center font-extrabold text-2xl border-2"
            style={{ borderColor: gradeColor, color: gradeColor, backgroundColor: `${gradeColor}12` }}
          >
            GRADE {grade}
            <p className="text-xs font-semibold mt-0.5">Score: {business.healthScore}/100</p>
          </div>
        </div>

        {/* Business Info */}
        <div className="rounded-xl p-4 border" style={{ backgroundColor: C.bg, borderColor: `${C.secondary}50` }}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Certified Food Business</p>
          <p className="text-xl font-bold mt-1" style={{ color: C.primary }}>{business.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">License No: {business.licenseNo}</p>
          <p className="text-xs text-gray-500 mt-0.5">{business.address}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Ward / District', value: business.district },
            {
              label: 'Risk Classification',
              value: `${business.riskLevel} RISK`,
              color: business.riskLevel === 'HIGH' ? C.accent : business.riskLevel === 'MEDIUM' ? '#8a6e20' : C.secondary,
            },
            { label: 'Inspection Date', value: business.lastInspectionDate },
            { label: 'Valid Until', value: business.nextInspectionDate, color: C.secondary },
          ].map((f) => (
            <div key={f.label} className="bg-white rounded-lg p-3 border" style={{ borderColor: '#e5e2d5' }}>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{f.label}</p>
              <p className="font-bold text-sm mt-1" style={{ color: f.color || C.primary }}>{f.value}</p>
            </div>
          ))}
        </div>

        {/* QR + Official Seal + Signature */}
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* QR Placeholder */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-xl border-2 flex items-center justify-center"
              style={{ borderColor: C.primary, backgroundColor: '#f4f1de' }}
            >
              <div className="grid grid-cols-3 gap-0.5 p-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: i % 3 !== 1 ? C.primary : 'transparent' }} />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-gray-500 text-center">Scan to Verify</p>
          </div>

          {/* Official Seal */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden"
              style={{ borderColor: C.secondary }}
            >
              <GvmcLogo size="lg" rounded="full" className="border-0 shadow-none" />
            </div>
            <p className="text-[10px] text-gray-500 text-center">GVMC Official Seal</p>
          </div>

          {/* Signature */}
          <div className="flex flex-col items-end gap-2">
            <div
              className="w-32 h-16 rounded-lg border-b-2 flex items-end justify-center pb-1"
              style={{ borderColor: C.primary, backgroundColor: 'transparent' }}
            >
              <p className="text-xs italic text-gray-400">Digital Signature</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold" style={{ color: C.primary }}>Chief Health Officer</p>
              <p className="text-[10px] text-gray-500">GVMC – Public Health Department</p>
              <p className="text-[10px] text-gray-500">Approved By: Dr. V. S. Rao, IAS</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Strip ──────────────────── */}
      <div className="h-0.5" style={{ backgroundColor: C.highlight }} />
      <div
        className="flex items-center justify-between px-8 py-3 text-[10px]"
        style={{ backgroundColor: C.primary, color: 'rgba(255,255,255,0.55)' }}
      >
        <span>
          Government of Andhra Pradesh · Greater Visakhapatnam Municipal Corporation · Public Health Department
        </span>
        <span>Version 1.0 · Issued: {new Date().toLocaleDateString('en-IN')}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Main Reports Page
══════════════════════════════════════════════════════ */
export default function ReportsPage() {
  const [selectedBusiness, setSelectedBusiness] = useState(INITIAL_BUSINESSES[0]);

  const handleExportCSV = () => toast.success('Generated CSV report document download');
  const handleExportPDF = () => toast.success('Generated official PDF audit summary document');

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: C.primary }}>
            <FileBarChart className="w-5 h-5" style={{ color: C.secondary }} />
            Health Audit Reports & Certificates
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Generate executive compliance summaries, ward hazard audits, and official GVMC health certificates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="btn-secondary">
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn-primary">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Business Selector + Print */}
      <div className="card-modern flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
            Select Food Business for Certificate
          </label>
          <select
            className="select-field"
            value={selectedBusiness.id}
            onChange={(e) => {
              const b = INITIAL_BUSINESSES.find((x) => x.id === e.target.value);
              if (b) setSelectedBusiness(b);
            }}
          >
            {INITIAL_BUSINESSES.map((b) => (
              <option key={b.id} value={b.id}>{b.name} — {b.licenseNo}</option>
            ))}
          </select>
        </div>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 shrink-0">
          <Printer className="w-4 h-4" /> Print Certificate
        </button>
      </div>

      {/* Official Certificate */}
      <GovCertificate business={selectedBusiness} />

      {/* Reports Inspection Log Table */}
      <div className="card-modern space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold" style={{ color: C.primary }}>Inspection Logs Summary</h2>
          <span className="text-xs text-gray-500">Showing {INITIAL_BUSINESSES.length} Records</span>
        </div>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e5e2d5' }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Ward / District</th>
                <th>Health Score</th>
                <th>Grade</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_BUSINESSES.map((b) => (
                <tr key={b.id}>
                  <td className="font-semibold text-sm" style={{ color: C.primary }}>{b.name}</td>
                  <td className="text-xs text-gray-600">{b.district}</td>
                  <td>
                    <span className="font-bold text-xs" style={{ color: C.secondary }}>{b.healthScore}%</span>
                  </td>
                  <td>
                    <span
                      className="font-bold text-xs px-2.5 py-0.5 rounded-full border"
                      style={{ backgroundColor: `${C.primary}10`, color: C.primary, borderColor: `${C.primary}30` }}
                    >
                      Grade {b.grade}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${b.status === 'ACTIVE' ? 'badge-success' : b.status === 'SUSPENDED' ? 'badge-danger' : 'badge-warning'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setSelectedBusiness(b);
                        toast.success(`Certificate selected for ${b.name}`);
                      }}
                      className="btn-ghost text-xs font-semibold"
                      style={{ color: C.primary }}
                    >
                      View Certificate →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
