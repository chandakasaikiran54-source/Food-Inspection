/**
 * src/models/AuditLog.model.js
 * Stores security and action audit logs.
 */

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        userEmail: { type: String, default: null },
        userRole: { type: String, default: null },
        action: {
            type: String,
            required: true,
            enum: [
                'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
                'TOKEN_REFRESH',
                'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'USER_ACTIVATED', 'USER_DEACTIVATED',
                'PASSWORD_CHANGED', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET_COMPLETED',
                'ROLE_CHANGED',
                'UNAUTHORIZED_ACCESS',
                'BUSINESS_CREATED', 'BUSINESS_UPDATED', 'BUSINESS_DELETED',
                'INSPECTOR_CREATED', 'INSPECTOR_UPDATED', 'INSPECTOR_DELETED', 'INSPECTOR_STATUS_CHANGED',
                'WARD_CREATED', 'WARD_UPDATED', 'WARD_DELETED', 'WARD_ASSIGNED', 'WARD_REASSIGNED',
                'INSPECTION_CREATED', 'INSPECTION_ASSIGNED', 'INSPECTION_STARTED', 'INSPECTION_EVIDENCE_UPLOADED', 'INSPECTION_VIOLATION_ADDED', 'INSPECTION_SUBMITTED', 'INSPECTION_REVIEWED', 'INSPECTION_APPROVED', 'INSPECTION_CANCELLED', 'INSPECTION_DELETED',
                'FREQUENCY_RULE_UPDATED', 'RECALCULATION_STARTED', 'RECALCULATION_COMPLETED', 'SCHEDULER_EXECUTED', 'ALERT_GENERATED',
                'ALERT_CREATED', 'ALERT_VIEWED', 'ALERT_READ', 'ALERT_ACKNOWLEDGED', 'ALERT_RESOLVED', 'ALERT_ARCHIVED', 'BULK_OPERATIONS',
                'REPORT_GENERATED', 'REPORT_EXPORTED', 'DASHBOARD_VIEWED', 'ANALYTICS_VIEWED'
            ],
        },
        module: {
            type: String,
            enum: ['AUTH', 'USER', 'INSPECTION', 'BUSINESS', 'REPORT', 'ALERT', 'INSPECTOR', 'WARD', 'FREQUENCY', 'SYSTEM', 'ANALYTICS'],
            default: 'AUTH',
        },
        description: { type: String, default: '' },
        ipAddress: { type: String, default: null },
        userAgent: { type: String, default: null },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true, transform: (d, r) => { delete r.__v; return r; } },
    }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
