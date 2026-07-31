import { Router } from 'express';
import alertController from '../controllers/alert.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';

const router = Router();
router.use(authenticate); // Global Protection

// Metrics & Bulk
router.get('/unread-count', alertController.getUnreadCount);
router.post('/bulk/status', authorize('ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'), alertController.bulkUpdate);

// Individual Alert Operations
router.get('/', alertController.getAlerts);
router.get('/:id', alertController.getAlertById);
router.patch('/:id/status', alertController.updateStatus);

export default router;
