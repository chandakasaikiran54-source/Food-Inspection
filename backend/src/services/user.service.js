/**
 * src/services/user.service.js
 * User CRUD business logic.
 */

import userRepository from '../repositories/user.repository.js';
import AuditLog from '../models/AuditLog.model.js';
import logger from '../utils/logger.js';

class UserService {
    async listUsers(filters) {
        const { data, total } = await userRepository.findAll(filters);
        return { data, total };
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
        return user;
    }

    async createUser(payload, requestedBy) {
        // Check duplicate email
        const existing = await userRepository.findByEmail(payload.email);
        if (existing) {
            throw Object.assign(new Error('A user with this email already exists'), { status: 409 });
        }

        const user = await userRepository.create({ ...payload, createdBy: requestedBy._id });

        logger.info(`User created: ${user.email} by ${requestedBy.email}`);
        await AuditLog.create({
            userId: requestedBy._id, userEmail: requestedBy.email, userRole: requestedBy.role,
            action: 'USER_CREATED', module: 'USER',
            description: `Created user ${user.email} with role ${user.role}`,
            metadata: { targetUserId: user._id, targetEmail: user.email, role: user.role },
        });

        return user;
    }

    async updateUser(id, payload, requestedBy) {
        const user = await userRepository.findById(id);
        if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

        const updated = await userRepository.updateById(id, payload);

        // Log role changes separately
        if (payload.role && payload.role !== user.role) {
            logger.info(`Role changed: ${user.email} ${user.role} → ${payload.role} by ${requestedBy.email}`);
            await AuditLog.create({
                userId: requestedBy._id, userEmail: requestedBy.email, userRole: requestedBy.role,
                action: 'ROLE_CHANGED', module: 'USER',
                description: `Role changed for ${user.email}: ${user.role} → ${payload.role}`,
                metadata: { targetUserId: id, oldRole: user.role, newRole: payload.role },
            });
        } else {
            await AuditLog.create({
                userId: requestedBy._id, userEmail: requestedBy.email, userRole: requestedBy.role,
                action: 'USER_UPDATED', module: 'USER',
                description: `Updated user ${user.email}`,
                metadata: { targetUserId: id, changes: payload },
            });
        }

        return updated;
    }

    async updateUserStatus(id, status, requestedBy) {
        const user = await userRepository.findById(id);
        if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
        if (user.status === status) {
            throw Object.assign(new Error(`User is already ${status}`), { status: 400 });
        }

        const updated = await userRepository.updateById(id, { status });
        const action = status === 'ACTIVE' ? 'USER_ACTIVATED' : 'USER_DEACTIVATED';
        logger.info(`User ${action}: ${user.email} by ${requestedBy.email}`);
        await AuditLog.create({
            userId: requestedBy._id, userEmail: requestedBy.email, userRole: requestedBy.role,
            action, module: 'USER',
            description: `${user.email} status changed to ${status}`,
            metadata: { targetUserId: id },
        });
        return updated;
    }

    async deleteUser(id, requestedBy) {
        if (String(id) === String(requestedBy._id)) {
            throw Object.assign(new Error('You cannot delete your own account'), { status: 400 });
        }
        const user = await userRepository.findById(id);
        if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

        await userRepository.softDeleteById(id);
        logger.info(`User soft-deleted: ${user.email} by ${requestedBy.email}`);
        await AuditLog.create({
            userId: requestedBy._id, userEmail: requestedBy.email, userRole: requestedBy.role,
            action: 'USER_DELETED', module: 'USER',
            description: `Soft-deleted user ${user.email}`,
            metadata: { targetUserId: id },
        });
    }

    async changePassword(userId, { currentPassword, newPassword }, meta) {
        const user = await userRepository.findById(userId).then((u) =>
            u ? u.constructor.findById(userId).select('+password') : null
        );
        if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) throw Object.assign(new Error('Current password is incorrect'), { status: 400 });

        user.password = newPassword;
        await user.save();

        await AuditLog.create({
            userId: user._id, userEmail: user.email, userRole: user.role,
            action: 'PASSWORD_CHANGED', module: 'USER',
            description: 'User changed their password',
            ipAddress: meta.ip, userAgent: meta.userAgent,
        });
    }
}

export default new UserService();
