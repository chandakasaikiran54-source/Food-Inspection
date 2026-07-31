/**
 * src/repositories/user.repository.js
 * All MongoDB queries for the User collection.
 * No business logic – only data access.
 */

import User from '../models/User.model.js';

export class UserRepository {
    /**
     * Find a user by email (includes password + refreshToken for auth)
     */
    findByEmail(email) {
        return User.findOne({ email: email.toLowerCase(), deletedAt: null })
            .select('+password +refreshToken');
    }

    /**
     * Find a user by ID
     */
    findById(id) {
        return User.findOne({ _id: id, deletedAt: null });
    }

    /**
     * Find with pagination, search, and filters
     */
    async findAll({ page = 1, limit = 10, role, status, search, sortBy = 'createdAt', order = 'desc' } = {}) {
        const filter = { deletedAt: null };
        if (role) filter.role = role;
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;
        const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

        const [data, total] = await Promise.all([
            User.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            User.countDocuments(filter),
        ]);

        return { data, total };
    }

    /**
     * Create a new user
     */
    create(payload) {
        return User.create(payload);
    }

    /**
     * Update a user by ID
     */
    updateById(id, payload) {
        return User.findOneAndUpdate(
            { _id: id, deletedAt: null },
            payload,
            { new: true, runValidators: true }
        );
    }

    /**
     * Soft-delete a user
     */
    softDeleteById(id) {
        return User.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: new Date() },
            { new: true }
        );
    }

    /**
     * Update refresh token
     */
    updateRefreshToken(id, token) {
        return User.findByIdAndUpdate(id, { refreshToken: token }, { new: true });
    }

    /**
     * Update last login timestamp
     */
    updateLastLogin(id) {
        return User.findByIdAndUpdate(id, { lastLogin: new Date() });
    }

    /**
     * Find by refresh token (for token rotation)
     */
    findByRefreshToken(token) {
        return User.findOne({ refreshToken: token, deletedAt: null }).select('+refreshToken');
    }

    /**
     * Find by password reset token
     */
    findByPasswordResetToken(hashedToken) {
        return User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
            deletedAt: null
        });
    }
}

export default new UserRepository();
