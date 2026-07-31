import { z } from 'zod';

export const updateFrequencyRuleSchema = z.object({
    body: z.object({
        riskCategory: z.enum(['Low', 'Medium', 'High', 'Critical']),
        intervalDays: z.number().min(1).max(3650)
    })
});
