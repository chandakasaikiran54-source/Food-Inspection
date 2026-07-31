import violationService from '../services/violation.service.js';
import { successResponse, createdResponse } from '../utils/response.js';

class ViolationController {
    async create(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const violation = await violationService.addViolation(req.params.id, req.body, req.user, getMeta);
            return createdResponse(res, 'Violation safely recorded', violation);
        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const updated = await violationService.updateViolation(req.params.id, req.body, req.user, getMeta);
            return successResponse(res, 'Violation data updated', updated);
        } catch (err) { next(err); }
    }

    async getByInspection(req, res, next) {
        try {
            const violations = await violationService.getViolationsForInspection(req.params.id);
            return successResponse(res, 'Violations retrieved', violations);
        } catch (err) { next(err); }
    }

    async delete(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            await violationService.deleteViolation(req.params.id, req.user, getMeta);
            return successResponse(res, 'Violation securely purged');
        } catch (err) { next(err); }
    }
}

export default new ViolationController();
