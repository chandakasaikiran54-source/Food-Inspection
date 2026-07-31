import { Router } from 'express';
import wardController from '../controllers/ward.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createWardSchema, updateWardSchema, assignInspectorSchema, queryWardSchema } from '../validators/ward.validator.js';

const router = Router();
router.use(authenticate);

router.get('/', authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'), validate(queryWardSchema), wardController.list);
router.get('/:id', authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'), wardController.getById);

router.post('/', authorize('ADMIN', 'SUPERVISOR'), validate(createWardSchema), wardController.create);
router.put('/:id', authorize('ADMIN', 'SUPERVISOR'), validate(updateWardSchema), wardController.update);
router.delete('/:id', authorize('ADMIN'), wardController.delete);

// Assignment Engine Routes
router.post('/:id/assign-inspector', authorize('ADMIN', 'SUPERVISOR'), validate(assignInspectorSchema), wardController.assignInspector);
router.patch('/:id/reassign', authorize('ADMIN', 'SUPERVISOR'), validate(assignInspectorSchema), wardController.reassignInspector);

export default router;
