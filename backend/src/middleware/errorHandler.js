/**
 * src/middleware/errorHandler.js
 * Global error handler – catches all thrown errors and responds uniformly.
 */

import { ZodError } from 'zod';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { errorResponse } from '../utils/response.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    logger.error(`[${req.method}] ${req.originalUrl} → ${err.message}`, { stack: err.stack });

    // ─── Zod Validation ────────────────────────────────────────────────────────
    if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
        return errorResponse(res, 'Validation failed', 422, errors);
    }

    // ─── Mongoose Validation ───────────────────────────────────────────────────
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
        return errorResponse(res, 'Database validation failed', 422, errors);
    }

    // ─── Mongoose Cast (invalid ObjectId) ─────────────────────────────────────
    if (err instanceof mongoose.Error.CastError) {
        return errorResponse(res, `Invalid ${err.path}: ${err.value}`, 400);
    }

    // ─── MongoDB Duplicate Key ─────────────────────────────────────────────────
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return errorResponse(res, `${field} already exists`, 409);
    }

    // ─── JWT Errors ────────────────────────────────────────────────────────────
    if (err.name === 'JsonWebTokenError') return errorResponse(res, 'Invalid token', 401);
    if (err.name === 'TokenExpiredError') return errorResponse(res, 'Token expired', 401);

    // ─── Custom app errors (thrown with .status) ───────────────────────────────
    if (err.status) return errorResponse(res, err.message, err.status);

    // ─── Fallback ─────────────────────────────────────────────────────────────
    return errorResponse(res, 'Internal server error', 500);
};

export default errorHandler;
