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
    try {
        console.log('Connecting to MongoDB Atlas...');

        const conn = await mongoose.connect(env.mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        retryCount = 0;
        console.log('MongoDB Connected Successfully');

        const dbName = conn.connection.name;
        console.log(`Database:\n${dbName}`);

        return conn;
    } catch (err) {
        retryCount++;
        logger.error(`MongoDB connection failed (attempt ${retryCount}): ${err.message}`);

        // Handle specific errors
        if (err.message.includes('Authentication failed') || err.message.includes('bad auth')) {
            logger.error('Invalid Username or Password for MongoDB Atlas.');
        } else if (err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT') || err.name === 'MongooseServerSelectionError') {
            logger.error('Network Failure or MongoDB is Down/Unreachable.');
        }

        if (retryCount < MAX_RETRIES) {
            logger.info(`Retrying Connection in ${RETRY_DELAY / 1000}s…`);
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
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
async function gracefulShutdown(signal) {
    logger.info(`${signal} received – closing MongoDB connection`);
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
