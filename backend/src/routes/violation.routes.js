import { Router } from 'express';
import violationController from '../controllers/violation.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createViolationSchema, updateViolationSchema } from '../validators/violation.validator.js';

const router = Router();
router.use(authenticate);

// Inherits inspection IDs recursively for safe lookup mappings mapping the creation node limits.
router.post('/inspection/:id', authorize('ADMIN', 'SUPERVISOR', 'INSPECTOR'), validate(createViolationSchema), violationController.create);
router.get('/inspection/:id', authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'), violationController.getByInspection);

router.put('/:id', authorize('ADMIN', 'SUPERVISOR', 'INSPECTOR'), validate(updateViolationSchema), violationController.update);
router.delete('/:id', authorize('ADMIN', 'SUPERVISOR'), violationController.delete);

export default router;
