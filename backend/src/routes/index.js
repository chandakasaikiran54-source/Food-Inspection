/**
 * src/routes/index.js
 * Root API router (v1). Registers all feature routers.
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import { getDBStatus } from '../config/db.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import businessRoutes from './business.routes.js';
import inspectorRoutes from './inspector.routes.js';
import wardRoutes from './ward.routes.js';
import inspectionRoutes from './inspection.routes.js';
import violationRoutes from './violation.routes.js';
import frequencyRoutes from './frequency.routes.js';
import analyticsRoutes from './analytics.routes.js';
import alertRoutes from './alert.routes.js';
import qrRoutes from './qr.routes.js';

const router = Router();

// ─── Root Endpoint ─────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Food Safety Inspection Monitoring API',
        application: 'Food Safety Inspection Monitoring System',
        organization: 'Greater Visakhapatnam Municipal Corporation',
        department: 'Public Health Department',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        status: 'Running',
        timestamp: new Date().toISOString()
    });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get('/health', async (req, res) => {
    let mongoStatus = getDBStatus();
    if (mongoStatus === 'connected') {
        try {
            const admin = mongoose.connection.db.admin();
            const buildInfo = await admin.buildInfo();
            mongoStatus = `Connected (v${buildInfo.version})`;
        } catch (e) {
            mongoStatus = 'Connected (version unknown)';
        }
    }

    const healthData = {
        'Application Status': 'Online',
        'MongoDB Status': mongoStatus,
        'Environment': process.env.NODE_ENV || 'development',
        'Application Version': '1.0.0',
        'Timestamp': new Date().toISOString(),
        'Uptime': `${Math.floor(process.uptime())}s`
    };

    res.status(200).json({
        success: true,
        message: 'System Health Check',
        data: healthData
    });
});

// ─── Feature Routers ─────────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/businesses', businessRoutes);
router.use('/inspectors', inspectorRoutes);
router.use('/wards', wardRoutes);
router.use('/inspections', inspectionRoutes);
router.use('/violations', violationRoutes);
router.use('/frequency', frequencyRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/alerts', alertRoutes);
router.use('/qr', qrRoutes);

// Future routers (uncomment when implemented):
// router.use('/reports',     reportRoutes);
// router.use('/alerts',      alertRoutes);
// router.use('/analytics',   analyticsRoutes);

export default router;
