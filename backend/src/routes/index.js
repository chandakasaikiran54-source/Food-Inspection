/**
 * src/routes/index.js
 * Root API router (v1). Registers all feature routers.
 */

import { Router } from 'express';
import { getDBStatus } from '../config/db.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Food Inspection API is running',
        version: 'v1',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: getDBStatus(),
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
