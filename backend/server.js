/**
 * server.js
 * HTTP server entry point.
 * Connects to MongoDB then starts listening.
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import app from './src/app.js';
import { connectDB, gracefulShutdown } from './src/config/db.js';
import schedulerService from './src/services/scheduler.service.js';
import env from './src/config/env.js';
import logger from './src/utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
    console.log('------------------------------------');
    console.log('Connecting to MongoDB Atlas...');
    const dbInfo = await connectDB();
    console.log(`MongoDB Connected Successfully (v${dbInfo.mongoVersion}) in ${dbInfo.connectTime}ms`);
    console.log(`Database:\n${dbInfo.conn?.connection?.name || 'food-inspection-monitor'}`);

    const server = app.listen(env.port, () => {
        const envStr = env.nodeEnv === 'development' ? 'Development' : env.nodeEnv;
        console.log(`\nEnvironment:\n${envStr}\n`);
        console.log('Server Running\n');
        console.log('API Base:');
        console.log(`Bound strictly to Environment Targets\n`);
        console.log('Health Endpoint:');
        console.log(`[API_URL]/health`);
        console.log('------------------------------------');

        if (!env.appUrl) {
            console.warn('⚠️ WARNING: APP_URL is missing in .env! This renders QR scanning completely inactive on mobile networks.');
        } else {
            console.log(`QR Resolution Bound to: ${env.appUrl}`);
            console.log('------------------------------------');
        }

        // Start Background Jobs immediately and setup 24h cron execution
        schedulerService.runDailyJobs();
        setInterval(() => schedulerService.runDailyJobs(), 24 * 60 * 60 * 1000);
    });

    const shutdown = async (signal) => {
        logger.info(`${signal} received. Shutting down gracefully…`);
        server.close(async () => {
            logger.info('HTTP server closed.');
            await gracefulShutdown(signal);
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
