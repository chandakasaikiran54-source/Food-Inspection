import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authService from './src/services/auth.service.js';
import User from './src/models/User.model.js';

async function testNonBusinessLogin() {
    await mongoose.connect(process.env.MONGO_URI);

    // Cleanup if exists
    await User.deleteMany({ email: { $in: ['testadmin@gov.in', 'testcommissioner@gov.in'] } });

    const payloadAdmin = {
        email: 'testadmin@gov.in',
        password: 'Password123',
        fullName: 'Test Admin',
        role: 'ADMIN',
    };
    const payloadComm = {
        email: 'testcommissioner@gov.in',
        password: 'Password123',
        fullName: 'Test Comm',
        role: 'COMMISSIONER',
    };

    try {
        const resAdmin = await authService.signup(payloadAdmin, { ip: '127.0.0.1', userAgent: 'test-agent' });
        console.log('Admin Signup Success!', !!resAdmin.accessToken);

        const resComm = await authService.signup(payloadComm, { ip: '127.0.0.1', userAgent: 'test-agent' });
        console.log('Comm Signup Success!', !!resComm.accessToken);

        // try login
        const loginRes = await authService.login({ email: 'testadmin@gov.in', password: 'Password123' }, { ip: '1.2.3.4' });
        console.log('Admin Login Success!', !!loginRes.accessToken);
        console.log('Admin User Role:', loginRes.user.role);

    } catch (e) {
        console.error('Test failed:', e);
    }

    await mongoose.disconnect();
}

testNonBusinessLogin().catch(console.error);
