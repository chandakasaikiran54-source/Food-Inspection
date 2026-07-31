/**
 * src/pages/profile/ChangePasswordPage.jsx
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const schema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
    confirmNewPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmNewPassword, { message: 'Passwords do not match', path: ['confirmNewPassword'] });

export default function ChangePasswordPage() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (data) => {
        try {
            await api.patch('/users/me/password', data);
            toast.success('Password changed successfully');
            reset();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="max-w-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
            <div className="card p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {[
                        { name: 'currentPassword', label: 'Current Password' },
                        { name: 'newPassword', label: 'New Password' },
                        { name: 'confirmNewPassword', label: 'Confirm New Password' },
                    ].map(({ name, label }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input type="password" placeholder="••••••••" className={`input-field ${errors[name] ? 'border-red-400' : ''}`} {...register(name)} />
                            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                        </div>
                    ))}
                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
                        {isSubmitting ? 'Saving…' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
