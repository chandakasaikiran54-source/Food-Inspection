/**
 * src/pages/inspections/InspectionsPage.jsx
 * Comprehensive Inspection Manager, Digital Audit Viewer, and Dispatching Hub.
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ClipboardCheck,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Calendar,
  UserCheck,
  Building2,
  FileSpreadsheet,
  X,
  ShieldCheck,
  AlertCircle,
  Scan,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_INSPECTIONS, INITIAL_BUSINESSES, INITIAL_INSPECTORS } from '../../services/mockData.js';
import QRScanner from '../../components/inspections/QRScanner.jsx';

export default function InspectionsPage() {
  const [searchParams] = useSearchParams();
  const autoNewAction = searchParams.get('action') === 'new';

  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PASSED' | 'FAILED' | 'WARNING'
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(autoNewAction);
  const [showScanner, setShowScanner] = useState(false);

  // GPS Distance Calculation (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
      Math.cos(p1) * Math.cos(p2) *
      Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleScanSuccess = async (token) => {
    setShowScanner(false);
    const loadingToast = toast.loading('Authenticating via QR...');

    try {
      // In actual app: const resp = await api.get(`/qr/secure/${token}`);
      // Using mock payload for frontend demonstration
      const mockBiz = INITIAL_BUSINESSES[0];

      toast.success(`Business Verified: ${mockBiz.name}`, { id: loadingToast });
      toast.loading('Acquiring GPS location...', { id: loadingToast });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock coordinates checking
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            mockBiz.latitude || 17.6868, // sample vizag coords
            mockBiz.longitude || 83.2185
          );

          toast.dismiss(loadingToast);

          if (distance <= 100) {
            toast.success(`Location verified. Distance: ${Math.round(distance)}m`);
            // Proceed to open active inspection
            setNewInsp({ ...newInsp, businessId: mockBiz.id, type: 'Surprise Field Inspection' });
            setShowScheduleModal(true);
          } else {
            // Beyond 100 meters - trigger Override Warning
            toast.error(`GPS Verification Failed. You are ${Math.round(distance)}m away from registered location.`, { duration: 6000 });
            if (window.confirm('GPS proximity test failed (>100m). Override warning to proceed with Inspector authority?')) {
              setNewInsp({ ...newInsp, businessId: mockBiz.id, type: 'Surprise Field Inspection (OVERRIDE)' });
              setShowScheduleModal(true);
            }
          }
        },
        (err) => {
          toast.error('Could not access GPS. Hardware location is required.', { id: loadingToast });
        },
        { enableHighAccuracy: true }
      );

    } catch (e) {
      toast.error('Invalid or Expired QR Token', { id: loadingToast });
    }
  };

  // New Inspection Form State
  const [newInsp, setNewInsp] = useState({
    businessId: INITIAL_BUSINESSES[0]?.id || '',
    inspectorId: INITIAL_INSPECTORS[0]?.id || '',
    type: 'Routine Annual Inspection',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
  });

  const filteredInspections = inspections.filter((insp) => {
    const matchesSearch =
      insp.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insp.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insp.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'ALL' || insp.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const selectedBiz = INITIAL_BUSINESSES.find((b) => b.id === newInsp.businessId);
    const selectedInsp = INITIAL_INSPECTORS.find((i) => i.id === newInsp.inspectorId);

    const created = {
      id: `INS-2026-${Math.floor(100 + Math.random() * 900)}`,
      businessId: newInsp.businessId,
      businessName: selectedBiz?.name || 'Food Establishment',
      inspectorName: selectedInsp?.name || 'Officer Inspector',
      inspectorId: newInsp.inspectorId,
      type: newInsp.type,
      date: newInsp.date,
      time: newInsp.time,
      status: 'PASSED',
      score: 95,
      grade: 'A',
      riskCategory: selectedBiz?.riskLevel || 'HIGH',
      summary: 'Scheduled inspection queued. Pre-audit parameters verified clean.',
      violations: [],
      correctiveActionRequired: 'None',
    };

    setInspections([created, ...inspections]);
    setShowScheduleModal(false);
    toast.success(`Inspection scheduled for ${selectedBiz?.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-indigo-600" /> Inspection Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Digital health audits, risk violation tracking, and inspector dispatch logs.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowScanner(true)}
            className="btn-secondary shadow-indigo-600/30 font-bold border-indigo-600 text-indigo-700"
          >
            <Scan className="w-4 h-4" /> Scan QR to Inspect
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="btn-primary shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" /> Schedule New Audit
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="card-modern p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tab Selection */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: `All Audits (${inspections.length})` },
              { id: 'PASSED', label: 'Passed (Grade A/B)' },
              { id: 'WARNING', label: 'Warnings (Grade C)' },
              { id: 'FAILED', label: 'Critical Failures (Grade F)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit ID, venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-xs py-2"
            />
          </div>
        </div>
      </div>

      {/* Inspection List Table */}
      <div className="card-modern overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Audit ID & Date</th>
                <th>Establishment</th>
                <th>Assigned Inspector</th>
                <th>Audit Type</th>
                <th>Score & Grade</th>
                <th>Compliance Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInspections.map((insp) => (
                <tr key={insp.id}>
                  <td>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{insp.id}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{insp.date} at {insp.time}</p>
                    </div>
                  </td>
                  <td>
                    <p className="font-bold text-slate-900">{insp.businessName}</p>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{insp.riskCategory} RISK</span>
                  </td>
                  <td className="text-xs text-slate-700">{insp.inspectorName}</td>
                  <td className="text-xs text-slate-600">{insp.type}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-extrabold ${insp.score >= 90
                            ? 'text-emerald-600'
                            : insp.score >= 75
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                      >
                        {insp.score}/100
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 border text-slate-700">
                        {insp.grade}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${insp.status === 'PASSED'
                          ? 'badge-success'
                          : insp.status === 'WARNING'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                    >
                      {insp.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => setSelectedInspection(insp)}
                      className="btn-ghost text-xs text-indigo-600 font-semibold"
                    >
                      View Report &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Inspection Report Viewer Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-scale-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  Official Audit Certificate
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">{selectedInspection.businessName}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Report Reference: {selectedInspection.id}</p>
              </div>
              <button
                onClick={() => setSelectedInspection(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Audit Performance Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-white">{selectedInspection.score}</span>
                  <span className="text-sm text-slate-300 font-medium">/ 100</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Grade {selectedInspection.grade}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-300">
                <p><strong className="text-white">Inspector:</strong> {selectedInspection.inspectorName}</p>
                <p><strong className="text-white">Date:</strong> {selectedInspection.date}</p>
              </div>
            </div>

            {/* Summary & Findings */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Auditor Summary Notes</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {selectedInspection.summary}
              </p>
            </div>

            {/* Violation Checklist */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Violations Checklist ({selectedInspection.violations.length})</span>
              </h3>

              {selectedInspection.violations.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No safety or sanitation violations recorded during audit.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedInspection.violations.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-slate-200 bg-white text-xs flex items-start gap-3"
                    >
                      <span
                        className={`badge ${v.severity === 'CRITICAL'
                            ? 'badge-danger'
                            : v.severity === 'MAJOR'
                              ? 'badge-warning'
                              : 'badge-info'
                          }`}
                      >
                        {v.severity}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{v.code}: {v.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Corrective Actions Required */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Required Corrective Directives</h3>
              <p className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                {selectedInspection.correctiveActionRequired}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setSelectedInspection(null)} className="btn-secondary">
                Dismiss Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Inspection Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Schedule Field Inspection</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Establishment *</label>
                <select
                  value={newInsp.businessId}
                  onChange={(e) => setNewInsp({ ...newInsp, businessId: e.target.value })}
                  className="select-field"
                >
                  {INITIAL_BUSINESSES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Lead Officer *</label>
                <select
                  value={newInsp.inspectorId}
                  onChange={(e) => setNewInsp({ ...newInsp, inspectorId: e.target.value })}
                  className="select-field"
                >
                  {INITIAL_INSPECTORS.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} — {i.district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Type</label>
                <select
                  value={newInsp.type}
                  onChange={(e) => setNewInsp({ ...newInsp, type: e.target.value })}
                  className="select-field"
                >
                  <option value="Routine Annual Inspection">Routine Annual Inspection</option>
                  <option value="Emergency Re-inspection">Emergency Re-inspection</option>
                  <option value="Complaint Verification">Complaint Verification</option>
                  <option value="Permit Renewal Audit">Permit Renewal Audit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Audit Date</label>
                  <input
                    type="date"
                    required
                    value={newInsp.date}
                    onChange={(e) => setNewInsp({ ...newInsp, date: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dispatch Time</label>
                  <input
                    type="time"
                    required
                    value={newInsp.time}
                    onChange={(e) => setNewInsp({ ...newInsp, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Schedule Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internal QR Scanner Mount */}
      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </div>
  );
}
