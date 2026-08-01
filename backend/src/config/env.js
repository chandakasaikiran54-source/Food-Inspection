/**
 * src/config/env.js
 * Single source of truth for all environment variables.
 */

import dotenv from 'dotenv';
dotenv.config();

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    appName: process.env.APP_NAME || 'Food Inspection Monitor',
    appUrl: process.env.APP_URL,
    apiUrl: process.env.API_URL,
    allowedOrigins: (() => {
        const origins = new Set([
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            process.env.CLIENT_URL,
            process.env.CLIENT_URL_LOCAL,
            process.env.CLIENT_URL_NETWORK
        ]);

        // Auto-normalize: Infer LAN IP out of APP_URL precisely bypassing manual configs
        if (process.env.APP_URL) {
            origins.add(process.env.APP_URL);
            try { origins.add(`http://${new URL(process.env.APP_URL).hostname}:3000`); } catch (e) { }
        }

        // Auto-normalize: Infer LAN IP from API_URL perfectly mirroring Vite's default client boundary
        if (process.env.API_URL) {
            try { origins.add(`http://${new URL(process.env.API_URL).hostname}:3000`); } catch (e) { }
        }

        return Array.from(origins).filter(Boolean);
    })(),

    // MongoDB
    mongoUri: (() => {
        let uri = process.env.MONGO_URI || '';
        if (uri.includes('${DB_USERNAME}') || uri.includes('${DB_PASSWORD}')) {
            const username = process.env.DB_USERNAME || 'USER_NOT_SET';
            const password = process.env.DB_PASSWORD || 'PASS_NOT_SET';
            uri = uri.replace('${DB_USERNAME}', encodeURIComponent(username))
                .replace('${DB_PASSWORD}', encodeURIComponent(password));
        }
        return uri;
    })(),

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'changeme_jwt_secret_min_32_chars',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.REFRESH_SECRET || 'changeme_refresh_secret_min_32_chars',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    // Rate limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

    // Upload
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
    logDir: process.env.LOG_DIR || './logs',
};

export default env;
