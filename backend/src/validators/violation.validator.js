import { z } from 'zod';

export const createViolationSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid Inspection ID') }),
    body: z.object({
        violationCode: z.string().min(2),
        violationTitle: z.string().min(3),
        violationCategory: z.string().min(2),
        description: z.string().min(5),
        severity: z.enum(['Critical', 'Major', 'Minor']),
        penaltyRecommendation: z.string().optional().nullable(),
        correctiveAction: z.string().min(2),
        status: z.enum(['Resolved', 'Pending']).optional()
    })
});

export const updateViolationSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid Violation ID') }),
    body: z.object({
        violationTitle: z.string().min(3).optional(),
        description: z.string().min(5).optional(),
        severity: z.enum(['Critical', 'Major', 'Minor']).optional(),
        penaltyRecommendation: z.string().optional().nullable(),
        correctiveAction: z.string().min(2).optional(),
        status: z.enum(['Resolved', 'Pending']).optional()
    })
});
