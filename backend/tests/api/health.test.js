import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';

describe('Health Check API', () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return 200 and system health status', async () => {
        const res = await request(app).get('/api/v1/health');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('Application Status', 'Online');
        expect(res.body.data).toHaveProperty('MongoDB Status');
        expect(res.body.data).toHaveProperty('Environment');
        expect(res.body.data).toHaveProperty('Timestamp');
    });
});
