import { z } from 'zod';

export const createInspectorSchema = z.object({
    body: z.object({
        employeeId: z.string().min(2, 'Employee ID is required'),
        fullName: z.string().min(2, 'Full Name is required'),
        email: z.string().email('Valid Email is required'),
        phone: z.string().min(10, 'Valid phone is required'),
        designation: z.string().min(2, 'Designation is required'),
        department: z.string().min(2, 'Department is required'),
        experience: z.number().min(0, 'Experience must be 0 or greater'),
        maxWorkload: z.number().min(1, 'Max workload must be at least 1').optional(),
        availabilityStatus: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).optional(),
        employmentStatus: z.enum(['FULL_TIME', 'CONTRACTOR', 'TERMINATED']).optional(),
        joiningDate: z.string().datetime({ message: 'Invalid joining date form' }).or(z.date()),
        profilePhoto: z.string().optional().nullable()
    }),
});

export const updateInspectorSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid Inspector ID') }),
    body: createInspectorSchema.shape.body.partial(),
});

export const updateInspectorStatusSchema = z.object({
    params: z.object({ id: z.string().length(24, 'Invalid Inspector ID') }),
    body: z.object({
        availabilityStatus: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE'])
    })
});

export const queryInspectorSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        search: z.string().optional(),
        department: z.string().optional(),
        availabilityStatus: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).optional(),
        sortBy: z.string().optional(),
        order: z.enum(['asc', 'desc']).optional(),
    }),
});
