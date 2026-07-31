/**
 * src/pages/settings/SettingsPage.jsx
 * System Configuration, Surveillance Thresholds, and Notification Settings (ADMIN Only).
 */

import { useState } from 'react';
import {
  Settings,
  BellRing,
  Sliders,
  ShieldCheck,
  Save,
  Database,
  Key,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoAlertThreshold: 70,
    emailNotifications: true,
    smsEmergencyAlerts: true,
    inspectionFrequencyDays: 90,
    requirePhotoEvidence: true,
    mfaEnforced: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('System preferences and audit thresholds saved successfully!');
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" /> System Settings & Controls
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Global food safety thresholds, hazard dispatch triggers, and security configurations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Surveillance Parameters */}
        <div className="card-modern space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4.5 h-4.5 text-indigo-600" /> Audit & Hazard Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Auto-Alert Score Trigger Threshold (Below %)
              </label>
              <input
                type="number"
                value={settings.autoAlertThreshold}
                onChange={(e) => setSettings({ ...settings, autoAlertThreshold: Number(e.target.value) })}
                className="input-field"
              />
              <p className="text-[10px] text-slate-400 mt-1">Audits scoring under this mark trigger immediate critical alerts.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Routine Audit Cycle (Days)
              </label>
              <input
                type="number"
                value={settings.inspectionFrequencyDays}
                onChange={(e) => setSettings({ ...settings, inspectionFrequencyDays: Number(e.target.value) })}
                className="input-field"
              />
              <p className="text-[10px] text-slate-400 mt-1">Default interval between routine venue inspections.</p>
            </div>
          </div>
        </div>

        {/* Notifications & Alert Channels */}
        <div className="card-modern space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <BellRing className="w-4.5 h-4.5 text-indigo-600" /> Alert Dispatch Channels
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Email Notification Feed</p>
                <p className="text-slate-500 text-[11px]">Send instant email summaries to assigned district officers upon hazard detection.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">SMS Emergency Broadcasts</p>
                <p className="text-slate-500 text-[11px]">Send emergency SMS alerts for Grade F venue closures.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.smsEmergencyAlerts}
                onChange={(e) => setSettings({ ...settings, smsEmergencyAlerts: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Require Photo Evidence Checklist</p>
                <p className="text-slate-500 text-[11px]">Enforce mandatory photo uploads for all critical violation reports.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requirePhotoEvidence}
                onChange={(e) => setSettings({ ...settings, requirePhotoEvidence: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex justify-end gap-3">
          <button type="submit" className="btn-primary shadow-indigo-600/30">
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
