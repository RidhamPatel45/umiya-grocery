# 🛒 Umiya Wholesale & Retail Hub — Online Grocery Store

> Production-ready full-stack grocery e-commerce platform built as an SDE Internship Project.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Redis](https://img.shields.io/badge/Redis-Cache-red?logo=redis)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Project Overview

**Umiya Wholesale & Retail Hub** is a full-stack online grocery platform that allows customers to browse, search, and purchase groceries while giving admins full control over inventory, orders, and reports.

---

## 🏗️ Architecture

```
Client (Next.js 15 + TypeScript)
         ↓
    API Gateway (Express.js)
         ↓
  ┌──────┬──────────┬────────────┐
MongoDB  Redis   Cloudinary  Razorpay
(Data)  (Cache)  (Images)   (Payments)
```

---

## 🚀 Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | Next.js 15, React, TypeScript, Tailwind CSS, ShadCN UI |
| Backend      | Node.js, Express.js, TypeScript   |
| Database     | MongoDB Atlas                     |
| Cache        | Redis (Upstash)                   |
| Auth         | JWT + Refresh Tokens              |
| Storage      | Cloudinary                        |
| Payments     | Razorpay                          |
| Email        | Nodemailer (Gmail SMTP)           |
| SMS          | Twilio                            |
| Deployment   | Vercel (Frontend) + AWS EC2 (Backend) |

---

## 📁 Project Structure

```
umiya-grocery/
├── frontend/          # Next.js 15 application
│   ├── app/           # App Router pages
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utilities, API clients
│   ├── hooks/         # Custom React hooks
│   ├── store/         # Zustand global state
│   └── types/         # TypeScript types
│
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   └── tests/
│
└── docs/              # SRS, ER diagrams, API docs
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Redis (Upstash free tier)
- Cloudinary account
- Razorpay account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/umiya-grocery.git
cd umiya-grocery
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Fill in your credentials in .env
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in your credentials
npm install
npm run dev
```

### 4. Open in browser

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

---

## 🔐 Environment Variables

### Backend `.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=redis://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
TWILIO_SID=...
TWILIO_TOKEN=...
TWILIO_PHONE=...
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
NEXT_PUBLIC_APP_NAME=Umiya Grocery
```

---

## 📖 API Documentation

Full Swagger docs available at `/api-docs` when backend is running.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| GET | /api/categories | Get all categories |
| POST | /api/cart | Add to cart |
| GET | /api/cart | Get user cart |
| POST | /api/orders | Place order |
| GET | /api/orders/:id | Track order |
| POST | /api/payments/create | Create payment |
| POST | /api/payments/verify | Verify payment |

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

---

## 🚢 Deployment

- **Frontend** → Vercel (auto-deploy from main branch)
- **Backend** → AWS EC2 with PM2
- **Database** → MongoDB Atlas (M10+ cluster for production)
- **Cache** → Upstash Redis

---

## 👨‍💻 Author

**Ridham Patel** — SDE Intern  
Umiya Wholesale & Retail Hub

---

## 📄 License

MIT License — see [LICENSE](LICENSE)
