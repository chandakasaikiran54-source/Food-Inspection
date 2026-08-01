import { Router } from 'express';
import businessController from '../controllers/business.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createBusinessSchema, updateBusinessSchema, queryBusinessSchema } from '../validators/business.validator.js';

import qrController from '../controllers/qr.controller.js';

const router = Router();

// ==========================================
// Public Mobile-Ready QR Scanning Endpoint
// ==========================================
// Matches user request: GET /api/v1/businesses/scan/:token
router.get('/scan/:token', qrController.resolvePublic.bind(qrController));

// ==========================================
// Protected Routes
// ==========================================
// All proceeding routes require authentication
router.use(authenticate);

// Get list of businesses (All roles can read)
router.get('/', validate(queryBusinessSchema), businessController.list);

// Get single business (All roles can read)
router.get('/:id', businessController.getById);

// Create business (Admin, Commissioner, Supervisor)
router.post(
    '/',
    authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR'),
    validate(createBusinessSchema),
    businessController.create
);

// Update business (Admin, Commissioner, Supervisor)
router.put(
    '/:id',
    authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR'),
    validate(updateBusinessSchema),
    businessController.update
);

// Delete business (Admin only)
router.delete(
    '/:id',
    authorize('ADMIN'),
    businessController.delete
);

export default router;
