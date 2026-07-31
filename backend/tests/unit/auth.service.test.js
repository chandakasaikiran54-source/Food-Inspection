/**
 * tests/unit/auth.service.test.js
 * Unit tests for AuthService (login, logout, refresh).
 * Run: npm test
 */

import { jest } from '@jest/globals';

// ─── Mocks (define BEFORE imports that use them) ─────────────────────────────
jest.mock('../../src/repositories/user.repository.js', () => ({
    default: {
        findByEmail: jest.fn(),
        findById: jest.fn(),
        findByRefreshToken: jest.fn(),
        updateRefreshToken: jest.fn(),
        updateLastLogin: jest.fn(),
    },
}));

jest.mock('../../src/models/AuditLog.model.js', () => ({
    default: { create: jest.fn().mockResolvedValue({}) },
}));

jest.mock('../../src/utils/logger.js', () => ({
    default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock('../../src/utils/jwt.js', () => ({
    signAccessToken: jest.fn(() => 'mock_access_token'),
    signRefreshToken: jest.fn(() => 'mock_refresh_token'),
    verifyRefreshToken: jest.fn(() => ({ id: 'user123' })),
}));

import userRepository from '../../src/repositories/user.repository.js';
import authService from '../../src/services/auth.service.js';

// ─── Shared mock user ─────────────────────────────────────────────────────────
const mockUser = {
    _id: 'user123',
    fullName: 'Admin User',
    email: 'admin@test.gov',
    role: 'ADMIN',
    status: 'ACTIVE',
    deletedAt: null,
    comparePassword: jest.fn(),
};

const meta = { ip: '127.0.0.1', userAgent: 'jest-test' };

describe('AuthService', () => {
    beforeEach(() => jest.clearAllMocks());

    // ─── Login ──────────────────────────────────────────────────────────────────
    describe('login()', () => {
        it('should return tokens when credentials are valid', async () => {
            userRepository.findByEmail.mockResolvedValue({ ...mockUser, comparePassword: jest.fn().mockResolvedValue(true) });
            userRepository.updateRefreshToken.mockResolvedValue({});
            userRepository.updateLastLogin.mockResolvedValue({});

            const result = await authService.login({ email: 'admin@test.gov', password: 'Password1' }, meta);

            expect(result.accessToken).toBe('mock_access_token');
            expect(result.refreshToken).toBe('mock_refresh_token');
            expect(result.user.email).toBe('admin@test.gov');
        });

        it('should throw 401 when user not found', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            await expect(
                authService.login({ email: 'nobody@test.gov', password: 'anything' }, meta)
            ).rejects.toMatchObject({ status: 401, message: expect.stringContaining('Invalid') });
        });

        it('should throw 401 when password is wrong', async () => {
            userRepository.findByEmail.mockResolvedValue({ ...mockUser, comparePassword: jest.fn().mockResolvedValue(false) });
            await expect(
                authService.login({ email: 'admin@test.gov', password: 'WrongPass' }, meta)
            ).rejects.toMatchObject({ status: 401 });
        });

        it('should throw 403 when account is inactive', async () => {
            userRepository.findByEmail.mockResolvedValue({
                ...mockUser,
                status: 'INACTIVE',
                comparePassword: jest.fn().mockResolvedValue(true),
            });
            await expect(
                authService.login({ email: 'admin@test.gov', password: 'Password1' }, meta)
            ).rejects.toMatchObject({ status: 403 });
        });
    });

    // ─── Logout ─────────────────────────────────────────────────────────────────
    describe('logout()', () => {
        it('should clear the refresh token', async () => {
            userRepository.findById.mockResolvedValue(mockUser);
            userRepository.updateRefreshToken.mockResolvedValue({});

            await authService.logout('user123', meta);

            expect(userRepository.updateRefreshToken).toHaveBeenCalledWith('user123', null);
        });
    });

    // ─── Refresh ─────────────────────────────────────────────────────────────────
    describe('refresh()', () => {
        it('should rotate tokens when refresh token is valid', async () => {
            userRepository.findByRefreshToken.mockResolvedValue({ ...mockUser, _id: { toString: () => 'user123' } });
            userRepository.updateRefreshToken.mockResolvedValue({});

            const result = await authService.refresh('valid_refresh_token');
            expect(result.accessToken).toBe('mock_access_token');
            expect(result.refreshToken).toBe('mock_refresh_token');
        });

        it('should throw 401 when no refresh token provided', async () => {
            await expect(authService.refresh(null)).rejects.toMatchObject({ status: 401 });
        });
    });
});
