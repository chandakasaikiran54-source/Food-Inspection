/**
 * server.js
 * HTTP server entry point.
 * Connects to MongoDB then starts listening.
 */

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import env from './src/config/env.js';
import logger from './src/utils/logger.js';

async function startServer() {
    // Connect to MongoDB Atlas first
    await connectDB();

    const server = app.listen(env.port, () => {
        logger.info(`\n🚀 Server running in ${env.nodeEnv} mode on port ${env.port}`);
        logger.info(`📡 API base: http://localhost:${env.port}/api/v1`);
        logger.info(`❤️  Health:  http://localhost:${env.port}/api/v1/health\n`);
    });

    const shutdown = async (signal) => {
        logger.info(`${signal} received. Shutting down gracefully…`);
        server.close(() => {
            logger.info('HTTP server closed.');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (err) => {
        logger.error('UNHANDLED REJECTION:', err);
        server.close(() => process.exit(1));
    });
}

startServer();
