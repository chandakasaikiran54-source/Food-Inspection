/**
 * src/middleware/logger.js
 * Morgan-style request logger middleware using Winston.
 */

import logger from '../utils/logger.js';

const httpLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        const msg = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms – ${req.ip}`;
        if (res.statusCode >= 500) logger.error(msg);
        else if (res.statusCode >= 400) logger.warn(msg);
        else logger.info(msg);
    });
    next();
};

export default httpLogger;
