import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    await mongoose.connect(process.env.MONGO_URI);

    // Create explicitly
    /*const user = await User.create({
        fullName: 'Test User 2',
        email: 'testtest2@gov.in',
        password: 'Password123',
        role: 'INSPECTOR'
    });*/

    const user = await User.findOne({ email: 'testuser@health.gov' }).select('+password');
    console.log('User found:', !!user);
    if (user) {
        console.log('Password hash:', user.password);
        const match = await user.comparePassword('Password123');
        console.log('Password match with Password123:', match);
    }

    await mongoose.disconnect();
}
test().catch(console.error);
