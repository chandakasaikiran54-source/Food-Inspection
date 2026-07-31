/**
 * src/controllers/user.controller.js
 * Thin HTTP handlers for user CRUD routes (Admin only).
 */

import userService from '../services/user.service.js';
import { successResponse, createdResponse, errorResponse, paginatedResponse } from '../utils/response.js';

class UserController {
    async list(req, res, next) {
        try {
            const { data, total } = await userService.listUsers(req.query);
            return paginatedResponse(res, 'Users retrieved', data, {
                page: Number(req.query.page ?? 1),
                limit: Number(req.query.limit ?? 10),
                total,
            });
        } catch (err) { next(err); }
    }

    async getById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            return successResponse(res, 'User retrieved', user);
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            const user = await userService.createUser(req.body, req.user);
            return createdResponse(res, 'User created successfully', user);
        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            const user = await userService.updateUser(req.params.id, req.body, req.user);
            return successResponse(res, 'User updated successfully', user);
        } catch (err) { next(err); }
    }

    async updateStatus(req, res, next) {
        try {
            const user = await userService.updateUserStatus(req.params.id, req.body.status, req.user);
            return successResponse(res, `User ${req.body.status.toLowerCase()} successfully`, user);
        } catch (err) { next(err); }
    }

    async delete(req, res, next) {
        try {
            await userService.deleteUser(req.params.id, req.user);
            return successResponse(res, 'User deleted successfully');
        } catch (err) { next(err); }
    }

    async changePassword(req, res, next) {
        try {
            await userService.changePassword(req.user._id, req.body, { ip: req.ip, userAgent: req.headers['user-agent'] });
            return successResponse(res, 'Password changed successfully');
        } catch (err) { next(err); }
    }

    async getMe(req, res) {
        return successResponse(res, 'Profile retrieved', req.user);
    }
}

export default new UserController();
