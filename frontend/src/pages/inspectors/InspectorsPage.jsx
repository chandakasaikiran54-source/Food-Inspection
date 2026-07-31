/**
 * src/pages/inspectors/InspectorsPage.jsx
 * Field Inspectors Directory, Workload Capacity Tracker, and Certification Hub.
 */

import { useState } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Mail,
  Phone,
  Award,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  X,
  UserPlus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_INSPECTORS } from '../../services/mockData.js';

export default function InspectorsPage() {
  const [inspectors, setInspectors] = useState(INITIAL_INSPECTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newInspector, setNewInspector] = useState({
    name: '',
    email: '',
    phone: '',
    district: 'Downtown District',
    certifications: 'HACCP Certified',
  });

  const filteredInspectors = inspectors.filter((i) => {
    return (
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.badgeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newInspector.name || !newInspector.email) {
      toast.error('Inspector name and email are required');
      return;
    }

    const created = {
      id: `USR-INSP-${Date.now().toString().slice(-2)}`,
      name: newInspector.name,
      badgeNo: `INS-${Math.floor(600 + Math.random() * 300)}`,
      district: newInspector.district,
      email: newInspector.email,
      phone: newInspector.phone || '+1 (555) 000-0000',
      activeAssignments: 0,
      completedThisMonth: 0,
      avgScoreGiven: 90.0,
      status: 'ACTIVE',
      rating: 5.0,
      certifications: newInspector.certifications.split(',').map((c) => c.trim()),
    };

    setInspectors([created, ...inspectors]);
    setShowAddModal(false);
    toast.success(`Inspector ${newInspector.name} added to roster`);
    setNewInspector({
      name: '',
      email: '',
      phone: '',
      district: 'Downtown District',
      certifications: 'HACCP Certified',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" /> Inspectors Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active health officers, assigned districts, workload metrics, and certifications.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary shadow-indigo-600/30">
          <UserPlus className="w-4 h-4" /> Add Field Officer
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-modern p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search officer name, badge #, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Inspectors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInspectors.map((inspector) => (
          <div key={inspector.id} className="card-modern space-y-5 hover:-translate-y-1 transition-all duration-200">
            {/* Officer Header Card */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-md ring-2 ring-indigo-100">
                  {inspector.name[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{inspector.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-bold text-indigo-600">{inspector.badgeNo}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-500">{inspector.district}</span>
                  </div>
                </div>
              </div>

              <span
                className={`badge ${
                  inspector.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'
                }`}
              >
                {inspector.status}
              </span>
            </div>

            {/* Performance & Capacity Stats */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Active Load</p>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">{inspector.activeAssignments} Cases</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Month Audits</p>
                <p className="text-lg font-extrabold text-emerald-600 mt-0.5">{inspector.completedThisMonth}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Avg Score</p>
                <p className="text-lg font-extrabold text-indigo-600 mt-0.5">{inspector.avgScoreGiven}%</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{inspector.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{inspector.phone}</span>
              </div>
            </div>

            {/* Certifications Badges */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Certifications:</p>
              <div className="flex flex-wrap gap-1.5">
                {inspector.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1"
                  >
                    <Award className="w-3 h-3 text-indigo-500" /> {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Officer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Add Field Inspector</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Officer Full Name"
                  value={newInspector.name}
                  onChange={(e) => setNewInspector({ ...newInspector, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="officer@health.gov"
                  value={newInspector.email}
                  onChange={(e) => setNewInspector({ ...newInspector, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={newInspector.phone}
                  onChange={(e) => setNewInspector({ ...newInspector, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned District Area</label>
                <select
                  value={newInspector.district}
                  onChange={(e) => setNewInspector({ ...newInspector, district: e.target.value })}
                  className="select-field"
                >
                  <option value="Downtown District">Downtown District</option>
                  <option value="Eastside District">Eastside District</option>
                  <option value="Northside District">Northside District</option>
                  <option value="Harbor District">Harbor District</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
