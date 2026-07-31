/**
 * src/validators/auth.validator.js
 * Zod schemas for all auth endpoints.
 */

import { z } from 'zod';

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
