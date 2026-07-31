/**
 * src/middleware/auth.middleware.js
 * Verifies the JWT access token on protected routes.
 * Attaches req.user on success.
 */

import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.model.js';
import { errorResponse } from '../utils/response.js';

const authenticate = async (req, res, next) => {
    try {
        // Extract token from Authorization header or cookie
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return errorResponse(res, 'Authentication required. Please log in.', 401);
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        // Check user still exists and is active
        const user = await User.findById(decoded.id).select('+status +deletedAt');
        if (!user || user.deletedAt) {
            return errorResponse(res, 'User account not found.', 401);
        }
        if (user.status !== 'ACTIVE') {
            return errorResponse(res, 'Your account has been deactivated. Contact an administrator.', 403);
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return errorResponse(res, 'Session expired. Please log in again.', 401);
        }
        if (err.name === 'JsonWebTokenError') {
            return errorResponse(res, 'Invalid authentication token.', 401);
        }
        next(err);
    }
};

export default authenticate;
