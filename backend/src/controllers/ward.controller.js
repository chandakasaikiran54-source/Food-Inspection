import wardService from '../services/ward.service.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response.js';

class WardController {
    async list(req, res, next) {
        try {
            const { data, total } = await wardService.listWards(req.query);
            return paginatedResponse(res, 'Wards retrieved', data, {
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 10),
                total,
            });
        } catch (err) { next(err); }
    }

    async getById(req, res, next) {
        try {
            const ward = await wardService.getWardById(req.params.id);
            return successResponse(res, 'Ward retrieved', ward);
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const ward = await wardService.createWard(req.body, req.user, getMeta);
            return createdResponse(res, 'Ward created successfully', ward);
        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const updated = await wardService.updateWard(req.params.id, req.body, req.user, getMeta);
            return successResponse(res, 'Ward updated', updated);
        } catch (err) { next(err); }
    }

    async delete(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            await wardService.deleteWard(req.params.id, req.user, getMeta);
            return successResponse(res, 'Ward deleted successfully');
        } catch (err) { next(err); }
    }

    async assignInspector(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const { inspectorId } = req.body;
            const updatedWard = await wardService.assignInspector(req.params.id, inspectorId, req.user, getMeta);
            return successResponse(res, 'Inspector successfully assigned', updatedWard);
        } catch (err) { next(err); }
    }

    async reassignInspector(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const { inspectorId } = req.body;
            const updatedWard = await wardService.reassignInspector(req.params.id, inspectorId, req.user, getMeta);
            return successResponse(res, 'Inspector successfully reassigned', updatedWard);
        } catch (err) { next(err); }
    }
}

export default new WardController();
