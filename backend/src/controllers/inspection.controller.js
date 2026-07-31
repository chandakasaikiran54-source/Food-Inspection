import inspectionService from '../services/inspection.service.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response.js';

class InspectionController {
    async list(req, res, next) {
        try {
            const { data, total } = await inspectionService.listInspectors(req.query);
            return paginatedResponse(res, 'Inspections retrieved', data, {
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 10),
                total,
            });
        } catch (err) { next(err); }
    }

    async getById(req, res, next) {
        try {
            const inspection = await inspectionService.getInspectionById(req.params.id);
            return successResponse(res, 'Inspection loaded', inspection);
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const inspection = await inspectionService.createInspection(req.body, req.user, getMeta);
            return createdResponse(res, 'Inspection structurally mapped successfully', inspection);
        } catch (err) { next(err); }
    }

    async updateStatus(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const { status } = req.body;
            const updated = await inspectionService.updateStatus(req.params.id, status, req.user, getMeta);
            return successResponse(res, `Inspection state moved to ${status}`, updated);
        } catch (err) { next(err); }
    }

    async assign(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const { inspectorId } = req.body;
            const updated = await inspectionService.assignInspector(req.params.id, inspectorId, req.user, getMeta);
            return successResponse(res, 'Inspector explicitly linked onto Inspection target', updated);
        } catch (err) { next(err); }
    }

    async submit(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const submitted = await inspectionService.submitInspection(req.params.id, req.user, getMeta);
            return successResponse(res, 'Inspection finalized and submitted cleanly mapping statistics accurately', submitted);
        } catch (err) { next(err); }
    }

    async uploadEvidence(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const { category, originalName, mimeType, size } = req.body;
            const evidence = await inspectionService.uploadEvidence(req.params.id, category, { originalName, mimeType, size }, req.user, getMeta);
            return successResponse(res, 'Evidence mock mapping accurately appended retaining UUID links safely', evidence);
        } catch (err) { next(err); }
    }
}

export default new InspectionController();
