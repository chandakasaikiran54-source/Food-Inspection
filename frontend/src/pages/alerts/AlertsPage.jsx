/**
 * src/pages/alerts/AlertsPage.jsx
 * Critical Violation Alert Center & Emergency Safety Workflows.
 */

import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  X,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_ALERTS, INITIAL_BUSINESSES, INITIAL_INSPECTORS } from '../../services/mockData.js';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [showIssueModal, setShowIssueModal] = useState(false);

  const [newAlert, setNewAlert] = useState({
    businessId: INITIAL_BUSINESSES[0]?.id || '',
    severity: 'CRITICAL',
    title: '',
    description: '',
    assignedTo: INITIAL_INSPECTORS[0]?.name || 'Officer David Kim',
  });

  const filteredAlerts = alerts.filter((a) => {
    return severityFilter === 'ALL' || a.severity === severityFilter;
  });

  const handleResolveAlert = (id) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a))
    );
    toast.success('Alert marked as RESOLVED & closed');
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!newAlert.title || !newAlert.description) {
      toast.error('Title and description are required');
      return;
    }

    const selectedBiz = INITIAL_BUSINESSES.find((b) => b.id === newAlert.businessId);

    const created = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      businessName: selectedBiz?.name || 'Venue',
      businessId: newAlert.businessId,
      severity: newAlert.severity,
      title: newAlert.title,
      description: newAlert.description,
      date: new Date().toISOString().split('T')[0],
      status: 'OPEN',
      assignedTo: newAlert.assignedTo,
    };

    setAlerts([created, ...alerts]);
    setShowIssueModal(false);
    toast.success(`Issued emergency alert for ${selectedBiz?.name}`);
    setNewAlert({
      businessId: INITIAL_BUSINESSES[0]?.id || '',
      severity: 'CRITICAL',
      title: '',
      description: '',
      assignedTo: INITIAL_INSPECTORS[0]?.name || 'Officer David Kim',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-600 animate-pulse" /> Critical Safety Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time hazard notifications, equipment failures, and emergency license holds.
          </p>
        </div>

        <button onClick={() => setShowIssueModal(true)} className="btn-danger shadow-rose-600/30">
          <Plus className="w-4 h-4" /> Issue Emergency Alert
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-modern p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="select-field text-xs py-1.5 w-36"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {filteredAlerts.length} Active Hazard Notifications
        </span>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`card-modern p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${
              alert.severity === 'CRITICAL'
                ? 'border-l-rose-600 bg-rose-50/10'
                : alert.severity === 'HIGH'
                ? 'border-l-amber-500 bg-amber-50/10'
                : 'border-l-sky-500'
            }`}
          >
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`badge ${
                    alert.severity === 'CRITICAL'
                      ? 'badge-danger'
                      : alert.severity === 'HIGH'
                      ? 'badge-warning'
                      : 'badge-info'
                  }`}
                >
                  {alert.severity}
                </span>

                <span
                  className={`badge ${
                    alert.status === 'RESOLVED'
                      ? 'badge-success'
                      : alert.status === 'IN_REVIEW'
                      ? 'badge-warning'
                      : 'badge-slate'
                  }`}
                >
                  {alert.status}
                </span>

                <span className="text-xs font-mono font-bold text-slate-400">{alert.id}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">{alert.businessName}: {alert.title}</h3>
              <p className="text-xs text-slate-600">{alert.description}</p>
              <p className="text-[11px] text-slate-400 font-medium">
                Assigned Officer: <strong className="text-slate-700">{alert.assignedTo}</strong> &bull; {alert.date}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {alert.status !== 'RESOLVED' ? (
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="btn-success text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Resolve & Close
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Issue Alert Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Issue Emergency Safety Alert</h2>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Establishment *</label>
                <select
                  value={newAlert.businessId}
                  onChange={(e) => setNewAlert({ ...newAlert, businessId: e.target.value })}
                  className="select-field"
                >
                  {INITIAL_BUSINESSES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.licenseNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Severity Level</label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                  className="select-field"
                >
                  <option value="CRITICAL">CRITICAL (Immediate License Hold)</option>
                  <option value="HIGH">HIGH (Temp Hazard Failure)</option>
                  <option value="MEDIUM">MEDIUM (Sanitation Warning)</option>
                  <option value="LOW">LOW (Administrative Notice)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alert Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold Storage Temp Failure"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Hazard Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe non-compliance findings and required emergency actions..."
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowIssueModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-danger">
                  Dispatch Emergency Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
