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

## 🗂 System Modules & Data Dictionary

The ERP system is divided into granular, permission-controlled modules and sub-modules. Below is the comprehensive list of modules and their core data fields.

### 1. Business Management
Centralized repository for all business entities and legal structures.
*   **Business Profile**
    *   *Fields*: Business Name, Logo, Contact Info (Phone, Email, Website), Category (SIC Code), Tax ID / VAT, Location (HQ, GPS), Currency, Timezone, Fiscal Year End, Status
*   **Company Structure**
    *   *Fields*: House Name, Linked Business, CRN, Directors/Managers, House Code, Location, Contact Number, Opening Hours, Filing Due Date, Balance Sheet (PDF), P&L Statement (PDF), Status

### 2. Fleet Management
Operations and logistics tracking for vehicles and deliveries.
*   **Vehicle Fleet**
    *   *Fields*: Registration, Make & Model, Linked Business, Driver Name, Fuel Type, Ownership Type, MOT Expiry, Insurance Expiry, Service Due, Mileage, Status, Notes
*   **Delivery Tracking**
    *   *Fields*: Order ID, Recipient Name, Delivery Address, Linked Business, Driver Assigned, Vehicle Assigned, Dispatch Time, ETA, Status, Notes, GPS Coordinates
*   **Parcel Services**
    *   *Fields*: Tracking ID, Courier Service, Service Level, Sender Info, Recipient Info, Weight, Dimensions, Status, ETA, Notes

### 3. Inventory Management
Stock control and asset tracking.
*   **Master Inventory**
    *   *Fields*: Item Code, Product Name, Category, Stock Level, Minimum Level, Unit Price, Location/Warehouse, Supplier, Status, Notes
*   **Transaction History**
    *   *Fields*: Transaction ID, Item, Quantity Changed, Type (In/Out), Date, Processed By, Reference, Status

### 4. Accounting & Finance
Comprehensive financial tracking and record-keeping.
*   **Financial Records**
    *   *Fields*: Record Title, Business, Category (Rent, Supplier Payments, Mortgage, etc.), Type (Income/Expense/Asset/Liability/Equity), Amount, Date, Payment Method, Reference Number, Status, Document (Upload), Notes
*   **Invoices**
    *   *Fields*: Client Name, Invoice Number, Invoice Type, Amount, Payment Method, Invoice Date, Due Date, Reference Number, Status, PDF Upload, Notes
*   **Bank Accounts**
    *   *Fields*: Bank Name, Account Name, Account Number, Sort Code, IBAN, Account Type, Status, Document Upload
*   **Loans & Insurance**
    *   *Fields*: Loan Name, Purpose, Total Amount, Outstanding Amount, Monthly Payment, Interest Rate, Start/End Date, Insurance Provider, Policy Number, Premium Amount, Expiry Date
*   **Tax Records**
    *   *Fields*: Tax Type, Tax Amount, Period Start, Period End, Filing Date, Payment Due, Document Upload

### 5. Payment Services
Tracking of card machines and merchant terminals.
*   **Merchant Services**
    *   *Fields*: Location Name, Terminal ID, Machine Provider, Setup Date, Monthly Fee, Transaction Rate, Account Link, Status, Document Upload

### 6. Legal & Compliance
Secure document repository.
*   **Legal Documents** *(Standalone)*
    *   *Fields*: Document Title, Category, Business, Issue Date, Expiry Date, Related Parties, Document Upload, Status, Summary/Notes

### 7. Property Management
Management of real estate assets and facilities.
*   **Property Inventory**
    *   *Fields*: Property Name, Type, Address, Linked Business, Purchase/Lease Value, Lease Expiry, Area (sqft), Current Condition, Status, Notes
*   **Maintenance Requests**
    *   *Fields*: Request ID, Property, Category, Priority, Reported By, Assigned Contractor, Description, Cost Estimate, Date Reported, Completion Date, Status
*   **Waste Collection**
    *   *Fields*: Vendor Name, Linked Business, Collection Frequency, Waste Type, Cost per Collection, Next Pickup Date, Contract Expiry, Status, Notes
*   **Licences & Permits**
    *   *Fields*: Licence Type, Issuing Authority, Linked Business, Issue Date, Expiry Date, Cost, Status, Document Upload, Notes

### 8. Reports & Analytics
*   **Business Analytics** *(Standalone)*
    *   *Fields*: Aggregated data across all modules (Total Income, Total Expenses, Active Entities, Active Vehicles, Overdue Invoices, Inventory Value, P&L Statement, Financial Analytics).

### 9. Suppliers & Vendors
*   **Vendor Partner Registry**
    *   *Fields*: Supplier Name, Category, Linked Business, Contact Person, Phone, Email, Address, Tax ID, Payment Terms, Bank Details, Status, Notes
*   **Purchase Order History**
    *   *Fields*: PO Number, Supplier, Order Date, Delivery Date, Items Ordered, Total Value, Delivery Status, Payment Status, Invoice Reference, Notes

### 10. System Reminders
*   **Reminders** *(Standalone)*
    *   *Fields*: Task Title, Due Date, Assigned To, Priority, Status, Description, Module Link

### 11. User Management (System Access)
*   **User Registry**
    *   *Fields*: Full Name, Username, Email, User Role, Assigned Business, Password
*   **Role Permissions**
    *   *Fields*: User Selection, Module Access, View, Add, Edit, Delete (per sub-module), Dashboard Widgets Configuration

---

## 📝 Recent Synchronization Updates
- **Standardized Dropdowns**: All "Business Name" fields are now dynamically populated from the database.
- **Reports Accuracy**: Financial reports now use live database aggregation instead of mock values.
- **User Management**: Admins can configure precise sub-module permissions via the Access Control Matrix.
