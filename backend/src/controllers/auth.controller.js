/**
 * src/controllers/auth.controller.js
 * Thin HTTP handlers for auth routes.
 * No business logic – delegates everything to authService.
 */

import authService from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { getRefreshCookieOptions } from '../utils/jwt.js';
import env from '../config/env.js';

class AuthController {
    /**
     * POST /api/v1/auth/login
     */
    async login(req, res, next) {
        try {
            const { accessToken, refreshToken, user } = await authService.login(req.body, {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
            });

            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

            return successResponse(res, 'Login successful', {
                accessToken,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/auth/logout
     */
    async logout(req, res, next) {
        try {
            await authService.logout(req.user._id, {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
            });

            // Clear cookie
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: env.nodeEnv === 'production' });
            return successResponse(res, 'Logged out successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/auth/refresh
     */
    async refresh(req, res, next) {
        try {
            const token = req.cookies?.refreshToken;
            const { accessToken, refreshToken, user } = await authService.refresh(token);

            res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());
            return successResponse(res, 'Token refreshed', {
                accessToken,
                user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/auth/forgot-password  (stub – email service in future phase)
     */
    async forgotPassword(req, res) {
        // Always respond with 200 to prevent email enumeration
        return successResponse(res, 'If that email exists, a reset link has been sent.');
    }

    /**
     * POST /api/v1/auth/reset-password  (stub)
     */
    async resetPassword(req, res) {
        return successResponse(res, 'Password reset functionality will be available soon.');
    }

    /**
     * GET /api/v1/auth/me
     */
    async me(req, res) {
        return successResponse(res, 'Current user', req.user);
    }
}

export default new AuthController();
