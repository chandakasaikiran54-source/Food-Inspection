import businessService from '../services/business.service.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response.js';

class BusinessController {
    async list(req, res, next) {
        try {
            const { data, total } = await businessService.listBusinesses(req.query);
            return paginatedResponse(res, 'Businesses retrieved', data, {
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 10),
                total,
            });
        } catch (err) { next(err); }
    }

    async getById(req, res, next) {
        try {
            const business = await businessService.getBusinessById(req.params.id);
            return successResponse(res, 'Business retrieved', business);
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            const business = await businessService.createBusiness(req.body, req.user, {
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            return createdResponse(res, 'Business created successfully', business);
        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            const business = await businessService.updateBusiness(req.params.id, req.body, req.user, {
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            return successResponse(res, 'Business updated successfully', business);
        } catch (err) { next(err); }
    }

    async delete(req, res, next) {
        try {
            await businessService.deleteBusiness(req.params.id, req.user, {
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            return successResponse(res, 'Business deleted successfully');
        } catch (err) { next(err); }
    }
}

export default new BusinessController();
