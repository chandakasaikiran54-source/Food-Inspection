/**
 * src/pages/users/UserManagementPage.jsx
 * Admin-only page: Create, Read, Update, Delete users
 * with search, role/status filters, and pagination.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../../services/api.js';
import { ENDPOINTS } from '../../constants/api.js';

// ─── Validation ───────────────────────────────────────────────────────────────
const createSchema = z.object({
    fullName: z.string().min(2, 'Full name required'),
    email: z.string().email('Valid email required'),
    password: z.string().min(8, 'Min 8 characters'),
    role: z.enum(['ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR']),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ROLE_BADGE = {
    ADMIN: 'badge-admin',
    COMMISSIONER: 'badge-commissioner',
    SUPERVISOR: 'badge-supervisor',
    INSPECTOR: 'badge-inspector',
};

function StatusBadge({ status }) {
    return <span className={status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>{status}</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
    const qc = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const LIMIT = 10;

    // ─── Fetch users ────────────────────────────────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ['users', page, search, roleFilter, statusFilter],
        queryFn: async () => {
            const params = new URLSearchParams({ page, limit: LIMIT });
            if (search) params.set('search', search);
            if (roleFilter) params.set('role', roleFilter);
            if (statusFilter) params.set('status', statusFilter);
            const res = await api.get(`${ENDPOINTS.USERS}?${params}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    // ─── Create user ────────────────────────────────────────────────────────────
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(createSchema),
        defaultValues: { role: 'INSPECTOR' },
    });

    const createMutation = useMutation({
        mutationFn: (payload) => api.post(ENDPOINTS.USERS, payload),
        onSuccess: () => {
            toast.success('User created successfully');
            qc.invalidateQueries(['users']);
            setShowModal(false);
            reset();
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to create user'),
    });

    // ─── Toggle status ───────────────────────────────────────────────────────────
    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => api.patch(`${ENDPOINTS.USERS}/${id}/status`, { status }),
        onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['users']); },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
    });

    // ─── Delete ──────────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`${ENDPOINTS.USERS}/${id}`),
        onSuccess: () => { toast.success('User deleted'); qc.invalidateQueries(['users']); },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete user'),
    });

    const users = data?.data?.data ?? [];
    const pagination = data?.data?.pagination ?? {};

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage system users and their roles</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>＋ Add User</button>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Search name or email…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="input-field max-w-xs"
                />
                <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="input-field max-w-xs">
                    <option value="">All Roles</option>
                    {['ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'].map((r) => <option key={r}>{r}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field max-w-xs">
                    <option value="">All Statuses</option>
                    <option>ACTIVE</option>
                    <option>INACTIVE</option>
                </select>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                {['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading…</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No users found</td></tr>
                            ) : users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{u.fullName}</td>
                                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                                    <td className="px-4 py-3"><span className={ROLE_BADGE[u.role]}>{u.role}</span></td>
                                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                                    <td className="px-4 py-3 text-gray-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                className="text-xs px-2.5 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                                onClick={() => statusMutation.mutate({ id: u._id, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                                            >
                                                {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                className="text-xs px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                                                onClick={() => { if (confirm(`Delete ${u.fullName}?`)) deleteMutation.mutate(u._id); }}
                                            >Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <p className="text-sm text-gray-500">
                            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, pagination.total)} of {pagination.total}
                        </p>
                        <div className="flex gap-2">
                            <button disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm py-1.5 disabled:opacity-40">← Prev</button>
                            <button disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm py-1.5 disabled:opacity-40">Next →</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Create New User</h3>
                        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                            {[
                                { name: 'fullName', label: 'Full Name', type: 'text', ph: 'John Doe' },
                                { name: 'email', label: 'Email', type: 'email', ph: 'user@health.gov' },
                                { name: 'password', label: 'Password', type: 'password', ph: '••••••••' },
                            ].map(({ name, label, type, ph }) => (
                                <div key={name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <input type={type} placeholder={ph} className={`input-field ${errors[name] ? 'border-red-400' : ''}`} {...register(name)} />
                                    {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select className="input-field" {...register('role')}>
                                    {['ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'].map((r) => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowModal(false); reset(); }} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                                    {isSubmitting ? 'Creating…' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
