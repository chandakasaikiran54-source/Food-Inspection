/**
 * src/validators/user.validator.js
 * Zod schemas for user CRUD endpoints.
 */

import { z } from 'zod';

const ROLES = ['ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR', 'BUSINESS'];
const STATUSES = ['ACTIVE', 'INACTIVE'];

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

export const createUserSchema = z.object({
    fullName: z.string({ required_error: 'Full name is required' }).min(2).max(100).trim(),
    email: z.string({ required_error: 'Email is required' }).email().toLowerCase(),
    password: passwordSchema,
    role: z.enum(ROLES, { errorMap: () => ({ message: `Role must be one of: ${ROLES.join(', ')}` }) }),
    status: z.enum(STATUSES).optional().default('ACTIVE'),
});

export const updateUserSchema = z.object({
    fullName: z.string().min(2).max(100).trim().optional(),
    role: z.enum(ROLES).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided' });

export const updateStatusSchema = z.object({
    status: z.enum(STATUSES, {
        errorMap: () => ({ message: `Status must be one of: ${STATUSES.join(', ')}` }),
    }),
});

export const listUsersSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    role: z.enum(ROLES).optional(),
    status: z.enum(STATUSES).optional(),
    search: z.string().max(100).optional(),
    sortBy: z.enum(['createdAt', 'fullName', 'email', 'role', 'status']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
});
