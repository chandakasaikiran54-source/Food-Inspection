import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/User.model.js';
import Inspector from '../../src/models/Inspector.model.js';
import Ward from '../../src/models/Ward.model.js';
import { signAccessToken } from '../../src/utils/jwt.js';
import { connectDB } from '../../src/config/db.js';

describe('Phase 5 API Integration (Mocked Server State)', () => {
    let adminToken;
    let createdInspectorId;
    let createdWardId;

    beforeAll(async () => {
        await connectDB();
        const admin = await User.create({
            fullName: 'Test Admin Phase5',
            email: `admin5_${Date.now()}@test.gov`,
            password: 'Password1!',
            role: 'ADMIN'
        });
        adminToken = signAccessToken({ id: admin._id, role: admin.role });
    });

    afterAll(async () => {
        await User.deleteMany({ email: /@test.gov$/ });
        await Inspector.deleteMany({ email: /@test.gov$/ });
        await Ward.deleteMany({ wardNumber: /^TEST-/ });
        await mongoose.connection.close();
    });

    it('should create an Inspector securely', async () => {
        const payload = {
            employeeId: `TEST-EMP-${Date.now()}`,
            fullName: 'John Inspector',
            email: `inspector_${Date.now()}@test.gov`,
            phone: '1234567890',
            designation: 'Senior Inspector',
            department: 'Food Safety',
            experience: 5,
            maxWorkload: 10,
            joiningDate: new Date().toISOString()
        };

        const res = await request(app)
            .post('/api/v1/inspectors')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.employeeId).toBe(payload.employeeId);

        createdInspectorId = res.body.data._id;
    });

    it('should create a Ward securely', async () => {
        const payload = {
            wardNumber: `TEST-W-${Date.now()}`,
            wardName: 'North Block',
            zone: 'Zone 1',
            circle: 'Circle A',
            latitude: 15.5,
            longitude: 78.5
        };

        const res = await request(app)
            .post('/api/v1/wards')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.wardNumber).toBe(payload.wardNumber);

        createdWardId = res.body.data._id;
    });

    it('should assign inspector to ward', async () => {
        const res = await request(app)
            .post(`/api/v1/wards/${createdWardId}/assign-inspector`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ inspectorId: createdInspectorId });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.assignedInspector).toBe(createdInspectorId.toString());
    });

    it('should compute inspector workload after assignment', async () => {
        const res = await request(app)
            .get(`/api/v1/inspectors/${createdInspectorId}/workload`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.currentWorkload).toBe(1);
    });
});
