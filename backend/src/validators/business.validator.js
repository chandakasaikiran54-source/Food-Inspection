import { z } from 'zod';

export const createBusinessSchema = z.object({
    body: z.object({
        businessName: z.string().min(2, 'Business name must be at least 2 characters'),
        licenseNumber: z.string().min(5, 'License number is required'),
        businessType: z.string().min(2, 'Business type is required'),
        foodCategory: z.string().min(2, 'Food category is required'),
        ownerName: z.string().min(2, 'Owner name is required'),
        phone: z.string().min(10, 'Valid phone number is required'),
        email: z.string().email('Valid email is required').optional().or(z.literal('')),
        address: z.string().min(5, 'Detailed address is required'),
        ward: z.string().min(1, 'Ward is required'),
        zone: z.string().min(1, 'Zone is required'),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        licenseIssueDate: z.string().datetime({ message: 'Invalid issue date format' }).or(z.date()),
        licenseExpiryDate: z.string().datetime({ message: 'Invalid expiry date format' }).or(z.date()),
        businessStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED']).optional(),
        riskCategory: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    }),
});

export const updateBusinessSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid Business ID') }),
    body: createBusinessSchema.shape.body.partial(),
});

export const queryBusinessSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        search: z.string().optional(),
        ward: z.string().optional(),
        zone: z.string().optional(),
        riskCategory: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
        businessStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED']).optional(),
        sortBy: z.string().optional(),
        order: z.enum(['asc', 'desc']).optional(),
    }),
});
