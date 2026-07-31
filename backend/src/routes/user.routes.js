/**
 * src/routes/user.routes.js
 * User CRUD endpoints. All protected by authentication + RBAC.
 *
 * Route       Method   Roles            Description
 * /users       GET      ADMIN            List users (search, filter, paginate)
 * /users/:id   GET      ADMIN            Get single user
 * /users       POST     ADMIN            Create user
 * /users/:id   PUT      ADMIN            Update user
 * /users/:id/status PATCH ADMIN         Change user status
 * /users/:id   DELETE   ADMIN            Soft-delete user
 * /users/me    GET      All              Own profile
 * /users/me/password PATCH All          Change own password
 */

import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
    createUserSchema,
    updateUserSchema,
    updateStatusSchema,
    listUsersSchema,
} from '../validators/user.validator.js';
import { changePasswordSchema } from '../validators/auth.validator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Own-profile routes (any authenticated role)
router.get('/me', userController.getMe.bind(userController));
router.patch('/me/password', validate(changePasswordSchema), userController.changePassword.bind(userController));

// Admin-only routes
router.get('/', authorize('ADMIN'), validate(listUsersSchema, 'query'), userController.list.bind(userController));
router.post('/', authorize('ADMIN'), validate(createUserSchema), userController.create.bind(userController));
router.get('/:id', authorize('ADMIN'), userController.getById.bind(userController));
router.put('/:id', authorize('ADMIN'), validate(updateUserSchema), userController.update.bind(userController));
router.patch('/:id/status', authorize('ADMIN'), validate(updateStatusSchema), userController.updateStatus.bind(userController));
router.delete('/:id', authorize('ADMIN'), userController.delete.bind(userController));

export default router;
