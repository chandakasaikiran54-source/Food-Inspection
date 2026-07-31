# 🍽️ Food Inspection Monitor

A production-ready government application for managing food establishment inspections, inspector assignments, compliance tracking, and public health reporting.

---

## 📋 Project Overview

The Food Inspection Monitor is a full-stack web application designed for government health departments to:

- Track and schedule food establishment inspections
- Manage inspector workloads and assignments
- Monitor compliance and violations in real time
- Generate reports and analytics for decision makers
- Send automated alerts for critical compliance failures

---

## ✨ Features

- 🔐 Role-based authentication (Admin, Supervisor, Inspector, Viewer)
- 🏢 Business / establishment management
- 📅 Inspection scheduling and management
- 📊 Real-time analytics dashboard
- 🚨 Automated alert system for critical violations
- 📄 Report generation (PDF / CSV)
- 🗺️ Geographic risk mapping
- 📷 Photo evidence upload and management
- 📱 Responsive UI for field use

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, React Router, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | PostgreSQL                          |
| Auth       | JWT + Refresh Tokens                |
| Cache      | Redis                               |
| Queue      | Bull (background jobs)              |
| Storage    | Local / S3-compatible               |
| Logging    | Winston + Morgan                    |
| Container  | Docker + Docker Compose             |

---

## 📁 Folder Structure

```
food-inspection-monitor/
├── frontend/          # React application
├── backend/           # Express API server
├── shared/            # Shared constants, types, enums
├── docs/              # Project documentation
├── scripts/           # Utility / deployment scripts
└── docker-compose.yml
```

See full structure in [`/docs/architecture/`](./docs/architecture/).

---

## 🚀 Installation

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14
- Redis >= 7
- Docker & Docker Compose (optional)

### Clone the repository

```bash
git clone https://github.com/your-org/food-inspection-monitor.git
cd food-inspection-monitor
```

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory and fill in values:

```bash
cp backend/.env.example backend/.env
```

See [`backend/.env.example`](./backend/.env.example) for all required variables.

---

## ▶️ Running the Project

### Development

```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

### With Docker

```bash
docker-compose up --build
```

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend && npm run test:unit

# Backend integration tests
cd backend && npm run test:integration

# Backend API tests
cd backend && npm run test:api

# All tests with coverage
cd backend && npm run test:coverage
```

---

## 🚢 Deployment

See [`/docs/deployment/`](./docs/deployment/) for full deployment guides covering:

- Environment setup
- Docker deployment
- Nginx reverse proxy configuration
- SSL / HTTPS setup
- Database migrations
- CI/CD pipeline

---

## 🔒 Security Notes

- All API routes are protected via JWT authentication
- Role-based access control enforced at middleware level
- File uploads are stored privately (not publicly accessible)
- Rate limiting applied to all public endpoints
- Input validation on all request bodies
- SQL injection prevention via parameterized queries
- Helmet.js security headers applied

See [`/docs/security/`](./docs/security/) for full security documentation.

---

## 📜 License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE) for details.

---

## 🤝 Contributing

See [`/docs/workflows/`](./docs/workflows/) for the Git branching strategy and contribution guidelines.
