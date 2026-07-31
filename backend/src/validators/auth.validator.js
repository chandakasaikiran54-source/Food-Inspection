/**
 * src/validators/auth.validator.js
 * Zod schemas for all auth endpoints.
 */

import { z } from 'zod';

const ROLES = ['ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR', 'BUSINESS'];

export const signupSchema = z
    .object({
        fullName: z.string({ required_error: 'Full name is required' }).min(2).max(100).trim(),
        email: z.string({ required_error: 'Email is required' }).email('Please enter a valid email').toLowerCase(),
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string({ required_error: 'Please confirm your password' }),
        role: z.enum(ROLES, { errorMap: () => ({ message: `Role must be one of: ${ROLES.join(', ')}` }) }),
        phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits', { message: 'Phone number must be exactly 10 digits' }).optional(),
        alternatePhone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits').optional().or(z.literal('')),
        department: z.string().trim().optional(),

        // BUSINESS fields (enforced via superRefine)
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

        govIdType: z.enum(['Aadhaar', 'PAN', 'Driving Licence', 'Voter ID'], { errorMap: () => ({ message: 'Select a valid ID type' }) }).optional(),
        govIdNumber: z.string().trim().optional(),

        gstNumber: z.string().trim().optional(),
        fssaiLicenseNumber: z.string().trim().optional(),
        tradeLicense: z.string().trim().optional(),
        businessOpeningDate: z.string().transform(str => str ? new Date(str) : null).optional().nullable(),
        numberOfEmployees: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().optional()),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords do not match", path: ['confirmPassword'] });
        }

        if (data.role === 'BUSINESS') {
            const requiredFields = [
                'phone',
                'foodBusinessName',
                'foodBusinessLicenseNumber',
                'businessType',
                'streetArea',
                'villageLocality',
                'mandal',
                'district',
                'state',
                'pincode'
            ];
            requiredFields.forEach((field) => {
                if (!data[field] || data[field].toString().trim() === '') {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${field} is required for Food Business Owners`, path: [field] });
                }
            });
        }
    });

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Please enter a valid email')
        .toLowerCase(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Please enter a valid email')
        .toLowerCase(),
});

export const resetPasswordSchema = z
    .object({
        token: z.string({ required_error: 'Reset token is required' }).min(1),
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string({ required_error: 'Please confirm your password' }),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const changePasswordSchema = z
    .object({
        currentPassword: z.string({ required_error: 'Current password is required' }).min(1),
        newPassword: z
            .string({ required_error: 'New password is required' })
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmNewPassword: z.string({ required_error: 'Please confirm your new password' }),
    })
    .refine((d) => d.newPassword === d.confirmNewPassword, {
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
    });
