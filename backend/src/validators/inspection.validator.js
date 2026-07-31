import { z } from 'zod';

export const createInspectionSchema = z.object({
    body: z.object({
        business: z.string().length(24, 'Invalid Food Business ID'),
        inspector: z.string().length(24, 'Invalid Inspector ID'),
        ward: z.string().length(24, 'Invalid Ward ID'),
        inspectionType: z.enum(['Routine', 'Complaint', 'Follow-up', 'Surprise', 'Special Drive']),
        inspectionCategory: z.string().min(2),
        scheduledDate: z.string().datetime().or(z.date()),
    })
});

export const updateInspectionSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid Inspection ID') }),
    body: z.object({
        inspectionType: z.enum(['Routine', 'Complaint', 'Follow-up', 'Surprise', 'Special Drive']).optional(),
        scheduledDate: z.string().datetime().or(z.date()).optional(),
        assignedDate: z.string().datetime().or(z.date()).optional(),
        overallRemarks: z.string().optional(),
        recommendations: z.string().optional(),
        correctiveActions: z.string().optional(),
        followUpRequired: z.boolean().optional(),
        nextSuggestedInspectionDate: z.string().datetime().or(z.date()).optional().nullable(),
        gpsLatitude: z.number().min(-90).max(90).optional(),
        gpsLongitude: z.number().min(-180).max(180).optional(),
        digitalSignaturePlaceholder: z.string().optional()
    })
});

export const updateStatusSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid ID') }),
    body: z.object({
        status: z.enum(['Draft', 'Scheduled', 'Assigned', 'In Progress', 'Submitted', 'Reviewed', 'Completed', 'Cancelled'])
    })
});

export const assignInspectionSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid ID') }),
    body: z.object({
        inspectorId: z.string().length(24, 'Invalid Inspector ID')
    })
});

export const uploadEvidenceSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid ID') }),
    body: z.object({
        originalName: z.string().min(1),
        mimeType: z.string().min(1),
        size: z.number().min(1),
        category: z.enum(['images', 'documents']), // Custom helper for pseudo-upload
        mockFilePathContent: z.string().optional() // Mocking the physical file wrapper
    })
});

export const queryInspectionSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        inspector: z.string().optional(),
        ward: z.string().optional(),
        riskLevel: z.string().optional(),
        inspectionType: z.string().optional(),
        sortBy: z.string().optional(),
        order: z.enum(['asc', 'desc']).optional(),
    }),
});
