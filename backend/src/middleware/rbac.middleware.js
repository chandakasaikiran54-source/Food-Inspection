/**
 * src/middleware/rbac.middleware.js
 * Role-Based Access Control middleware.
 * Must be applied AFTER authenticate middleware.
 *
 * Usage:
 *   router.get('/users', authenticate, authorize('ADMIN'), userController.list);
 *   router.get('/data',  authenticate, authorize('ADMIN', 'SUPERVISOR'), controller.get);
 */

import { errorResponse } from '../utils/response.js';
import AuditLog from '../models/AuditLog.model.js';
import logger from '../utils/logger.js';

const authorize = (...allowedRoles) => async (req, res, next) => {
    if (!req.user) {
        return errorResponse(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
        // Log unauthorized access attempt
        logger.warn(`Unauthorized access attempt: ${req.user.email} (${req.user.role}) → ${req.method} ${req.originalUrl}`);

        await AuditLog.create({
            userId: req.user._id,
            userEmail: req.user.email,
            userRole: req.user.role,
            action: 'UNAUTHORIZED_ACCESS',
            module: 'AUTH',
            description: `Attempted to access ${req.method} ${req.originalUrl}`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        }).catch(() => { }); // non-blocking

        return errorResponse(
            res,
            `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`,
            403
        );
    }

    next();
};

export default authorize;
