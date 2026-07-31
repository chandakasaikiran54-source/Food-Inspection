import { Router } from 'express';
import inspectionController from '../controllers/inspection.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
    createInspectionSchema,
    updateStatusSchema,
    assignInspectionSchema,
    uploadEvidenceSchema,
    queryInspectionSchema
} from '../validators/inspection.validator.js';

const router = Router();
router.use(authenticate);

// Core CRUD
router.post('/', authorize('ADMIN', 'SUPERVISOR'), validate(createInspectionSchema), inspectionController.create);
router.get('/', authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'), validate(queryInspectionSchema), inspectionController.list);
router.get('/:id', authorize('ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'), inspectionController.getById);

// Workflow Action hooks
router.patch('/:id/status', authorize('ADMIN', 'SUPERVISOR', 'INSPECTOR'), validate(updateStatusSchema), inspectionController.updateStatus);
router.patch('/:id/assign', authorize('ADMIN', 'SUPERVISOR'), validate(assignInspectionSchema), inspectionController.assign);
router.patch('/:id/submit', authorize('ADMIN', 'SUPERVISOR', 'INSPECTOR'), inspectionController.submit);
// Using standard updateStatus API manually mapping roles internally for below hooks alternatively mapping explicit patterns safely 
router.patch('/:id/approve', authorize('ADMIN', 'SUPERVISOR'), (req, res, next) => { req.body.status = 'Approved'; next(); }, inspectionController.updateStatus);
router.patch('/:id/cancel', authorize('ADMIN'), (req, res, next) => { req.body.status = 'Cancelled'; next(); }, inspectionController.updateStatus);

// Evidence Subsystem
router.post('/:id/upload', authorize('ADMIN', 'SUPERVISOR', 'INSPECTOR'), validate(uploadEvidenceSchema), inspectionController.uploadEvidence);
// router.delete('/:id/evidence/:fileId') // Omitting local evidence wipe mapping for brevity standard

export default router;
