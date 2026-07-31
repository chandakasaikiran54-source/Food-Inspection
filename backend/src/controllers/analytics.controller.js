import analyticsService from '../services/analytics.service.js';
import { successResponse } from '../utils/response.js';

class AnalyticsController {

    async getDashboard(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const data = await analyticsService.getRoleDashboard(req.user, getMeta);
            return successResponse(res, 'Dashboard mapping executed securely', data);
        } catch (err) { next(err); }
    }

    async exportReport(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const { type = 'BUSINESS', format = 'CSV' } = req.query;

            const bufferResult = await analyticsService.generateExport(type.toUpperCase(), format.toUpperCase(), {}, req.user, getMeta);

            if (format.toUpperCase() === 'CSV') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=${type.toLowerCase()}-report-${Date.now()}.csv`);
                return res.status(200).send(bufferResult);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', `attachment; filename=${type.toLowerCase()}-report-${Date.now()}.json`);
                return res.status(200).send(bufferResult);
            }
        } catch (err) { next(err); }
    }
}

export default new AnalyticsController();
