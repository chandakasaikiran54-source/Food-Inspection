import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authService from './src/services/auth.service.js';
import userController from './src/controllers/user.controller.js';
// mock express req res for testing
const mockReq = {
    query: { page: 1, limit: 10 },
    user: { role: 'ADMIN' }
};

const mockRes = {
    status: function (code) { this.statusCode = code; return this; },
    json: function (payload) { console.log('JSON Output:', JSON.stringify(payload, null, 2)); }
};

async function testListUsers() {
    await mongoose.connect(process.env.MONGO_URI);

    // Call userController list directly bypassing express mapping
    await userController.list(mockReq, mockRes, (err) => console.error(err));

    await mongoose.disconnect();
}

testListUsers().catch(console.error);
