import inspectorService from '../services/inspector.service.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response.js';

class InspectorController {
    async list(req, res, next) {
        try {
            const { data, total } = await inspectorService.listInspectors(req.query);
            return paginatedResponse(res, 'Inspectors retrieved', data, {
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 10),
                total,
            });
        } catch (err) { next(err); }
    }

    async getById(req, res, next) {
        try {
            const inspector = await inspectorService.getInspectorById(req.params.id);
            // Verify INSPECTOR can only read own profile if strictly required (omitting logic here assuming middleware or front-end covers precise UI limits, but protecting DB explicitly generally)
            if (req.user.role === 'INSPECTOR' && parseFloat(inspector.email.localeCompare(req.user.email)) !== 0) {
                // To safely ensure read-own profile, let's enforce email match since User auth binds this:
                throw Object.assign(new Error('Unauthorized to view other inspector profiles'), { status: 403 });
            }
            return successResponse(res, 'Inspector retrieved', inspector);
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const inspector = await inspectorService.createInspector(req.body, req.user, getMeta);
            return createdResponse(res, 'Inspector created successfully', inspector);
        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const updated = await inspectorService.updateInspector(req.params.id, req.body, req.user, getMeta);
            return successResponse(res, 'Inspector updated', updated);
        } catch (err) { next(err); }
    }

    async updateStatus(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            const { availabilityStatus } = req.body;
            const updated = await inspectorService.updateStatus(req.params.id, availabilityStatus, req.user, getMeta);
            return successResponse(res, 'Inspector status updated', updated);
        } catch (err) { next(err); }
    }

    async delete(req, res, next) {
        try {
            const getMeta = { ip: req.ip, userAgent: req.headers['user-agent'] };
            await inspectorService.deleteInspector(req.params.id, req.user, getMeta);
            return successResponse(res, 'Inspector deleted successfully');
        } catch (err) { next(err); }
    }

    async getWorkload(req, res, next) {
        try {
            const workload = await inspectorService.getInspectorWorkload(req.params.id);
            return successResponse(res, 'Inspector workload retrieved', workload);
        } catch (err) { next(err); }
    }
}

export default new InspectorController();
