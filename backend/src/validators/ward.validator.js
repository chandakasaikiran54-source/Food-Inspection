import { z } from 'zod';

export const createWardSchema = z.object({
    body: z.object({
        wardNumber: z.string().min(1, 'Ward number is required'),
        wardName: z.string().min(2, 'Ward name is required'),
        zone: z.string().min(1, 'Zone is required'),
        circle: z.string().min(1, 'Circle is required'),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180)
    })
});

export const updateWardSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid Ward ID') }),
    body: createWardSchema.shape.body.partial()
});

export const assignInspectorSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid Ward ID') }),
    body: z.object({
        inspectorId: z.string().length(24, 'Invalid Inspector ID')
    })
});

export const queryWardSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        search: z.string().optional(),
        zone: z.string().optional(),
        circle: z.string().optional(),
        hasInspector: z.enum(['true', 'false']).optional(),
        sortBy: z.string().optional(),
        order: z.enum(['asc', 'desc']).optional(),
    }),
});
