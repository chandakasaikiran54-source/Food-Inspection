/**
 * src/pages/auth/LoginPage.jsx
 * Login form using React Hook Form + Zod validation.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const schema = z.object({
    email: z.string().email('Enter a valid email').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await login(data);
            toast.success('Welcome back!');
            navigate('/', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sidebar via-primary-900 to-primary-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🍽️</div>
                    <h1 className="text-2xl font-bold text-gray-900">Food Inspection Monitor</h1>
                    <p className="text-sm text-gray-500 mt-1">Government Health Department Portal</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="officer@health.gov"
                            className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                            {...register('email')}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className={`input-field ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                            {...register('password')}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-3 mt-2 text-base"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Signing in…
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="text-xs text-center text-gray-400 mt-6">
                    Authorised personnel only. All access is logged and monitored.
                </p>
            </div>
        </div>
    );
}
