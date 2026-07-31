# Food Safety Inspection Monitoring System (Backend API)

## Overview
A comprehensive regulatory backend powering Government Food Inspection logic securely mapped atop Node.js, Express, and MongoDB. System supports intricate aggregation Math, Role-Based Access controls masking hierarchical data, and strict interval mappings.

## Dependencies
- Node.js (v18+)
- MongoDB Atlas (or local Mongoose URI equivalent)
- Redis (bull queue adapters configured internally)

## Installation & Setup
1. Clone the repository and navigate into `/backend`.
2. Generate base dependencies: 
   ```bash
   npm install
   ```
3. Initialize the `.env` configuration file locally inside the root matching `PORT`, `MONGO_URI`, and `JWT_SECRET`.
4. Deploy the comprehensive Hackathon mock arrays:
   ```bash
   npm run seed
   ```

## Running the Application
Development Engine (Nodemon):
```bash
npm run dev
```
Production Engine:
```bash
npm start
``` 

## Docker Deployment
Orchestrate natively using the provided multi-stage configurations cleanly mapping container contexts locally natively:
```bash
docker-compose up --build -d
```

## Hackathon Demo Login Scenarios
The database seeder produces realistic arrays simulating live government mapping limits dynamically. 
The specific Inspector load tests uniquely mapped via:
- **Email:** `inspector1@gvmc.gov.in` (up to inspector20@gvmc.gov.in)
- **Password:** `Admin@123`
- **Role Limits:** System checks token constraints automatically isolating only Ward/Schedule arrays belonging to these mock users intrinsically cleanly.

## Key Modules Delivered
1. **RBAC Engine:** Distinct `ADMIN`, `SUPERVISOR`, `COMMISSIONER`, and `INSPECTOR` endpoints securely bounding queries.
2. **Frequency Engine / Alerts:** Native Interval calculation blocks and Cron-level processing safely checking DB contexts implicitly automatically triggering.
3. **Analytics Tracking:** Granular MongoDB arrays tracking Live Dashboards extracting metric pipelines inherently bypassing `N+1` boundaries.
