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
            ],
        },
        module: {
            type: String,
            enum: ['AUTH', 'USER', 'INSPECTION', 'BUSINESS', 'REPORT', 'ALERT'],
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
