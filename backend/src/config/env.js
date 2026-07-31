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
    appUrl: process.env.APP_URL || 'http://localhost:5000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

    // MongoDB
    mongoUri: process.env.MONGO_URI || '',

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
