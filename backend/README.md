# Backend API - Food Safety Inspection Monitoring System

This is the backend API for the Food Safety Inspection Monitoring System, built with Node.js, Express, and MongoDB Atlas.

## Setting Up MongoDB Atlas 🚀

Follow these steps to configure your MongoDB Atlas cluster correctly for this project:

### 1. Create a MongoDB Atlas Cluster
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/log in.
- Click **Build a Database** (Choose the Free/Shared `M0` cluster).
- Select your preferred cloud provider and region, then click **Create Cluster**.

### 2. Create Database User
- In the left sidebar, under **Security**, click **Database Access**.
- Click **ADD NEW DATABASE USER**.
- Choose Password authentication.
- Create a **Username** and **Password** (Make sure to save it safely).
- Set privileges to **Read and write to any database**.
- Click **Add User**.

### 3. Whitelist your IP Address
- Under **Security**, click **Network Access**.
- Click **ADD IP ADDRESS**.
- Click **Allow Access from Anywhere** (Optionally choose `Add Current IP Address` if you want it stricter).
- Click **Confirm**.

### 4. Running the Backend
1. Modify `backend/.env` with your newly created Database Credentials:
```env
DB_USERNAME=your_created_username
DB_PASSWORD=your_created_password
```
2. Run `npm install` inside the `backend` directory.
3. Run `npm run dev` to start the backend. The backend will dynamically plug your credentials into the `MONGO_URI`.

### 5. Running the Frontend
1. Open a new terminal and navigate to the `frontend` directory.
2. Run `npm install`.
3. Run `npm run dev`.

*You are now fully connected with MongoDB Atlas!*
