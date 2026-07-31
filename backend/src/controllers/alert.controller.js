import alertService from '../services/alert.service.js';
import { successResponse } from '../utils/response.js';

class AlertController {

    async getAlerts(req, res, next) {
        try {
            const { page = 1, limit = 50, ...filters } = req.query;
            const skip = (page - 1) * limit;
            const data = await alertService.getAlerts(filters, skip, Number(limit), req.user, { ip: req.ip });
            return successResponse(res, 'Alerts fetched successfully', data);
        } catch (err) { next(err); }
    }

    async getAlertById(req, res, next) {
        try {
            const data = await alertService.getAlertById(req.params.id, req.user);
            return successResponse(res, 'Alert details loaded', data);
        } catch (err) { next(err); }
    }

    async updateStatus(req, res, next) {
        try {
            const { status } = req.body; // READ, UNREAD, ACKNOWLEDGED, RESOLVED, ARCHIVED, DELETED
            const { id } = req.params;
            const updated = await alertService.updateAlertStatus(id, status.toUpperCase(), req.user, { ip: req.ip });
            return successResponse(res, `Alert marked as ${status}`, updated);
        } catch (err) { next(err); }
    }

    async bulkUpdate(req, res, next) {
        try {
            const { alertIds, status } = req.body;
            const result = await alertService.bulkUpdate(alertIds, status.toUpperCase(), req.user, { ip: req.ip });
            return successResponse(res, `Bulk process completed`, result);
        } catch (err) { next(err); }
    }

    async getUnreadCount(req, res, next) {
        try {
            const count = await alertService.getUnreadCount(req.user);
            return successResponse(res, 'Unread alert count fetched', { count });
        } catch (err) { next(err); }
    }
}

export default new AlertController();
