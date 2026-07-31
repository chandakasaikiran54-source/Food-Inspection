import frequencyService from '../services/frequency.service.js';
import { successResponse } from '../utils/response.js';

class FrequencyController {

    async getRules(req, res, next) {
        try {
            const rules = await frequencyService.getRules();
            return successResponse(res, 'Frequency Rules loaded', rules);
        } catch (err) { next(err); }
    }

    async updateRule(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const { riskCategory, intervalDays } = req.body;
            const updated = await frequencyService.updateRule(riskCategory, intervalDays, req.user, getMeta);
            return successResponse(res, 'Configurable rule applied successfully natively.', updated);
        } catch (err) { next(err); }
    }

    async getDashboardMetrics(req, res, next) {
        try {
            const metrics = await frequencyService.getDashboardMetrics(req.user);
            return successResponse(res, 'Live dashboard Analytics mapping computed correctly.', metrics);
        } catch (err) { next(err); }
    }

    async getOverdue(req, res, next) {
        try {
            const list = await frequencyService.getOverdueInspections();
            return successResponse(res, 'Overdue bounds fetched successfully.', list);
        } catch (err) { next(err); }
    }

    async getUpcoming(req, res, next) {
        try {
            const list = await frequencyService.getUpcoming(Number(req.query.days) || 15);
            return successResponse(res, 'Upcoming array mapped securely.', list);
        } catch (err) { next(err); }
    }

    async getInspectorWorkload(req, res, next) {
        try {
            const workload = await frequencyService.getInspectorWorkload();
            return successResponse(res, 'Workload maps loaded seamlessly.', workload);
        } catch (err) { next(err); }
    }

    async recalculate(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const result = await frequencyService.triggerRecalculation(req.user, getMeta);
            return successResponse(res, 'Automated global recalculation invoked synchronously.', result);
        } catch (err) { next(err); }
    }
}

export default new FrequencyController();
