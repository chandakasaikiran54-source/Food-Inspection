import { Router } from 'express';
import inspectorController from '../controllers/inspector.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createInspectorSchema, updateInspectorSchema, updateInspectorStatusSchema, queryInspectorSchema } from '../validators/inspector.validator.js';

const router = Router();
router.use(authenticate);

// List: Excludes standard inspector (Inspector can only read their own profile, not list all natively)
router.get('/', authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR'), validate(queryInspectorSchema), inspectorController.list);

// Get by ID: Inspector access conditionally handled in controller evaluating email matches.
router.get('/:id', authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'), inspectorController.getById);

// Get Workload metadata
router.get('/:id/workload', authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR'), inspectorController.getWorkload);

// Create
router.post('/', authorize('ADMIN', 'SUPERVISOR'), validate(createInspectorSchema), inspectorController.create);

// Update
router.put('/:id', authorize('ADMIN', 'SUPERVISOR'), validate(updateInspectorSchema), inspectorController.update);

// Update Status (PATCH)
router.patch('/:id/status', authorize('ADMIN', 'SUPERVISOR'), validate(updateInspectorStatusSchema), inspectorController.updateStatus);

// Delete (Strictly Admin logic limits)
router.delete('/:id', authorize('ADMIN'), inspectorController.delete);

export default router;
