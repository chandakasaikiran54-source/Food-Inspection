/**
 * src/pages/businesses/BusinessesPage.jsx
 * Complete Food Businesses Management & Health Grade Surveillance module.
 */

import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  FileText,
  X,
  CheckCircle2,
  Calendar,
  ExternalLink,
  QrCode,
  Download,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_BUSINESSES } from '../../services/mockData.js';
import { generateQRCertificate } from '../../utils/pdfGenerator.js';
import api from '../../services/api.js';

export default function BusinessesPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [businesses, setBusinesses] = useState(INITIAL_BUSINESSES);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for New Business modal
  const [newBiz, setNewBiz] = useState({
    name: '',
    type: 'Fine Dining Restaurant',
    owner: '',
    email: '',
    phone: '',
    address: '',
    district: 'Downtown District',
    riskLevel: 'HIGH',
  });

  // Filtered List
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.licenseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.district.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk = riskFilter === 'ALL' || b.riskLevel === riskFilter;
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [businesses, searchTerm, riskFilter, statusFilter]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newBiz.name || !newBiz.owner) {
      toast.error('Please fill in required fields.');
      return;
    }

    try {
      const payload = {
        businessName: newBiz.name,
        businessType: newBiz.type,
        licenseNumber: `LIC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        foodCategory: 'Restaurant (Generic)',
        ownerName: newBiz.owner,
        email: newBiz.email || 'contact@business.com',
        phone: newBiz.phone || '0000000000',
        address: newBiz.address || 'Central District Street',
        streetArea: newBiz.address || 'Central Street',
        villageLocality: 'Central',
        mandal: 'GVMC Central',
        district: newBiz.district,
        state: 'Andhra Pradesh',
        pincode: '530001',
        ward: 'Central Ward',
        zone: 'Zone 2',
        latitude: 17.6868,
        longitude: 83.2185,
        licenseIssueDate: new Date().toISOString(),
        licenseExpiryDate: new Date(Date.now() + 31536000000).toISOString(),
        businessStatus: 'ACTIVE',
        riskCategory: newBiz.riskLevel
      };

      const { data } = await api.post('/businesses', payload);
      const savedBusiness = data.data;

      // Transform backend model to frontend schema for immediate UI rendering without fetching all
      const created = {
        id: savedBusiness._id,
        _id: savedBusiness._id,
        name: savedBusiness.businessName,
        type: savedBusiness.businessType,
        licenseNo: savedBusiness.licenseNumber,
        owner: savedBusiness.ownerName,
        email: savedBusiness.email,
        phone: savedBusiness.phone,
        address: savedBusiness.address,
        district: savedBusiness.district,
        riskLevel: savedBusiness.riskCategory,
        status: savedBusiness.businessStatus,
        healthScore: savedBusiness.healthScore,
        grade: savedBusiness.grade,
        lastInspectionDate: savedBusiness.lastInspectionDate ? new Date(savedBusiness.lastInspectionDate).toISOString().split('T')[0] : 'N/A',
        totalInspections: savedBusiness.totalInspections,
        qrToken: savedBusiness.qrToken
      };

      setBusinesses([created, ...businesses]);
      setShowAddModal(false);
      toast.success(`Registered new food establishment: ${created.name}`);
      setNewBiz({
        name: '', type: 'Fine Dining Restaurant', owner: '', email: '', phone: '',
        address: '', district: 'Downtown District', riskLevel: 'HIGH',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register business');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" /> Food Business Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered food establishments, risk categories, and health safety scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" /> Register New Venue
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-modern p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search venue name, license #, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="select-field text-xs py-1.5 w-32"
            >
              <option value="ALL">All Risks</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field text-xs py-1.5 w-32"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="WARNING">Warning</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid View */}
      {viewMode === 'table' ? (
        <div className="card-modern overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Establishment & License</th>
                  <th>Category</th>
                  <th>District</th>
                  <th>Risk Tier</th>
                  <th>Health Score</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBusinesses.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div>
                        <p className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setSelectedBusiness(b)}>
                          {b.name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">{b.licenseNo}</p>
                      </div>
                    </td>
                    <td className="text-xs text-slate-600">{b.type}</td>
                    <td className="text-xs text-slate-600">{b.district}</td>
                    <td>
                      <span
                        className={`badge ${b.riskLevel === 'HIGH'
                          ? 'badge-danger'
                          : b.riskLevel === 'MEDIUM'
                            ? 'badge-warning'
                            : 'badge-success'
                          }`}
                      >
                        {b.riskLevel} RISK
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-extrabold ${b.healthScore >= 90
                            ? 'text-emerald-600'
                            : b.healthScore >= 75
                              ? 'text-amber-600'
                              : 'text-rose-600'
                            }`}
                        >
                          {b.healthScore}/100
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border text-slate-700">
                          {b.grade}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${b.status === 'ACTIVE'
                          ? 'badge-success'
                          : b.status === 'WARNING'
                            ? 'badge-warning'
                            : 'badge-danger'
                          }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedBusiness(b)}
                        className="btn-ghost text-xs text-indigo-600 font-semibold"
                      >
                        Details &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBusinesses.map((b) => (
            <div
              key={b.id}
              className="card-modern space-y-4 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span
                    className={`badge ${b.riskLevel === 'HIGH'
                      ? 'badge-danger'
                      : b.riskLevel === 'MEDIUM'
                        ? 'badge-warning'
                        : 'badge-success'
                      }`}
                  >
                    {b.riskLevel} RISK
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-slate-900 text-white">
                    Grade {b.grade} ({b.healthScore}%)
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{b.name}</h3>
                <p className="text-xs text-slate-500">{b.type} &bull; {b.district}</p>
                <p className="text-[11px] font-mono text-slate-400">{b.licenseNo}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`badge ${b.status === 'ACTIVE'
                    ? 'badge-success'
                    : b.status === 'WARNING'
                      ? 'badge-warning'
                      : 'badge-danger'
                    }`}
                >
                  {b.status}
                </span>

                <button
                  onClick={() => setSelectedBusiness(b)}
                  className="btn-ghost text-xs text-indigo-600 font-semibold"
                >
                  View Record &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Business Details Drawer / Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-scale-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="badge badge-purple mb-2">{selectedBusiness.type}</span>
                <h2 className="text-2xl font-extrabold text-slate-900">{selectedBusiness.name}</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">License: {selectedBusiness.licenseNo}</p>
              </div>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Health Rating</p>
                <p className="text-xl font-extrabold text-indigo-600 mt-0.5">
                  {selectedBusiness.healthScore}/100 ({selectedBusiness.grade})
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Risk Tier</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedBusiness.riskLevel}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedBusiness.status}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Audits</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedBusiness.totalInspections} Audits</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Contact & Location Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{selectedBusiness.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedBusiness.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{selectedBusiness.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Last Audited: {selectedBusiness.lastInspectionDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-2">
                <button onClick={() => toast.success('QR Generated')} className="btn-secondary flex items-center gap-2">
                  <QrCode className="w-4 h-4" /> Generate QR
                </button>
                <button onClick={() => {
                  toast.promise(generateQRCertificate(selectedBusiness), {
                    loading: 'Generating official certificate...',
                    success: 'Certificate printed successfully',
                    error: 'Failed to generate certificate'
                  });
                }} className="btn-ghost flex items-center gap-2 border">
                  <Printer className="w-4 h-4" /> Print Certificate
                </button>
              </div>
              <button onClick={() => setSelectedBusiness(null)} className="btn-secondary">
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Business Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Register Food Establishment</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Ocean Restaurant"
                  value={newBiz.name}
                  onChange={(e) => setNewBiz({ ...newBiz, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Establishment Category</label>
                  <select
                    value={newBiz.type}
                    onChange={(e) => setNewBiz({ ...newBiz, type: e.target.value })}
                    className="select-field"
                  >
                    <option value="Fine Dining Restaurant">Fine Dining Restaurant</option>
                    <option value="Fast Casual">Fast Casual</option>
                    <option value="Grocery & Deli">Grocery & Deli</option>
                    <option value="Bakery & Cafe">Bakery & Cafe</option>
                    <option value="Mobile Food Unit">Mobile Food Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Risk Classification</label>
                  <select
                    value={newBiz.riskLevel}
                    onChange={(e) => setNewBiz({ ...newBiz, riskLevel: e.target.value })}
                    className="select-field"
                  >
                    <option value="HIGH">High Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="LOW">Low Risk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Owner / Operator Name"
                    value={newBiz.owner}
                    onChange={(e) => setNewBiz({ ...newBiz, owner: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District Area</label>
                  <select
                    value={newBiz.district}
                    onChange={(e) => setNewBiz({ ...newBiz, district: e.target.value })}
                    className="select-field"
                  >
                    <option value="Downtown District">Downtown District</option>
                    <option value="Eastside District">Eastside District</option>
                    <option value="Northside District">Northside District</option>
                    <option value="Harbor District">Harbor District</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  placeholder="Street Address, Building #"
                  value={newBiz.address}
                  onChange={(e) => setNewBiz({ ...newBiz, address: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
