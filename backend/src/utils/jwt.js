/**
 * src/utils/jwt.js
 * JWT token generation and verification helpers.
 */

import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Sign an access token (short-lived)
 */
export function signAccessToken(payload) {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

/**
 * Sign a refresh token (long-lived)
 */
export function signRefreshToken(payload) {
    return jwt.sign(payload, env.refreshSecret, { expiresIn: env.refreshExpiresIn });
}

/**
 * Verify an access token – throws on invalid/expired
 */
export function verifyAccessToken(token) {
    return jwt.verify(token, env.jwtSecret);
}

/**
 * Verify a refresh token – throws on invalid/expired
 */
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.refreshSecret);
}

/**
 * Cookie options for refresh token
 */
export function getRefreshCookieOptions() {
    return {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
}
