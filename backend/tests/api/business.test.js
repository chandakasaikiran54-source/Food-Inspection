import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/User.model.js';
import FoodBusiness from '../../src/models/FoodBusiness.model.js';
import { signAccessToken } from '../../src/utils/jwt.js';
import { connectDB } from '../../src/config/db.js';

describe('Business API', () => {
    let adminToken;
    let businessId;

    beforeAll(async () => {
        await connectDB();

        // Ensure a user exists
        const admin = await User.create({
            fullName: 'Test Admin',
            email: `admin_${Date.now()}@test.gov`,
            password: 'Password1!',
            role: 'ADMIN'
        });

        adminToken = signAccessToken({ id: admin._id, role: admin.role });
    });

    afterAll(async () => {
        await User.deleteMany({ email: /@test.gov$/ });
        await FoodBusiness.deleteMany({ licenseNumber: /^TEST-/ });
        await mongoose.connection.close();
    });

    it('should prevent unauthorized access', async () => {
        const res = await request(app).get('/api/v1/businesses');
        expect(res.status).toBe(401);
    });

    it('should create a new business securely', async () => {
        const newBusiness = {
            businessName: 'Test Cafe',
            licenseNumber: `TEST-${Date.now()}`,
            businessType: 'Restaurant',
            foodCategory: 'Prepared Food',
            ownerName: 'John Doe',
            phone: '9876543210',
            address: '123 Fake St',
            ward: 'W01',
            zone: 'North',
            latitude: 17.6,
            longitude: 83.2,
            licenseIssueDate: new Date().toISOString(),
            licenseExpiryDate: new Date(Date.now() + 31536000000).toISOString() // +1 yr
        };

        const res = await request(app)
            .post('/api/v1/businesses')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newBusiness);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.businessName).toBe('Test Cafe');
        expect(res.body.data.licenseNumber).toBe(newBusiness.licenseNumber);

        businessId = res.body.data._id;
    });

    it('should list businesses with pagination info', async () => {
        const res = await request(app)
            .get('/api/v1/businesses?limit=5')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.pagination).toBeDefined();
    });
});
