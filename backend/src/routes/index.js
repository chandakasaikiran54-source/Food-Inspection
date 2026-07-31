/**
 * src/routes/index.js
 * Root API router (v1). Registers all feature routers.
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import { getDBStatus } from '../config/db.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get('/health', async (req, res) => {
    let mongoVersion = 'unknown';
    if (getDBStatus() === 'connected') {
        try {
            const admin = mongoose.connection.db.admin();
            const buildInfo = await admin.buildInfo();
            mongoVersion = buildInfo.version;
        } catch (e) {
            mongoVersion = 'unknown';
        }
    }

    res.status(200).json({
        success: true,
        message: 'Database Connected',
        'Connection State': getDBStatus(),
        'MongoDB Version': mongoVersion,
        'Application Version': 'v1',
        'Environment': process.env.NODE_ENV || 'development'
    });
});

// ─── Feature Routers ─────────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Future routers (uncomment when implemented):
// router.use('/businesses',  businessRoutes);
// router.use('/inspections', inspectionRoutes);
// router.use('/reports',     reportRoutes);
// router.use('/alerts',      alertRoutes);
// router.use('/analytics',   analyticsRoutes);

export default router;
