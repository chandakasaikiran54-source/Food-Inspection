import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authService from './src/services/auth.service.js';
import User from './src/models/User.model.js';
import FoodBusiness from './src/models/FoodBusiness.model.js';

async function testBusinessRegistration() {
    await mongoose.connect(process.env.MONGO_URI);

    // Cleanup if exists
    const tb = await User.findOne({ email: 'testbusiness@gov.in' });
    if (tb) {
        await FoodBusiness.deleteOne({ _id: tb.businessId });
        await User.deleteOne({ _id: tb._id });
    }

    const payload = {
        email: 'testbusiness@gov.in',
        password: 'Password123',
        fullName: 'Business Owner',
        role: 'BUSINESS',
        phone: '9988776655',
        alternatePhone: '9988776644',

        govIdType: 'Aadhaar',
        govIdNumber: '123456789012',

        foodBusinessName: 'Test Cafe',
        foodBusinessLicenseNumber: 'GVMC-LIC-12345',
        businessType: 'Cafe',

        shopNumber: 'S-1',
        streetArea: 'Test Street',
        villageLocality: 'Test Locality',
        mandal: 'Test Mandal',
        district: 'Test District',
        state: 'Andhra Pradesh',
        pincode: '530001',

        gstNumber: '22AAAAA0000A1Z5',
        fssaiLicenseNumber: '12233445566778'
    };

    try {
        const result = await authService.signup(payload, { ip: '127.0.0.1', userAgent: 'test-agent' });

        console.log('Registration Success!');
        console.log('Access Token exists:', !!result.accessToken);

        // Check relationships
        const dbUser = await User.findOne({ email: 'testbusiness@gov.in' });
        const dbBusiness = await FoodBusiness.findOne({ ownerId: dbUser._id });

        console.log('User created:', !!dbUser);
        console.log('User role:', dbUser.role);
        console.log('User businessId mapped:', !!dbUser.businessId);

        console.log('Business created:', !!dbBusiness);
        if (dbBusiness) {
            console.log('Business Name:', dbBusiness.businessName);
            console.log('Business ownerId mapped:', !!dbBusiness.ownerId);
            console.log('Business linked correctly:', dbBusiness._id.toString() === dbUser.businessId.toString());
        }
    } catch (e) {
        console.error('Registration failed:', e);
    }

    await mongoose.disconnect();
}

testBusinessRegistration().catch(console.error);
