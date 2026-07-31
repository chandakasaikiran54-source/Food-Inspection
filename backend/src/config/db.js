/**
 * src/config/db.js
 * MongoDB Atlas connection with retry logic and graceful shutdown.
 */

import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // ms

let retryCount = 0;

export async function connectDB() {
    const startTime = Date.now();
    try {
        const conn = await mongoose.connect(env.mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        const connectTime = Date.now() - startTime;
        retryCount = 0;

        let mongoVersion = 'unknown';
        try {
            const admin = conn.connection.db.admin();
            const buildInfo = await admin.buildInfo();
            mongoVersion = buildInfo.version;
        } catch (e) {
            // ignore if permissions don't allow buildInfo
        }

        // These listeners will persist after the initial connection
        if (!mongoose.connection.listenerCount('disconnected')) {
            mongoose.connection.on('connected', () => logger.info('MongoDB connected natively.'));
            mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected. Mongoose attempting automatic reconnection...'));
            mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected successfully.'));
            mongoose.connection.on('error', (err) => logger.error(`MongoDB underlying connection error: ${err.message}`));
        }

        return { conn, connectTime, mongoVersion };
    } catch (err) {
        retryCount++;
        const isTransient = err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT') || err.name === 'MongooseServerSelectionError';

        if (isTransient && retryCount < MAX_RETRIES) {
            logger.warn(`MongoDB transient network failure (attempt ${retryCount}): ${err.message}. Retrying...`);
        } else {
            if (err.message.includes('Authentication failed') || err.message.includes('bad auth')) {
                logger.error('Invalid Username or Password for MongoDB Atlas.');
            } else {
                logger.error(`MongoDB connection failed (attempt ${retryCount}): ${err.message}`);
            }
        }

        if (retryCount < MAX_RETRIES) {
            const backoffDelay = Math.min(Math.pow(2, retryCount) * 1000, 30000); // Exponential backoff max 30s
            logger.info(`Retrying Connection in ${backoffDelay / 1000}s…`);
            await new Promise((r) => setTimeout(r, backoffDelay));
            return connectDB();
        }

        logger.error('Max DB connection retries reached. Exiting Process safely.');
        process.exit(1);
    }
}

export function getDBStatus() {
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    return states[mongoose.connection.readyState] ?? 'unknown';
}

// Graceful shutdown
export async function gracefulShutdown(signal) {
    logger.info(`${signal} received – closing MongoDB connection safely`);
    await mongoose.connection.close();
    logger.info('MongoDB connection closed completely');
}
