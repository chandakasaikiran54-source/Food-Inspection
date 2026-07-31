import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

// Import Models
import User from '../src/models/User.model.js';
import Ward from '../src/models/Ward.model.js';
import Inspector from '../src/models/Inspector.model.js';
import FoodBusiness from '../src/models/FoodBusiness.model.js';
import Inspection from '../src/models/Inspection.model.js';
import Violation from '../src/models/Violation.model.js';
import InspectionAlert from '../src/models/InspectionAlert.model.js';

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    }
};

const fakeNames = ["Sai", "Ravi", "Kumar", "Divya", "Sita", "Venkat", "Anil", "Meena", "Rahul", "Pooja", "Arjun", "Lakshmi", "Sneha", "Kiran", "Vijay"];
const randEnum = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seedData() {
    await connectDb();
    console.log('Clearing existing documents...');
    await Promise.all([
        Ward.deleteMany({}), Inspector.deleteMany({}), FoodBusiness.deleteMany({}),
        Inspection.deleteMany({}), Violation.deleteMany({}), InspectionAlert.deleteMany({})
    ]);

    console.log('Generating 60 Wards...');
    const wards = [];
    for (let i = 1; i <= 60; i++) {
        wards.push({
            wardNumber: i,
            wardName: `Ward ${i} Zone ${randInt(1, 8)}`,
            zone: `Z-${randInt(1, 8)}`,
            boundaries: { type: 'Polygon', coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]] }
        });
    }
    const createdWards = await Ward.insertMany(wards);

    console.log('Generating 20 Inspectors...');
    const userIds = [];
    const password = await bcrypt.hash('Admin@123', 10);
    for (let i = 1; i <= 20; i++) {
        const u = await User.create({
            firstName: randEnum(fakeNames),
            lastName: randEnum(fakeNames),
            email: `inspector${i}@gvmc.gov.in`,
            password,
            role: 'INSPECTOR',
            phone: `9199999${100 + i}`
        });
        userIds.push(u._id);
    }

    const inspectors = [];
    for (const uid of userIds) {
        inspectors.push({
            user: uid,
            employeeId: `EMP-${randInt(1000, 9999)}`,
            fullName: randEnum(fakeNames) + ' ' + randEnum(fakeNames),
            assignedWards: [randEnum(createdWards)._id],
            maxWorkload: randInt(15, 25),
            currentWorkload: randInt(5, 10),
            availabilityStatus: 'ACTIVE'
        });
    }
    const createdInspectors = await Inspector.insertMany(inspectors);

    console.log('Generating 100 Businesses (including 15 High Risk and 30 Overdue)...');
    const businesses = [];
    const categories = ['Restaurant', 'Cafe', 'StreetVendor', 'Supermarket'];
    const risks = ['Low', 'Medium', 'HIGH', 'Critical']; // Specific caps matter based on schemas
    const now = new Date();

    for (let i = 1; i <= 100; i++) {
        let risk = randEnum(risks);
        let nextDue = new Date(now.getTime() + randInt(5, 60) * 24 * 3600 * 1000);

        // Force distributions
        if (i <= 15) risk = 'HIGH';
        if (i > 15 && i <= 30) risk = 'Critical';
        if (i >= 70 && i <= 100) nextDue = new Date(now.getTime() - randInt(1, 30) * 24 * 3600 * 1000); // 30 overdue

        businesses.push({
            businessName: `Eatery ${i} Pvt Ltd`,
            ownerName: randEnum(fakeNames),
            licenseNumber: `FSSAI-${100000 + i}`,
            licenseIssueDate: new Date(),
            businessCategory: randEnum(categories),
            riskCategory: risk,
            ward: randEnum(createdWards)._id,
            nextDueDate: nextDue
        });
    }
    const createdBusinesses = await FoodBusiness.insertMany(businesses);

    console.log('Generating 500 Inspections...');
    const inspections = [];
    for (let i = 1; i <= 500; i++) {
        inspections.push({
            inspectionNumber: `INSP-${2026}-${i}`,
            business: randEnum(createdBusinesses)._id,
            inspector: randEnum(createdInspectors)._id,
            ward: randEnum(createdWards)._id,
            scheduledDate: new Date(now.getTime() - randInt(1, 90) * 24 * 3600 * 1000),
            status: randEnum(['Completed', 'Approved', 'Reviewed']),
            complianceScore: randInt(50, 100),
            foodSafetyGrade: randEnum(['A', 'B', 'C']),
            riskLevel: randEnum(['Low', 'Medium', 'High'])
        });
    }
    const createdInspections = await Inspection.insertMany(inspections);

    console.log('Generating 100 Violations...');
    const violations = [];
    for (let i = 1; i <= 100; i++) {
        violations.push({
            inspectionReference: randEnum(createdInspections)._id,
            violationCategory: randEnum(['Hygiene', 'Storage', 'Pest Control', 'Licensing']),
            severity: randEnum(['Low', 'Medium', 'High', 'Critical']),
            description: 'Sample violation recorded during inspection',
            status: randEnum(['OPEN', 'RESOLVED'])
        });
    }
    await Violation.insertMany(violations);

    console.log('Generating 50 Alerts...');
    const alerts = [];
    for (let i = 1; i <= 50; i++) {
        alerts.push({
            type: randEnum(['INSPECTION_DUE', 'INSPECTION_OVERDUE', 'HIGH_RISK', 'CRITICAL_BUSINESS']),
            message: `Generated automated alert sequence ${i}`,
            business: randEnum(createdBusinesses)._id,
            priority: randEnum(['Low', 'Medium', 'High', 'Critical']),
            status: randEnum(['UNREAD', 'READ', 'RESOLVED'])
        });
    }
    await InspectionAlert.insertMany(alerts);

    console.log('Seeding Completed Successfully! Exiting...');
    process.exit(0);
}

seedData();
