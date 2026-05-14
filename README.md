# Zerozzz ERP - Modern Business OS

Welcome to the Zerozzz ERP, a premium Enterprise Resource Planning system built with Next.js and Django (MongoDB).

## 🚀 Key Features
- **Dynamic Business Selection**: Centralized "Source of Truth" for all registered businesses across all modules.
- **Granular Access Control**: Role-based permissions down to specific modules and actions (View, Add, Edit, Delete).
- **Business Analytics**: Real-time financial reporting, P&L statements, and KPI tracking across multiple entities.
- **Module Synchronization**: Unified data flow for Fleet, Inventory, Accounting, Legal, and Property management.

---

## 🔐 Default Access Credentials (Seed Data)

Use the following accounts to test different roles and permission levels:

| Role | Username | Password | Scope / Business |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `superadmin123` | Global (All Entities) |
| **Retail Admin** | `admin_retail` | `admin123` | Main Retail Store |
| **Logistics Admin** | `admin_logistics` | `admin123` | Logistics Hub |

*Note: You can also use the email address as the username (e.g., `superadmin@erp.com`).*

---

## 🛠 Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Django, Django REST Framework, MongoDB.
- **Authentication**: JWT (JSON Web Tokens).

---

## 🚦 Getting Started

### Backend
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. **Seed Database**: `python seed.py` (Crucial for initial setup)
5. Start server: `python manage.py runserver`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

---

## 📝 Recent Synchronization Updates
- **Standardized Dropdowns**: All "Business Name" fields are now dynamically populated from the database.
- **Reports Accuracy**: Financial reports now use live database aggregation instead of mock values.
- **User Management**: Admins can now be assigned specific modules during registration.
