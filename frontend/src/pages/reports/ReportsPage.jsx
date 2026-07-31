/**
 * src/pages/reports/ReportsPage.jsx
 * Health Inspection Report Generation Hub & Official Compliance Certificate Exporter.
 */

import { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Building2,
  Award,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_BUSINESSES, INITIAL_INSPECTIONS } from '../../services/mockData.js';

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState('COMPLIANCE_SUMMARY');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedBusiness, setSelectedBusiness] = useState(INITIAL_BUSINESSES[0]);

  const handleExportCSV = () => {
    toast.success('Generated CSV report document download');
  };

  const handleExportPDF = () => {
    toast.success('Generated official PDF audit summary document');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-indigo-600" /> Health Audit Reports & Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate executive compliance summaries, district hazard audits, and printable health certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="btn-secondary">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn-primary">
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Interactive Printable Certificate Preview Box */}
      <div className="card-modern bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Official Document Generator
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Food Health & Hygiene Pass Certificate</h2>
            </div>
          </div>

          <button onClick={() => window.print()} className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
            <Printer className="w-4 h-4" /> Print Certificate
          </button>
        </div>

        {/* Certificate Card Content */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs text-slate-400">Certified Food Venue</p>
              <p className="text-xl font-extrabold text-white">{selectedBusiness.name}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedBusiness.licenseNo}</p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-extrabold text-emerald-400">GRADE {selectedBusiness.grade}</span>
              <p className="text-xs text-slate-300 font-semibold mt-0.5">Score: {selectedBusiness.healthScore}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">District Jurisdiction</p>
              <p className="font-bold text-white mt-0.5">{selectedBusiness.district}</p>
            </div>

            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Risk Classification</p>
              <p className="font-bold text-amber-300 mt-0.5">{selectedBusiness.riskLevel} RISK</p>
            </div>

            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Issue Date</p>
              <p className="font-bold text-white mt-0.5">{selectedBusiness.lastInspectionDate}</p>
            </div>

            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Valid Until</p>
              <p className="font-bold text-emerald-400 mt-0.5">{selectedBusiness.nextInspectionDate}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Digitally Authenticated by Health & Sanitation Authority
          </div>
          <span>Ref ID: CERT-2026-X99</span>
        </div>
      </div>

      {/* Reports Table Section */}
      <div className="card-modern space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Generated Inspection Logs Table</h2>
          <span className="text-xs text-slate-500">Showing {INITIAL_BUSINESSES.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Venue Name</th>
                <th>District</th>
                <th>Health Score</th>
                <th>Grade</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_BUSINESSES.map((b) => (
                <tr key={b.id}>
                  <td className="font-bold text-slate-900">{b.name}</td>
                  <td className="text-xs text-slate-600">{b.district}</td>
                  <td className="font-bold text-xs text-indigo-600">{b.healthScore}%</td>
                  <td>
                    <span className="font-extrabold text-xs px-2 py-0.5 bg-slate-100 rounded border">
                      Grade {b.grade}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${b.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setSelectedBusiness(b);
                        toast.success(`Selected certificate for ${b.name}`);
                      }}
                      className="btn-ghost text-xs text-indigo-600 font-semibold"
                    >
                      Select Certificate &rarr;
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
