/**
 * src/pages/auth/LoginPage.jsx
 * GVMC Official Login Page
 * Food Safety Inspection Monitoring System
 * Government of Andhra Pradesh – GVMC – Public Health Department
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import GvmcLogo from '../../components/layout/GvmcLogo.jsx';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Building2,
  Award,
  AlertTriangle,
} from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid official email').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

// Demo accounts removed for strictly authenticated production deployments

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const checkCapsLock = (e) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome to Food Safety Inspection Portal!', { icon: '👋' });
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden font-sans" style={{ fontFamily: 'var(--font-family-main)' }}>

      {/* ── Left Panel: Government Hero ──────────────── */}
      <div
        className="lg:w-6/12 flex flex-col justify-between p-8 lg:p-14 text-white"
        style={{ backgroundColor: 'var(--gov-primary)', background: 'linear-gradient(160deg, #3D405B 0%, #353857 60%, #2e3147 100%)' }}
      >
        {/* Top: GVMC Logo + Title */}
        <div className="flex items-center gap-4">
          <GvmcLogo size="xl" rounded="2xl" className="shadow-xl border-2 border-white/20" />
          <div>
            <p className="font-bold text-lg leading-tight">GVMC</p>
            <p className="text-white/70 text-sm leading-snug">Greater Visakhapatnam Municipal Corporation</p>
            <p className="text-white/50 text-xs mt-0.5">Public Health Department</p>
          </div>
        </div>

        {/* Center Content */}
        <div className="my-10 lg:my-0 space-y-6 max-w-lg">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{ backgroundColor: 'rgba(129,178,154,0.15)', borderColor: 'rgba(129,178,154,0.3)', color: '#a8d5bf' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Government of Andhra Pradesh · Official Portal
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
            Food Safety Inspection
            <span className="block" style={{ color: 'var(--gov-highlight)' }}>
              Monitoring System
            </span>
          </h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { icon: Building2, value: '1,240+', label: 'Registered Businesses', color: 'var(--gov-secondary)' },
              { icon: CheckCircle2, value: '98.4%', label: 'Compliance Rate', color: 'var(--gov-highlight)' },
              { icon: Award, value: 'Grade A', label: 'Top GVMC Venues', color: 'var(--gov-accent)' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div
                key={label}
                className="p-4 rounded-xl border"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <Icon className="w-5 h-5 mb-2" style={{ color }} />
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Government of Andhra Pradesh · GVMC Public Health Department.
          Authorized Personnel Only.
        </p>
      </div>

      {/* ── Right Panel: Login Form ───────────────── */}
      <div className="lg:w-6/12 bg-white flex items-center justify-center p-8 lg:p-14" style={{ backgroundColor: 'var(--gov-bg)' }}>
        <div className="w-full max-w-md space-y-7 animate-slide-up">

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--gov-primary)' }}>
              Sign In to Portal
            </h2>
            <p className="text-sm text-gray-500">
              Enter your official credentials to access the Food Safety Inspection Portal.
            </p>
          </div>

          {/* Main spacer */}
          <div className="py-2" />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gov-primary)' }}>
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="officer@gvmc.gov.in"
                  className="input-field pl-10"
                  style={errors.email ? { borderColor: 'var(--gov-accent)' } : {}}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--gov-accent)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gov-primary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  style={errors.password ? { borderColor: 'var(--gov-accent)' } : {}}
                  {...register('password')}
                  onKeyUp={checkCapsLock}
                  onKeyDown={checkCapsLock}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {capsLockActive && (
                <p className="text-[10px] mt-1.5 font-bold flex items-center gap-1" style={{ color: 'var(--gov-highlight)' }}>
                  <AlertTriangle className="w-3 h-3" /> CAPSLOCK IS ON
                </p>
              )}
              {errors.password && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--gov-accent)' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Extras */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-gray-300"
                  style={{ accentColor: 'var(--gov-primary)' }}
                  {...register('rememberMe')}
                />
                <span className="text-xs font-semibold text-gray-600">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => toast('Forgot Password functionality will be enabled soon.', { icon: 'ℹ️' })}
                className="text-xs font-semibold hover:underline transition-all"
                style={{ color: 'var(--gov-primary)' }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to Portal <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-xs font-semibold text-gray-600 mt-5 mb-2">
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--gov-primary)' }} className="hover:underline ml-1">
              Create one now
            </Link>
          </p>

          <p className="text-xs text-center text-gray-400">
            Protected by SSL encryption. GVMC Authorized Access Only.
          </p>

          {/* Bottom branding */}
          <div className="text-center pt-2 border-t border-gray-200">
            <p className="text-[11px] text-gray-400">
              Government of Andhra Pradesh · GVMC · Public Health Department
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
