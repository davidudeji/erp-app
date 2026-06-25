ERP Suite

A modern AI-powered Enterprise Resource Planning (ERP) platform built for Small Businesses, Schools, Healthcare Providers, and Growing Organizations.

ERP Suite combines Inventory Management, Sales, CRM, Finance, Reporting, and Artificial Intelligence into a single platform that helps organizations streamline operations, improve decision-making, and scale efficiently.

---

Overview

ERP Suite is a multi-tenant SaaS ERP designed to help organizations manage their entire business from one dashboard.

The platform provides:

- Inventory Management
- Sales & Order Processing
- Customer Relationship Management (CRM)
- Financial Management
- Reporting & Analytics
- AI-Powered Business Intelligence
- School Management Extensions
- Healthcare Management Extensions

---

Features

Dashboard

- Real-time business metrics
- Revenue tracking
- Inventory insights
- Customer analytics
- Financial summaries
- Business alerts and notifications

Sales Management

- Sales Orders
- Quotations
- Point of Sale (POS)
- Customer Management
- Order Tracking
- Sales Analytics

Inventory Management

- Product Catalog
- Categories
- Suppliers
- Warehouses
- Stock Movements
- Inventory Tracking
- Low Stock Alerts

Finance

- Invoices
- Payments
- Expenses
- Purchase Orders
- Financial Reports
- Revenue Analytics

CRM

- Leads
- Customers
- Activities
- Customer History
- Opportunity Tracking

Reporting

- Sales Reports
- Inventory Reports
- Financial Reports
- Customer Reports
- Export to PDF
- Export to Excel

AI Features

- ERP Chat Assistant
- Invoice OCR Processing
- Inventory Image Verification
- Report Summarization
- Business Insights
- Forecasting & Predictions

Security

- Multi-Tenant Architecture
- Role-Based Access Control (RBAC)
- Permissions Management
- Audit Logs
- Activity Tracking

---

Technology Stack

Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn UI
- Framer Motion
- Recharts

Backend

- Strapi CMS
- Node.js
- PostgreSQL
- Prisma ORM

Authentication

- NextAuth.js
- Google OAuth
- Credentials Authentication

Payments

- Stripe

Email

- Nodemailer

AI

- Gemini Nano
- OCR Processing
- AI Business Insights

Infrastructure

- PostgreSQL
- Cloudflare
- Vercel
- Docker

---

Architecture

```
Frontend (Next.js)
│
▼
API Layer
│
▼
Strapi Backend
│
▼
Prisma ORM
│
▼
PostgreSQL
```

---

Core Modules

Organization Management

- Organizations
- Branches
- Settings

User Management

- Users
- Roles
- Permissions
- Audit Logs

Inventory

- Products
- Categories
- Suppliers
- Warehouses
- Inventory
- Stock Movements

Sales

- Customers
- Sales Orders
- Order Items
- Quotations

Finance

- Invoices
- Payments
- Expenses
- Purchase Orders

CRM

- Leads
- Activities

AI

- AI Conversations
- AI Messages
- OCR Documents
- Inventory Verification

---

Database Design

The system follows a multi-tenant architecture where every business entity belongs to an Organization.

Key entities include:

- Organization
- User
- Role
- Customer
- Supplier
- Product
- Inventory
- Warehouse
- SalesOrder
- Invoice
- Payment
- Report
- AIConversation
- AuditLog

---

Project Structure

```
src/
├── app/
├── components/
├── features/
│   ├── dashboard/
│   ├── inventory/
│   ├── sales/
│   ├── finance/
│   ├── crm/
│   ├── reports/
│   └── ai/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
└── utils/

backend/
├── strapi/
├── prisma/
└── database/
```

---

Getting Started

Install Dependencies

```bash
npm install
```

Configure Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

Run Development Server

```bash
npm run dev
```

---

Roadmap

Phase 1

- Authentication
- Dashboard
- Inventory
- Sales
- Customers
- Invoices

Phase 2

- Reports
- Analytics
- Exports
- Notifications

Phase 3

- AI Assistant
- OCR Processing
- Forecasting
- Inventory Verification

Phase 4

- Multi-Branch Support
- School Module
- Healthcare Module
- Workflow Automation


---

Author

Built by David Udeji

Modern AI-Powered ERP Platform for Businesses, Schools, and Healthcare Providers.
