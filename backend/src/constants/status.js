/**
 * src/constants/status.js
 * Shared status constants used across the application.
 * Import from here – never use raw strings for statuses.
 */

export const USER_STATUS = Object.freeze({
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    PENDING: 'PENDING',
});

export const BUSINESS_STATUS = Object.freeze({
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    PENDING_REVIEW: 'PENDING_REVIEW',
});

export const INSPECTION_STATUS = Object.freeze({
    SCHEDULED: 'SCHEDULED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED',
});

export const COMPLIANCE_STATUS = Object.freeze({
    COMPLIANT: 'COMPLIANT',
    NON_COMPLIANT: 'NON_COMPLIANT',
    CONDITIONAL: 'CONDITIONAL',
    UNDER_REVIEW: 'UNDER_REVIEW',
});

export const ALERT_STATUS = Object.freeze({
    OPEN: 'OPEN',
    ACKNOWLEDGED: 'ACKNOWLEDGED',
    RESOLVED: 'RESOLVED',
    ESCALATED: 'ESCALATED',
});
