import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';

const router = Router();
router.use(authenticate); // Global Protection

// Dashboard Data
router.get('/dashboard', authorize('ADMIN', 'SUPERVISOR', 'COMMISSIONER', 'INSPECTOR'), analyticsController.getDashboard);

// Exports
router.get('/export', authorize('ADMIN', 'SUPERVISOR', 'COMMISSIONER'), analyticsController.exportReport);

export default router;
