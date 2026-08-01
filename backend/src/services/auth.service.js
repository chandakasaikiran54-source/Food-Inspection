/**
 * src/services/auth.service.js
 * Authentication business logic.
 * Controllers call services; services call repositories.
 */

import userRepository from '../repositories/user.repository.js';
import FoodBusiness from '../models/FoodBusiness.model.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshCookieOptions } from '../utils/jwt.js';
import { generateSecureQR } from '../utils/qrHelper.js';
import AuditLog from '../models/AuditLog.model.js';
import logger from '../utils/logger.js';

class AuthService {
    /**
     * Signup – registers a new user organically validating rules explicitly
     */
    async signup(payload, { ip, userAgent }) {
        const { email, password, fullName, role, phone, department, alternatePhone, govIdType, govIdNumber, foodBusinessName, foodBusinessLicenseNumber, businessType, shopNumber, streetArea, villageLocality, mandal, district, state, pincode, landmark, latitude, longitude, gstNumber, fssaiLicenseNumber, tradeLicense, businessOpeningDate, numberOfEmployees } = payload;

        // Ensure email isn't duplicated
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            await this._auditFailed(null, email, 'SIGNUP_FAILED', ip, userAgent, 'Email already exists');
            throw Object.assign(new Error('Email is already registered'), { status: 409 });
        }

        if (role === 'BUSINESS') {
            const existingBusiness = await FoodBusiness.findOne({ $or: [{ licenseNumber: foodBusinessLicenseNumber }, { phone }] });
            if (existingBusiness) {
                await this._auditFailed(null, email, 'SIGNUP_FAILED', ip, userAgent, 'Duplicate Business phone or license');
                throw Object.assign(new Error('A business with this phone or license number already exists'), { status: 409 });
            }
        }

        // Create the user organically
        let user;
        try {
            user = await userRepository.create({
                fullName, email, password, role, phone, department, alternatePhone, govIdType, govIdNumber
            });
        } catch (dbErr) {
            console.error('------- DATABASE SAVE ERROR -------');
            console.error(dbErr);
            throw Object.assign(new Error('Database validation failed: ' + dbErr.message), { status: 400 });
        }

        if (role === 'BUSINESS') {
            let business;
            try {
                business = await FoodBusiness.create({
                    businessName: foodBusinessName,
                    licenseNumber: foodBusinessLicenseNumber,
                    businessType,
                    foodCategory: 'General',
                    ownerName: fullName,
                    phone,
                    email,
                    ownerId: user._id,
                    shopNumber, streetArea, villageLocality, mandal, district, state, pincode, landmark,
                    latitude, longitude, gstNumber, fssaiLicenseNumber, tradeLicense, businessOpeningDate, numberOfEmployees,
                    createdBy: user._id
                });
            } catch (dbErr) {
                console.error('------- BUSINESS SAVE ERROR -------');
                console.error(dbErr);
                throw Object.assign(new Error('Business Database validation failed: ' + dbErr.message), { status: 400 });
            }

            try {
                const qrData = await generateSecureQR(business._id);
                business.qrToken = qrData.qrToken;
                business.qrImage = qrData.qrImage;
                business.generatedAt = new Date();
                await business.save();

                await AuditLog.create({
                    userId: user._id, userEmail: email, userRole: role,
                    action: 'QR_GENERATED', module: 'BUSINESS', description: 'Initial QR code minted',
                    metadata: { businessId: business._id },
                    ipAddress: ip, userAgent
                });
            } catch (err) {
                logger.error('Failed to generate initial QR', err);
            }

            user.businessId = business._id;
            await user.save({ validateBeforeSave: false }); // Skip validation properly since it's already validated
        }

        logger.info(`New user signed up: ${email} (${role})`);
        await AuditLog.create({
            userId: user._id, userEmail: email, userRole: role,
            action: 'USER_CREATED', module: 'AUTH', description: 'User registration successful',
            ipAddress: ip, userAgent,
        });

        const tokenPayload = { id: user._id, role: user.role, email: user.email };
        const accessToken = signAccessToken(tokenPayload);
        const refreshToken = signRefreshToken({ id: user._id });

        await userRepository.updateRefreshToken(user._id, refreshToken);
        await userRepository.updateLastLogin(user._id);

        return { accessToken, refreshToken, user };
    }

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
        logger.info(`User logged out: ${user?.email} `);
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

    async forgotPassword(email, meta) {
        const user = await userRepository.findByEmail(email).then((u) =>
            u ? u.constructor.findByEmail(email) : null
        );

        if (!user) {
            // Silently complete to prevent email enumeration effectively safely correctly!
            logger.warn(`Password reset requested for unknown email: ${email} `);
            return;
        }

        const resetToken = await user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // Future phase: Email Dispatcher integration natively securely here
        const resetURL = `${env.frontendUrl || 'http://localhost:3000'} /reset-password/${resetToken} `;
        logger.info(`Secure Reset Token Generated for ${user.email}.Link: ${resetURL} `);

        await AuditLog.create({
            userId: user._id, userEmail: user.email, userRole: user.role,
            action: 'PASSWORD_RESET_REQUESTED', module: 'AUTH',
            description: 'Password reset email triggered',
            ipAddress: meta.ip, userAgent: meta.userAgent,
        });
    }

    async resetPassword(token, newPassword, meta) {
        const crypto = await import('crypto');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Dynamically locate user via mongoose tracking native schema models gracefully!
        const user = await userRepository.findByPasswordResetToken(hashedToken);

        if (!user) {
            throw Object.assign(new Error('Token is invalid or has expired'), { status: 400 });
        }

        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save(); // pre-save hook handles hashing the new password gracefully

        // Invalidate old refresh tokens forcing a fresh session cleanly dynamically
        await userRepository.updateRefreshToken(user._id, null);

        logger.info(`Password successfully reset for ${user.email}`);

        await AuditLog.create({
            userId: user._id, userEmail: user.email, userRole: user.role,
            action: 'PASSWORD_RESET_COMPLETED', module: 'AUTH',
            description: 'Password reset successfully executed',
            ipAddress: meta.ip, userAgent: meta.userAgent,
        });
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
