/**
 * src/utils/logger.js
 * Winston logger – writes to console + daily rotating log files.
 */

import { createLogger, format, transports } from 'winston';
import env from '../config/env.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.resolve(__dirname, '../../logs');

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return stack
        ? `[${timestamp}] ${level}: ${message}\n${stack}`
        : `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
    level: env.logLevel || 'info',
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        // Console (coloured in dev)
        new transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'HH:mm:ss' }),
                logFormat,
            ),
        }),
        // Error log file
        new transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024, // 5 MB
            maxFiles: 5,
        }),
        // Combined log file
        new transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 10,
        }),
    ],
});

export default logger;
