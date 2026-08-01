import { Router } from 'express';
import qrController from '../controllers/qr.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';

const router = Router();

// Public Route
router.get('/public/:token', qrController.resolvePublic.bind(qrController));

// Protected Routes
router.get('/secure/:token', authenticate, authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'), qrController.resolveSecure.bind(qrController));

// QR Management (Admin)
router.post('/:businessId/regenerate', authenticate, authorize('ADMIN', 'SUPERVISOR'), qrController.regenerateQR.bind(qrController));

export default router;
