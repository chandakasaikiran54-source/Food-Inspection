import alertRepository from '../repositories/alert.repository.js';
import notificationAdapter from './adapters/NotificationAdapter.js';
import AuditLog from '../models/AuditLog.model.js';

class AlertService {

    _buildRbacContext(user) {
        if (user.role === 'ADMIN') return {};
        if (user.role === 'INSPECTOR') return { inspector: user._id };
        // If supervisor, ideally restrict to their Wards. For generic DB limits, we map basic access checks.
        // Assuming supervisors can see general alerts or we map Wards natively.
        return {};
    }

    async getAlerts(filters, skip, limit, user, meta = {}) {
        filters.rbacContext = this._buildRbacContext(user);
        return alertRepository.queryAlerts(filters, skip, limit);
    }

    async getAlertById(id, user) {
        const alert = await alertRepository.getAlertById(id);
        if (!alert) throw Object.assign(new Error('Alert not found'), { status: 404 });

        // basic RBAC
        if (user.role === 'INSPECTOR' && String(alert.inspector?._id) !== String(user._id)) {
            throw Object.assign(new Error('Unauthorized access to Alert'), { status: 403 });
        }

        return alert;
    }

    async updateAlertStatus(id, newStatus, user, meta = {}) {
        const alert = await this.getAlertById(id, user); // verifies existence & RBAC

        const updated = await alertRepository.updateStatus(id, newStatus);

        await AuditLog.create({
            userId: user._id,
            action: `ALERT_${newStatus}`, module: 'ALERT',
            description: `Alert marked as ${newStatus}`,
            metadata: { alertId: id },
            ipAddress: meta.ip
        });

        return updated;
    }

    async bulkUpdate(ids, newStatus, user, meta = {}) {
        const validDocs = await alertRepository.bulkUpdateStatus(ids, newStatus);

        await AuditLog.create({
            userId: user._id,
            action: 'BULK_OPERATIONS', module: 'ALERT',
            description: `Bulk marked ${ids.length} alerts as ${newStatus}`,
            ipAddress: meta.ip
        });

        return { success: true, matchedCount: ids.length }; // Simplified for abstract counts
    }

    async getUnreadCount(user) {
        const rbacContext = this._buildRbacContext(user);
        return alertRepository.getUnreadCount(rbacContext);
    }

    // This hook is used internally by Frequency Scheduler (Phase 7 expansion)
    async triggerNotificationDispatch(alert) {
        if (alert.priority === 'Critical') {
            // Example future integration point
            await notificationAdapter.sendEmail('admin@gvmc.gov', 'CRITICAL ALERT', alert.message);
        }
    }
}

export default new AlertService();
