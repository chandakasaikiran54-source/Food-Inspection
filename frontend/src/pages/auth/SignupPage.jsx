/**
 * src/pages/auth/SignupPage.jsx
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import GvmcLogo from '../../components/layout/GvmcLogo.jsx';
import toast from 'react-hot-toast';
import api from '../../services/api.js';
import { ENDPOINTS } from '../../constants/api.js';
import { ShieldCheck, Lock, Mail, User, Phone, CheckCircle2, Store } from 'lucide-react';

const ROLES = ['ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR', 'BUSINESS'];
const BUSINESS_TYPES = ['Restaurant', 'Hotel', 'Bakery', 'Tea Stall', 'Street Food Vendor', 'Fast Food Center', 'Sweet Shop', 'Cafe', 'Mess', 'Food Truck', 'Catering Service', 'Other'];
const GOV_ID_TYPES = ['Aadhaar', 'PAN', 'Driving Licence', 'Voter ID'];

const schema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid official email').min(1, 'Email is required'),
    password: z.string().min(8, 'Minimum 8 characters').regex(/[A-Z]/, 'One uppercase').regex(/[0-9]/, 'One number'),
    confirmPassword: z.string().min(1, 'Confirm password'),
    role: z.enum(ROLES, { errorMap: () => ({ message: 'Select a valid role' }) }),
    phone: z.string().regex(/^\d{10}$/, 'Exactly 10 digits', { message: 'Exactly 10 digits required' }).optional(),
    alternatePhone: z.string().regex(/^\d{10}$/, 'Exactly 10 digits').optional().or(z.literal('')),
    department: z.string().trim().optional(),

    // BUSINESS ONLY FIELDS
    foodBusinessName: z.string().trim().optional(),
    foodBusinessLicenseNumber: z.string().trim().optional(),
    businessType: z.string().trim().optional(),
    shopNumber: z.string().trim().optional(),
    streetArea: z.string().trim().optional(),
    villageLocality: z.string().trim().optional(),
    mandal: z.string().trim().optional(),
    district: z.string().trim().optional(),
    state: z.string().trim().optional(),
    pincode: z.string().trim().optional(),
    landmark: z.string().trim().optional(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    govIdType: z.enum(GOV_ID_TYPES).optional(),
    govIdNumber: z.string().trim().optional(),
    gstNumber: z.string().trim().optional(),
    fssaiLicenseNumber: z.string().trim().optional(),
    tradeLicense: z.string().trim().optional(),
    businessOpeningDate: z.string().optional().nullable(),
    numberOfEmployees: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().optional()),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords don't match", path: ['confirmPassword'] });
    }

    if (data.role === 'BUSINESS') {
        const requiredFields = [
            'phone', 'foodBusinessName', 'foodBusinessLicenseNumber',
            'businessType', 'streetArea', 'villageLocality',
            'mandal', 'district', 'state', 'pincode'
        ];
        requiredFields.forEach((field) => {
            if (!data[field] || data[field].toString().trim() === '') {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Required for Business Owners`, path: [field] });
            }
        });
    }
});

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [fetchingLocation, setFetchingLocation] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { role: 'INSPECTOR', state: 'Andhra Pradesh' }
    });

    const selectedRole = watch('role');
    const isBusiness = selectedRole === 'BUSINESS';

    const fetchLocation = async () => {
        const lat = getValues('latitude');
        const lng = getValues('longitude');
        if (!lat || !lng || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            toast.error('Please enter valid latitude (-90 to 90) and longitude (-180 to 180).');
            return;
        }

        setFetchingLocation(true);
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.address) {
                const { village, town, city, suburb, county, state_district, state, postcode } = data.address;

                setValue('villageLocality', village || suburb || town || city || '');
                setValue('mandal', county || town || city || '');
                setValue('district', state_district || county || city || '');
                setValue('state', state || '');
                setValue('pincode', postcode || '');

                toast.success('Location fetched successfully.');
            } else {
                toast.error('Unable to fetch location. Please enter the address manually.');
            }
        } catch (error) {
            toast.error('Unable to fetch location. Please enter the address manually.');
        } finally {
            setFetchingLocation(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (!data.phone) delete data.phone;
            if (!data.department) delete data.department;
            const res = await api.post(ENDPOINTS.SIGNUP, data);

            const { accessToken, user: u } = res.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(u));
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

            toast.success('Registration successful. Welcome!', { icon: '✨' });
            window.location.replace('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row font-sans" style={{ fontFamily: 'var(--font-family-main)' }}>
            {/* Left Panel - Sticky */}
            <div className="lg:w-4/12 lg:fixed lg:h-screen flex flex-col justify-between p-8 lg:p-14 text-white" style={{ backgroundColor: 'var(--gov-primary)', background: 'linear-gradient(160deg, #3D405B 0%, #353857 60%, #2e3147 100%)' }}>
                <div className="flex items-center gap-4">
                    <GvmcLogo size="xl" rounded="2xl" className="shadow-xl border-2 border-white/20" />
                    <div>
                        <p className="font-bold text-lg leading-tight">GVMC</p>
                        <p className="text-white/70 text-sm leading-snug">Greater Visakhapatnam Municipal Corporation</p>
                        <p className="text-white/50 text-xs mt-0.5">Public Health Department</p>
                    </div>
                </div>
                <div className="my-8 lg:my-0 space-y-6 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(129,178,154,0.15)', borderColor: 'rgba(129,178,154,0.3)', color: '#a8d5bf' }}>
                        <ShieldCheck className="w-3.5 h-3.5" /> Official Portal
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
                        Create Official <span className="block" style={{ color: 'var(--gov-highlight)' }}>Account</span>
                    </h1>
                    <p className="text-white/60 text-sm leading-relaxed">Join the Food Safety Inspection framework securely mapping compliance targets accurately in real time.</p>
                </div>
                <p className="text-xs text-white/40 hidden lg:block">System developed under BookMyStay architectural standards</p>
            </div>

            {/* Right Panel - Scrollable */}
            <div className="lg:w-8/12 lg:ml-[33.333333%] bg-gray-50/50 min-h-screen">
                <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold" style={{ color: 'var(--gov-primary)' }}>Account Registration</h2>
                            <p className="text-sm text-gray-500 mt-1">Provide verified official credentials explicitly</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                            {/* ROLE SELECTION */}
                            <div className="pb-6 border-b border-gray-100">
                                <label className="block text-sm font-bold uppercase mb-3" style={{ color: 'var(--gov-primary)' }}>Select Role / Designation</label>
                                <select className="input-field text-sm font-semibold py-3 bg-gray-50 shadow-sm border-gray-200" {...register('role')}>
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                {errors.role && <p className="text-[10px] text-red-500 mt-1">{errors.role.message}</p>}
                            </div>

                            {/* SECTION 1: PERSONAL INFORMATION */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--gov-secondary)' }}>1. Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Full Name *</label>
                                        <div className="relative">
                                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" className="input-field pl-9 text-sm" style={errors.fullName ? { borderColor: 'var(--gov-accent)' } : {}} {...register('fullName')} />
                                        </div>
                                        {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Official Email Address *</label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="email" className="input-field pl-9 text-sm" style={errors.email ? { borderColor: 'var(--gov-accent)' } : {}} {...register('email')} />
                                        </div>
                                        {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Password *</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type={showPassword ? 'text' : 'password'} className="input-field pl-9 text-sm" style={errors.password ? { borderColor: 'var(--gov-accent)' } : {}} {...register('password')} />
                                        </div>
                                        {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Confirm Password *</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type={showPassword ? 'text' : 'password'} className="input-field pl-9 text-sm" style={errors.confirmPassword ? { borderColor: 'var(--gov-accent)' } : {}} {...register('confirmPassword')} />
                                        </div>
                                        {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Mobile Number {isBusiness ? '*' : ''}</label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="tel" className="input-field pl-9 text-sm" style={errors.phone ? { borderColor: 'var(--gov-accent)' } : {}} {...register('phone')} />
                                        </div>
                                        {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone.message}</p>}
                                    </div>
                                    {isBusiness && (
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Alternate Mobile Number</label>
                                            <div className="relative">
                                                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="tel" className="input-field pl-9 text-sm" {...register('alternatePhone')} placeholder="(Optional)" />
                                            </div>
                                            {errors.alternatePhone && <p className="text-[10px] text-red-500 mt-1">{errors.alternatePhone.message}</p>}
                                        </div>
                                    )}
                                    {!isBusiness && (
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Department (Optional)</label>
                                            <input type="text" className="input-field text-sm" placeholder="e.g. Public Health Division 4" {...register('department')} />
                                            {errors.department && <p className="text-[10px] text-red-500 mt-1">{errors.department.message}</p>}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <input type="checkbox" id="spw" onChange={() => setShowPassword(!showPassword)} className="w-3.5 h-3.5 rounded border-gray-300" style={{ accentColor: 'var(--gov-primary)' }} />
                                    <label htmlFor="spw" className="text-[11px] text-gray-600 font-semibold cursor-pointer uppercase">Show Passwords</label>
                                </div>
                            </div>

                            {/* --- SHOP OWNER DEDICATED SECTIONS --- */}
                            {isBusiness && (
                                <>
                                    {/* SECTION 2: BUSINESS INFORMATION */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--gov-secondary)' }}>2. Business Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Food Business Name *</label>
                                                <div className="relative">
                                                    <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input type="text" className="input-field pl-9 text-sm" style={errors.foodBusinessName ? { borderColor: 'var(--gov-accent)' } : {}} {...register('foodBusinessName')} />
                                                </div>
                                                {errors.foodBusinessName && <p className="text-[10px] text-red-500 mt-1">{errors.foodBusinessName.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>GVMC License Number *</label>
                                                <input type="text" className="input-field text-sm" style={errors.foodBusinessLicenseNumber ? { borderColor: 'var(--gov-accent)' } : {}} {...register('foodBusinessLicenseNumber')} />
                                                {errors.foodBusinessLicenseNumber && <p className="text-[10px] text-red-500 mt-1">{errors.foodBusinessLicenseNumber.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Business Type *</label>
                                                <select className="input-field text-sm bg-white" style={errors.businessType ? { borderColor: 'var(--gov-accent)' } : {}} {...register('businessType')}>
                                                    <option value="">Select Type...</option>
                                                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                {errors.businessType && <p className="text-[10px] text-red-500 mt-1">{errors.businessType.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 3: BUSINESS ADDRESS */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--gov-secondary)' }}>3. Business Address</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Shop Number (Optional)</label>
                                                <input type="text" className="input-field text-sm" {...register('shopNumber')} />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Street / Area *</label>
                                                <input type="text" className="input-field text-sm" style={errors.streetArea ? { borderColor: 'var(--gov-accent)' } : {}} {...register('streetArea')} />
                                                {errors.streetArea && <p className="text-[10px] text-red-500 mt-1">{errors.streetArea.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Village / Locality *</label>
                                                <input type="text" className="input-field text-sm" style={errors.villageLocality ? { borderColor: 'var(--gov-accent)' } : {}} {...register('villageLocality')} />
                                                {errors.villageLocality && <p className="text-[10px] text-red-500 mt-1">{errors.villageLocality.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Mandal *</label>
                                                <input type="text" className="input-field text-sm" style={errors.mandal ? { borderColor: 'var(--gov-accent)' } : {}} {...register('mandal')} />
                                                {errors.mandal && <p className="text-[10px] text-red-500 mt-1">{errors.mandal.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>District *</label>
                                                <input type="text" className="input-field text-sm" style={errors.district ? { borderColor: 'var(--gov-accent)' } : {}} {...register('district')} />
                                                {errors.district && <p className="text-[10px] text-red-500 mt-1">{errors.district.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>State *</label>
                                                <input type="text" className="input-field text-sm" style={errors.state ? { borderColor: 'var(--gov-accent)' } : {}} {...register('state')} />
                                                {errors.state && <p className="text-[10px] text-red-500 mt-1">{errors.state.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Pincode *</label>
                                                <input type="text" className="input-field text-sm" style={errors.pincode ? { borderColor: 'var(--gov-accent)' } : {}} {...register('pincode')} />
                                                {errors.pincode && <p className="text-[10px] text-red-500 mt-1">{errors.pincode.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Landmark (Optional)</label>
                                                <input type="text" className="input-field text-sm" {...register('landmark')} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 4: LOCATION */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--gov-secondary)' }}>4. Location (Optional GPS)</h3>
                                            <button type="button" onClick={fetchLocation} disabled={fetchingLocation} className="text-[10px] uppercase font-bold bg-[#3D405B] text-white hover:bg-opacity-90 px-3 py-1.5 rounded transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm">
                                                {fetchingLocation ? <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : null}
                                                Fetch Address Details
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Latitude</label>
                                                <input type="number" step="any" className="input-field text-sm" placeholder="e.g. 17.6868" {...register('latitude', { valueAsNumber: true })} />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Longitude</label>
                                                <input type="number" step="any" className="input-field text-sm" placeholder="e.g. 83.2185" {...register('longitude', { valueAsNumber: true })} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 5: OWNER DETAILS */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--gov-secondary)' }}>5. Owner Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Government ID Type</label>
                                                <select className="input-field text-sm bg-white" {...register('govIdType')}>
                                                    <option value="">Select ID Type...</option>
                                                    {GOV_ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                {errors.govIdType && <p className="text-[10px] text-red-500 mt-1">{errors.govIdType.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Government ID Number</label>
                                                <input type="text" className="input-field text-sm" {...register('govIdNumber')} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 6: BUSINESS DETAILS */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--gov-secondary)' }}>6. Official Business Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>GST Number (Optional)</label>
                                                <input type="text" className="input-field text-sm uppercase" {...register('gstNumber')} />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>FSSAI License Number (Optional)</label>
                                                <input type="text" className="input-field text-sm uppercase" {...register('fssaiLicenseNumber')} />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Trade License Number (Optional)</label>
                                                <input type="text" className="input-field text-sm uppercase" {...register('tradeLicense')} />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Business Opening Date</label>
                                                <input type="date" className="input-field text-sm" {...register('businessOpeningDate')} />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--gov-primary)' }}>Number of Employees</label>
                                                <input type="number" className="input-field text-sm" {...register('numberOfEmployees')} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 7: UPLOADS */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100 opacity-60">
                                        <h3 className="text-sm font-bold uppercase flex items-center justify-between" style={{ color: 'var(--gov-secondary)' }}>
                                            7. Uploads <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-600">Future Integration</span>
                                        </h3>
                                        <p className="text-xs text-gray-500">Document uploads are mocked for future integration.</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {['Business License', 'Identity Proof', 'Address Proof', 'Shop Photograph'].map((label) => (
                                                <div key={label} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                    <p className="text-xs font-semibold text-gray-600">{label}</p>
                                                    <button type="button" disabled className="mt-2 text-[10px] bg-gray-100 px-3 py-1.5 rounded font-bold text-gray-400">Select File</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* SUBMIT */}
                            <div className="pt-4">
                                <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all font-bold text-sm">
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>{isBusiness ? 'Register Official Food Business' : 'Create Access Account'} <CheckCircle2 className="w-5 h-5" /></>
                                    )}
                                </button>
                                <p className="text-center text-xs font-bold text-gray-600 mt-5">
                                    Already registered? <Link to="/login" style={{ color: 'var(--gov-primary)' }} className="hover:underline ml-1">Portal Login</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
