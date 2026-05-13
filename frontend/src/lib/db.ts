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
  paymentProviders: ['Dojo', 'PayPoint', 'PayZone', 'Lottery', 'Barclaycard', 'Worldpay', 'SumUp', 'Square', 'Stripe'],
  paymentStatuses: ['Pending', 'Processing', 'Paid', 'Failed', 'Reversed', 'Refunded'],
};

// Mock data removed - Now fetching from MongoDB via Django API
export const BUSINESSES = {};
export const ACCOUNTING_HISTORY = [
  { id: 'rec-001', date: '2026-05-13', title: 'Monthly Rent - Main Office', category: 'Rent', amount: '2500.00', status: 'Paid', biz: 'Main Retail Store', rentStart: '2026-05-01', rentEnd: '2026-05-31', method: 'Bank Transfer', reference_number: 'RENT-MAY-26' },
  { id: 'rec-002', date: '2026-05-12', title: 'Stock Purchase - Prime Logistics', category: 'Supplier Payments', amount: '450.50', status: 'Pending', biz: 'Logistics Hub', supplier: 'Prime Logistics', method: 'Credit Card', reference_number: 'PO-77889' },
  { id: 'rec-003', date: '2026-05-10', title: 'Business Mortgage Repayment', category: 'Mortgage', amount: '2450.00', status: 'Paid', biz: 'Holding Company', mortMode: 'Monthly', mortRate: '4.5', mortTerm: '20', mortRepay: '2450.00', method: 'Direct Debit', reference_number: 'MORT-771' },
  { id: 'rec-004', date: '2026-05-08', title: 'Annual Liability Insurance', category: 'Insurance', amount: '850.00', status: 'Paid', biz: 'All Entities', insType: 'Public Liability', insProvider: 'Aviva Business', insPolicy: 'AV-99221-X', insExpiry: '2027-05-08', method: 'Bank Transfer' },
  { id: 'rec-005', date: '2026-05-13', title: 'Q1 VAT Submission', category: 'VAT / Tax', amount: '3420.15', status: 'Pending', biz: 'Main Retail Store', taxType: 'VAT', taxDue: '2026-05-20', method: 'HMRC Portal' },
  { id: 'rec-006', date: '2026-05-11', title: 'Consultancy Fees - Q2', category: 'Accountant Fees', amount: '1200.00', status: 'Paid', biz: 'Holding Company', method: 'Bank Transfer' },
  { id: 'rec-007', date: '2026-05-09', title: 'Utility Bill - Manchester Hub', category: 'Bank Charges', amount: '85.20', status: 'Paid', biz: 'Logistics Hub', method: 'Direct Debit' },
  { id: 'rec-008', date: '2026-05-07', title: 'Warehouse Rent - North', category: 'Rent', amount: '4500.00', status: 'Paid', biz: 'Logistics Hub', rentStart: '2026-05-01', rentEnd: '2026-05-31', method: 'Bank Transfer' },
  { id: 'rec-009', date: '2026-05-05', title: 'Supplier Payment - Tech Connect', category: 'Supplier Payments', amount: '3200.00', status: 'Paid', biz: 'Main Retail Store', supplier: 'Tech Connect Inc', method: 'Bank Transfer', reference_number: 'INV-4421' },
  { id: 'rec-010', date: '2026-05-04', title: 'Equipment Loan Interest', category: 'Bank Charges', amount: '45.00', status: 'Paid', biz: 'Whiterock Retail Ltd', method: 'Direct Debit' },
  { id: 'rec-011', date: '2026-05-02', title: 'Property Tax - Bristol', category: 'VAT / Tax', amount: '1100.00', status: 'Paid', biz: 'Whiterock Retail Ltd', taxType: 'Property Tax', method: 'Bank Transfer' },
  { id: 'rec-012', date: '2026-05-01', title: 'Monthly Salary Disbursement', category: 'Supplier Payments', amount: '12500.00', status: 'Paid', biz: 'All Entities', method: 'Bank Transfer' },
  { id: 'rec-013', date: '2026-04-28', title: 'Cyber Security Insurance', category: 'Insurance', amount: '320.00', status: 'Paid', biz: 'Holding Company', insType: 'Cyber Security', insProvider: 'Hiscox', insPolicy: 'CY-55221', insExpiry: '2027-04-28' },
  { id: 'rec-014', date: '2026-04-25', title: 'Mortgage Overpayment', category: 'Mortgage', amount: '5000.00', status: 'Paid', biz: 'Holding Company', mortMode: 'One-off', method: 'Bank Transfer' },
  { id: 'rec-015', date: '2026-04-20', title: 'Office Supplies - Depot', category: 'Supplier Payments', amount: '125.40', status: 'Paid', biz: 'Main Retail Store', supplier: 'Office Depot', method: 'Card' }
];
export const ACCOUNTING_INVOICES = [
  { id: 'inv-001', num: 'INV-2026-001', client: 'Global Supplies Ltd', amount: '850.00', date: '2026-05-10', due: '2026-05-24', status: 'Sent', invoice_type: 'Service', method: 'Bank Transfer' },
  { id: 'inv-002', num: 'INV-2026-002', client: 'Prime Office Supplies', amount: '120.50', date: '2026-05-12', due: '2026-05-26', status: 'Paid', invoice_type: 'Product', method: 'Card' }
];
export const ACCOUNTING_BANKS = [
  { id: 'bnk-001', bank: 'Barclays', acc: 'Main Business Current', num: '****5678', sort: '20-30-40', type: 'Business Current', status: 'Active' },
  { id: 'bnk-002', bank: 'HSBC', acc: 'Business Savings', num: '****1122', sort: '40-50-60', type: 'Business Savings', status: 'Active' }
];
export const ACCOUNTING_LOANS = [
  { id: 'ln-001', loan: 'Equipment Finance', lender: 'NatWest Business', total: '25000', os: '12450', monthly: '450', rate: '5.2', start: '2025-01-01', end: '2030-01-01', status: 'Active' }
];
export const ACCOUNTING_INSURANCE = [
  { id: 'ins-001', type: 'Professional Indemnity', provider: 'Hiscox', policy: 'HIS-8877', premium: '45.00', expiry: '2027-01-15', status: 'Active', asset: 'Business Operations' }
];
export const ACCOUNTING_VAT = [
  { id: 'tax-001', type: 'VAT Q1 2026', start: '2026-01-01', end: '2026-03-31', amount: '3420.15', deadline: '2026-05-07', due: '2026-05-14', status: 'Pending', ref: 'VAT-Q1-26' }
];
export const BUSINESS_ENTITIES = [
  { id: 'biz-001', name: 'Main Retail Store', category: 'Retail', location: 'London', status: 'Active', manager: 'John Smith' },
  { id: 'biz-002', name: 'Logistics Hub', category: 'Service Provider', location: 'Manchester', status: 'Active', manager: 'Sarah Wilson' },
  { id: 'biz-003', name: 'Whiterock Retail Ltd', category: 'Retail', location: 'Bristol', status: 'Active', manager: 'Mike Brown' }
];
export const FLEET_VEHICLES = [
  { id: 'v-001', plate: 'ABC-1234', model: 'Ford Transit', type: 'Van', biz: 'Logistics Hub', status: 'Active', lastService: '2026-01-10' },
  { id: 'v-002', plate: 'XYZ-5678', model: 'Mercedes Sprinter', type: 'Van', biz: 'Logistics Hub', status: 'In Service', lastService: '2026-03-15' }
];
export const FLEET_DELIVERIES = [
  { id: 'del-001', tracking: 'TRK-99001', destination: 'Birmingham', status: 'In Transit', driver: 'Driver A', vehicle: 'ABC-1234' },
  { id: 'del-002', tracking: 'TRK-99002', destination: 'Liverpool', status: 'Delivered', driver: 'Driver B', vehicle: 'XYZ-5678' }
];
export const INVENTORY_STOCK = [
  { id: 'stk-001', name: 'Milk Packet 1L', category: 'Food & Beverages', stock: 150, minStock: 50, price: '1.20', biz: 'Main Retail Store' },
  { id: 'stk-002', name: 'Sugar 1kg', category: 'Groceries', stock: 200, minStock: 30, price: '0.85', biz: 'Whiterock Retail Ltd' }
];
export const INVENTORY_ALERTS = [
  { id: 'alt-001', item: 'Milk Packet 1L', type: 'Low Stock', message: 'Current stock (150) is approaching limit' }
];
export const ACCOUNTING_RECORDS = [];
export const FLEET_RECORDS = [];
export const INVENTORY_RECORDS = [];
export const SUPPLIER_RECORDS = [];
export const LEGAL_RECORDS = [];
export const PROPERTY_RECORDS = [];
export const BUSINESS_STRUCTURES = [];
export const INVENTORY_MOVES = [];
export const FLEET_REMINDERS = [];
export const FLEET_PARCELS = [
  { id: 'prcl-001', ref: 'PC-123', client: 'Alice Johnson', status: 'Ready for Collection', biz: 'Main Retail Store' }
];
export const USER_SYSTEM_MAP = [];
export const USER_REGISTRY = [
  { id: 'usr-001', name: 'Admin User', role: 'Admin', email: 'admin@erp.com', status: 'Active', biz: 'All Entities' },
  { id: 'usr-002', name: 'Store Manager', role: 'Manager', email: 'manager@erp.com', status: 'Active', biz: 'Main Retail Store' }
];
export const LEGAL_DOCS = [
  { id: 'leg-001', name: 'Alcohol License', type: 'License Applications', expiry: '2027-12-31', status: 'Active', biz: 'Main Retail Store' },
  { id: 'leg-002', name: 'Public Liability Certificate', type: 'Temp Records', expiry: '2026-12-31', status: 'Active', biz: 'All Entities' }
];
export const SUPPLIER_DIRECTORY = [
  { id: 'sup-001', name: 'Global Logistics Partners', category: 'Logistics', status: 'Active', contact: '020 7946 0000' },
  { id: 'sup-002', name: 'Prime Office Supplies', category: 'Office Supplies', status: 'Active', contact: '0161 496 0000' }
];
export const PURCHASE_ORDERS = [
  { id: 'po-001', ref: 'PO-2026-001', supplier: 'Prime Office Supplies', amount: '250.00', status: 'Paid', date: '2026-05-10' }
];
export const PROPERTY_ASSETS = [
  { id: 'ast-001', name: 'Main Office HVAC', type: 'HVAC', status: 'Operational', biz: 'Main Retail Store' }
];
export const PROPERTY_REQUESTS = [
  { id: 'req-001', title: 'Leaking Tap', priority: 'Medium', status: 'Pending', biz: 'Logistics Hub' }
];
export const PROPERTY_WASTE = [
  { id: 'wst-001', date: '2026-05-13', type: 'General Waste', status: 'Collected', biz: 'Main Retail Store' }
];
export const PROPERTY_LICENCES = [
  { id: 'lic-001', name: 'Premises License', status: 'Active', expiry: '2028-01-01', biz: 'Main Retail Store' }
];
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
  income: '£0',
  expenses: '£0',
  grossProfit: '£0',
  tax: '£0',
  netProfit: '£0',
};
export const DASHBOARD_EMAILS = [];
export const SYSTEM_CREDENTIALS = [];
export const SYSTEM_ALERTS = [];
export const ACCOUNTING_SUMMARY = { income: '£0', expenses: '£0' };
export const REPORT_STATS = [];
export const LEGAL_SUMMARY = { expiredDocs: 0 };
export const SUPPLIER_METADATA = { nextId: 'SUP-001' };
export const LOGIN_CREDENTIALS = {
  superAdmin: { email: '', username: '', password: '', altPassword: '', businesses: [] },
  companyAdmin: { email: '', username: '', password: '', businesses: [] },
};
export const REPORT_TEMPLATES = [];
export const REMINDERS = [];
export const PAYMENT_RECORDS = [
  {
    id: 'pay-001',
    provider: 'Dojo',
    biz: 'Main Retail Store',
    type: 'Card Payment',
    transDate: '2026-05-13',
    transRef: 'DJ-999-001',
    gross: '450.00',
    comm: '12.50',
    net: '437.50',
    status: 'Paid',
    method: 'Card',
    staff: 'Admin',
    notes: 'Morning shift settlement'
  },
  {
    id: 'pay-002',
    provider: 'Lottery',
    biz: 'Whiterock Retail Ltd',
    type: 'Lottery sale',
    transDate: '2026-05-13',
    transRef: 'LT-888-002',
    gross: '120.00',
    comm: '6.00',
    net: '114.00',
    status: 'Paid',
    gameType: 'EuroMillions',
    drawDate: '2026-05-14',
    ticketNum: 'SN-777-111',
    staff: 'Manager',
    notes: 'Winner payout pending'
  },
  {
    id: 'pay-003',
    provider: 'PayPoint',
    biz: 'Zenith Logistics Hub',
    type: 'Bill payment',
    transDate: '2026-05-12',
    transRef: 'PP-111-003',
    gross: '85.00',
    comm: '1.50',
    net: '83.50',
    status: 'Pending',
    billType: 'Electricity',
    custRef: 'ACC-555',
    providerName: 'British Gas',
    notes: 'Customer queried the amount'
  },
  {
    id: 'pay-004',
    provider: 'PayZone',
    biz: 'Main Retail Store',
    type: 'Top-up',
    transDate: '2026-05-13',
    transRef: 'PZ-222-004',
    gross: '20.00',
    comm: '0.40',
    net: '19.60',
    status: 'Paid',
    billType: 'Mobile Top-up',
    custRef: '07700 900000',
    providerName: 'EE',
    notes: 'Standard top-up'
  },
  {
    id: 'pay-005',
    provider: 'Dojo',
    biz: 'Whiterock Retail Ltd',
    type: 'Refund',
    transDate: '2026-05-11',
    transRef: 'DJ-999-005',
    gross: '-55.00',
    comm: '0.00',
    net: '-55.00',
    status: 'Refunded',
    method: 'Card',
    notes: 'Product return - faulty item'
  },
  {
    id: 'pay-006',
    provider: 'Lottery',
    biz: 'Main Retail Store',
    type: 'Scratchcard sale',
    transDate: '2026-05-13',
    transRef: 'LT-888-006',
    gross: '250.00',
    comm: '12.50',
    net: '237.50',
    status: 'Paid',
    gameType: 'Scratchcard',
    ticketNum: 'PACK-444',
    notes: 'Full pack activation'
  },
  {
    id: 'pay-007',
    provider: 'PayPoint',
    biz: 'Logistics Hub',
    type: 'Parcel',
    transDate: '2026-05-13',
    transRef: 'PP-111-007',
    gross: '12.00',
    comm: '1.20',
    net: '10.80',
    status: 'Paid',
    billType: 'Drop-off',
    custRef: 'TRACK-123',
    providerName: 'Amazon / Collect+'
  },
  {
    id: 'pay-008',
    provider: 'SumUp',
    biz: 'Whiterock Retail Ltd',
    type: 'Card Payment',
    transDate: '2026-05-13',
    transRef: 'SU-444-008',
    gross: '15.99',
    comm: '0.27',
    net: '15.72',
    status: 'Paid',
    method: 'Contactless'
  }
];
