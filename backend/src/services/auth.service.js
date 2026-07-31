/**
 * src/services/auth.service.js
 * Authentication business logic.
 * Controllers call services; services call repositories.
 */

import userRepository from '../repositories/user.repository.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshCookieOptions } from '../utils/jwt.js';
import AuditLog from '../models/AuditLog.model.js';
import logger from '../utils/logger.js';

class AuthService {
    /**
     * Login – validates credentials, issues access + refresh tokens
     */
    async login({ email, password }, { ip, userAgent }) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            await this._auditFailed(null, email, 'LOGIN_FAILED', ip, userAgent, 'User not found');
            throw Object.assign(new Error('Invalid email or password'), { status: 401 });
        }

        if (user.status !== 'ACTIVE' || user.deletedAt) {
            await this._auditFailed(user._id, email, 'LOGIN_FAILED', ip, userAgent, 'Account inactive');
            throw Object.assign(new Error('Your account is inactive. Contact an administrator.'), { status: 403 });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await this._auditFailed(user._id, email, 'LOGIN_FAILED', ip, userAgent, 'Wrong password');
            throw Object.assign(new Error('Invalid email or password'), { status: 401 });
        }

        const tokenPayload = { id: user._id, role: user.role, email: user.email };
        const accessToken = signAccessToken(tokenPayload);
        const refreshToken = signRefreshToken({ id: user._id });

        await userRepository.updateRefreshToken(user._id, refreshToken);
        await userRepository.updateLastLogin(user._id);

        logger.info(`User logged in: ${email} (${user.role})`);
        await AuditLog.create({
            userId: user._id, userEmail: email, userRole: user.role,
            action: 'LOGIN', module: 'AUTH', description: 'Successful login',
            ipAddress: ip, userAgent,
        });

        return { accessToken, refreshToken, user };
    }

    /**
     * Logout – clear refresh token from DB
     */
    async logout(userId, { ip, userAgent }) {
        const user = await userRepository.findById(userId);
        await userRepository.updateRefreshToken(userId, null);
        logger.info(`User logged out: ${user?.email}`);
        await AuditLog.create({
            userId, userEmail: user?.email, userRole: user?.role,
            action: 'LOGOUT', module: 'AUTH', description: 'User logged out',
            ipAddress: ip, userAgent,
        });
    }

    /**
     * Refresh – rotate tokens using the refresh token cookie
     */
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw Object.assign(new Error('Refresh token required'), { status: 401 });
        }

        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch {
            throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
        }

        const user = await userRepository.findByRefreshToken(refreshToken);
        if (!user || String(user._id) !== decoded.id) {
            throw Object.assign(new Error('Token mismatch. Please log in again.'), { status: 401 });
        }

        const tokenPayload = { id: user._id, role: user.role, email: user.email };
        const newAccess = signAccessToken(tokenPayload);
        const newRefresh = signRefreshToken({ id: user._id });

        await userRepository.updateRefreshToken(user._id, newRefresh);

        await AuditLog.create({
            userId: user._id, userEmail: user.email, userRole: user.role,
            action: 'TOKEN_REFRESH', module: 'AUTH', description: 'Access token refreshed',
        });

        return { accessToken: newAccess, refreshToken: newRefresh, user };
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    _auditFailed(userId, email, action, ip, userAgent, desc) {
        return AuditLog.create({
            userId: userId || null,
            userEmail: email, action, module: 'AUTH',
            description: desc, ipAddress: ip, userAgent,
        }).catch(() => { });
    }
}

export default new AuthService();
