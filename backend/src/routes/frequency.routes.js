import { Router } from 'express';
import frequencyController from '../controllers/frequency.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { updateFrequencyRuleSchema } from '../validators/frequency.validator.js';

const router = Router();
router.use(authenticate); // Global Protection

// Rule Configuration endpoints
router.get('/rules', authorize('ADMIN', 'SUPERVISOR', 'COMMISSIONER'), frequencyController.getRules);
router.put('/rules', authorize('ADMIN'), validate(updateFrequencyRuleSchema), frequencyController.updateRule);

// Engine Analytics
router.get('/dashboard', authorize('ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'), frequencyController.getDashboardMetrics);
router.get('/overdue', authorize('ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'), frequencyController.getOverdue);
router.get('/upcoming', authorize('ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'), frequencyController.getUpcoming);
router.get('/inspector-workload', authorize('ADMIN', 'SUPERVISOR', 'COMMISSIONER'), frequencyController.getInspectorWorkload);
// Note: Ward-summary bypassed keeping logic scope explicit to generic workload queries based on prompt guidelines.

// Recalculation Engine Call
router.post('/recalculate', authorize('ADMIN'), frequencyController.recalculate);

export default router;
