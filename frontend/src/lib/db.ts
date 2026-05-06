/**
 * ERP System Database - DEPRECATED
 * 
 * All data has been migrated to the Django MongoDB Backend.
 * Please use the API endpoints (see @/lib/api.ts) to fetch and store data.
 * 
 * This file is kept only for type reference during the transition.
 */

export const FORM_OPTIONS = {
  accountingCategories: ['Supplier Payments', 'Rent', 'Mortgage', 'Accountant Fees', 'Bank Charges', 'Insurance', 'VAT / Tax'],
  accountingSuppliers: ['Global Supplies Ltd', 'Tech Connect Inc', 'Office Depot'],
  accountingPaymentModes: ['Monthly', 'Quarterly', 'Annually'],
  accountingRecordTypes: ['Expense', 'Income'],
  accountingPaymentStatuses: ['Paid', 'Pending', 'Overdue'],
  accountingInvoiceStatuses: ['Sent', 'Paid', 'Overdue', 'Cancelled'],
  accountingBankTypes: ['Business Current', 'Business Savings', 'Merchant Account', 'Corporate Card', 'Petty Cash'],
  accountingBankStatuses: ['Active', 'Inactive'],
  accountingLoanStatuses: ['Active', 'Pending', 'Paid Off', 'Defaulted'],
  accountingRenewalReminders: ['30 Days Before', '15 Days Before', '7 Days Before'],
  accountingVatStatuses: ['Draft', 'Filed', 'Paid', 'Overdue'],
  accountingDojoMethods: ['Card', 'Digital Wallet'],
  inventoryCategories: ['Food & Beverages', 'Groceries', 'Electronics', 'Stationery', '+ Add New Category...'],
  inventoryItems: ['Milk Packet 1L', 'Sugar 1kg'],
  propertyAssetTypes: ['HVAC', 'Electrical', 'Plumbing', 'Safety', 'Furniture', 'IT Infrastructure'],
  propertyAssets: ['Main Office HVAC', 'Elevator A', 'Fire Suppression System', 'Other'],
  propertyPriorities: ['Urgent', 'Medium', 'Low'],
  propertyStatuses: ['Active', 'Expired', 'Pending'],
  legalDocTypes: [
    'License Applications',
    'Change of DPS',
    'Change of Premisses Slip',
    'Food Statement Agency Forms',
    'Refusal Logs',
    'Temp Records',
  ],
  userRoles: ['Admin', 'Manager', 'Staff'],
  userBusinesses: ['All Entities', 'Main Retail Store', 'Logistics Hub'],
  supplierCategories: ['Raw Materials', 'Services', 'Office Supplies', 'IT Hardware', 'Logistics', 'Other'],
  supplierStatuses: ['Active', 'Inactive', 'On Hold'],
  supplierNames: ['Global Logistics Partners', 'Prime Office Supplies', 'TechConnect Inc'],
  orderProductCategories: ['Electronics', 'Stationery', 'Services', 'Logistics'],
  orderStatuses: ['Pending', 'Paid', 'Overdue'],
  systemServiceNames: ['Till Access', 'PayPoint', 'PayZone', 'Lottery', 'Other'],
  systemStatuses: ['Active', 'Inactive'],
  fleetBusinesses: ['Main Retail Store', 'Logistics Hub', 'Whiterock Retail Ltd', 'Zenith Logistics Hub'],
  fleetVehicles: ['CAR 1 (ABC-1234)', 'VAN 2 (XYZ-5678)'],
  fleetDeliveryStatuses: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
  fleetVehicleShort: ['CAR 1', 'VAN 2'],
  fleetAgreementStatuses: ['Active', 'Pending', 'Expired'],
  businessCategories: ['Retail', 'Manufacturing', 'Service Provider', 'Holding Company', 'Other'],
};

// Mock data removed - Now fetching from MongoDB via Django API
export const BUSINESSES = {};
export const ACCOUNTING_RECORDS = [];
export const FLEET_RECORDS = [];
export const INVENTORY_RECORDS = [];
export const SUPPLIER_RECORDS = [];
export const LEGAL_RECORDS = [];
export const PROPERTY_RECORDS = [];
export const BUSINESS_ENTITIES = [];
export const BUSINESS_STRUCTURES = [];
export const INVENTORY_ALERTS = [];
export const INVENTORY_STOCK = [];
export const INVENTORY_MOVES = [];
export const FLEET_REMINDERS = [];
export const FLEET_VEHICLES = [];
export const FLEET_DELIVERIES = [];
export const FLEET_PARCELS = [];
export const ACCOUNTING_HISTORY = [];
export const ACCOUNTING_INVOICES = [];
export const ACCOUNTING_BANKS = [];
export const ACCOUNTING_LOANS = [];
export const ACCOUNTING_DOJO = [];
export const ACCOUNTING_INSURANCE = [];
export const ACCOUNTING_VAT = [];
export const USER_SYSTEM_MAP = [];
export const USER_REGISTRY = [];
export const LEGAL_DOCS = [];
export const SUPPLIER_DIRECTORY = [];
export const PURCHASE_ORDERS = [];
export const PROPERTY_ASSETS = [];
export const PROPERTY_REQUESTS = [];
export const PROPERTY_WASTE = [];
export const PROPERTY_LICENCES = [];
export const DASHBOARD_BUSINESSES = [];
export const DASHBOARD_FLEET = [];
export const DASHBOARD_NOTES = [];
export const DASHBOARD_VAT = [];
export const DASHBOARD_TODOS = [];
export const DASHBOARD_PASSWORDS = [];
export const DASHBOARD_SUPPLIER_PAYMENTS = [];
export const DASHBOARD_SALES = [];
export const DASHBOARD_BANKS = [];
export const DASHBOARD_MAINTENANCE = [];
export const DASHBOARD_LOW_STOCK = [];
export const DASHBOARD_ACTIVITY = [];
export const DASHBOARD_RENEWALS = [];
export const DASHBOARD_PL = {
  income: '$0',
  expenses: '$0',
  grossProfit: '$0',
  tax: '$0',
  netProfit: '$0',
};
export const DASHBOARD_EMAILS = [];
export const SYSTEM_CREDENTIALS = [];
export const SYSTEM_ALERTS = [];
export const ACCOUNTING_SUMMARY = { income: '$0', expenses: '$0' };
export const REPORT_STATS = [];
export const LEGAL_SUMMARY = { expiredDocs: 0 };
export const SUPPLIER_METADATA = { nextId: 'SUP-001' };
export const LOGIN_CREDENTIALS = {
  superAdmin: { email: '', username: '', password: '', altPassword: '', businesses: [] },
  companyAdmin: { email: '', username: '', password: '', businesses: [] },
};
export const REPORT_TEMPLATES = [];
export const REMINDERS = [];
