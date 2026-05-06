export const BUSINESSES: Record<string, any> = {
  'green-valley-retail': {
    name: 'Green Valley Retail Store',
    category: 'Retail',
    email: 'contact@greenvalley.com',
    phone: '+44 20 1234 5678',
  },
  'alpha-trading': {
    name: 'Alpha Trading Co.',
    category: 'Retail',
    email: 'contact@alphatrading.com',
    phone: '+44 20 7946 0123',
  },
  'beta-logistics': {
    name: 'Beta Logistics Ltd.',
    category: 'Logistics',
    email: 'info@betalogistics.co.uk',
    phone: '+44 161 496 0345',
  },
};

export const ACCOUNTING_RECORDS = [
  {
    name: 'VAT Return Q1 2026',
    category: 'Tax',
    amount: '£5429',
    paymentMethod: 'Bank Transfer',
    reminderDate: '2026-04-10',
    notes: 'Q1 2026 VAT payment processed',
    title: 'Quarterly VAT Payment',
    type: 'VAT',
    status: 'Paid',
    dueDate: '2026-04-15',
    uploadDate: '2026-04-12',
  },
  {
    name: 'Accountant Fee March',
    category: 'Fees',
    amount: '£850',
    paymentMethod: 'Direct Debit',
    reminderDate: '2026-05-01',
    notes: 'Monthly accounting services',
    title: 'Monthly Accounting Services',
    type: 'Professional Services',
    status: 'Pending',
    dueDate: '2026-05-05',
    uploadDate: '2026-04-28',
  },
  {
    name: 'Business Loan Payment',
    category: 'Loan',
    amount: '£1,200',
    paymentMethod: 'Standing Order',
    reminderDate: '2026-05-01',
    notes: 'Monthly loan instalment',
    title: 'Monthly Loan Instalment',
    type: 'Finance',
    status: 'Pending',
    dueDate: '2026-05-01',
    uploadDate: '2026-04-30',
  },
];

export const FLEET_RECORDS = [
  {
    vehicle: 'Mercedes Sprinter Van',
    registration: 'AB12 CDE',
    insurance: '2026-05-15',
    mot: '2026-05-20',
    roadTax: '2026-07-01',
    deliveryDate: '2024-01-15',
    vehicleName: 'Delivery Van 1',
    vehicleNumber: 'AB12 CDE',
    insuranceExpiry: '2026-05-15',
    motDate: '2026-05-20',
    roadTaxDate: '2026-07-01',
    status: 'Active',
    notes: 'Company delivery van – main vehicle',
  },
  {
    vehicle: 'Ford Transit',
    registration: 'XY34 FGH',
    insurance: '2026-05-10',
    mot: '2026-05-25',
    roadTax: '2026-06-15',
    deliveryDate: '2023-08-20',
    vehicleName: 'Delivery Van 2',
    vehicleNumber: 'XY34 FGH',
    insuranceExpiry: '2026-05-10',
    motDate: '2026-05-25',
    roadTaxDate: '2026-06-15',
    status: 'Active',
    notes: 'Secondary delivery vehicle',
  },
  {
    vehicle: 'Vauxhall Vivaro',
    registration: 'LM56 NOP',
    insurance: '2026-08-01',
    mot: '2026-09-10',
    roadTax: '2026-10-01',
    deliveryDate: '2022-11-05',
    vehicleName: 'Delivery Van 3',
    vehicleNumber: 'LM56 NOP',
    insuranceExpiry: '2026-08-01',
    motDate: '2026-09-10',
    roadTaxDate: '2026-10-01',
    status: 'Active',
    notes: 'Backup delivery vehicle',
  },
];

export const INVENTORY_RECORDS = [
  {
    item: 'Premium Tobacco A',
    products: 'Tobacco Products',
    stock: 150,
    supplier: 'SUP-001',
    status: 'In Stock',
    notes: 'Popular brand – high demand',
    itemName: 'Premium Tobacco Brand A',
    category: 'Tobacco',
    stockLevel: 150,
    supplierName: 'Alpha Distributors',
  },
  {
    item: 'Vape Cartridge B',
    products: 'Vaping Products',
    stock: 25,
    supplier: 'SUP-002',
    status: 'Low Stock',
    notes: 'Reorder soon – below minimum',
    itemName: 'Vape Cartridge Type B',
    category: 'Vaping',
    stockLevel: 25,
    supplierName: 'Beta Wholesale',
  },
  {
    item: 'Lighter Pack',
    products: 'Accessories',
    stock: 80,
    supplier: 'SUP-003',
    status: 'In Stock',
    notes: 'Standard disposable lighters',
    itemName: 'Disposable Lighter Pack',
    category: 'Accessories',
    stockLevel: 80,
    supplierName: 'City Supplies',
  },
];

export const SUPPLIER_RECORDS = [
  {
    supplierName: 'Alpha Distributors Ltd',
    supplierId: 'SUP-001',
    contact: 'John Smith',
    contactDetails: 'John Smith – Sales Manager',
    phone: '020 7234 5678',
    email: 'john@alpha.com',
    address: '123 Business Park, London, SW1A 1AA',
    paymentStatus: 'Current',
    paymentTerms: 'Net 30',
    dueDate: '2026-05-15',
    uploadDocs: 'Contract-Alpha.pdf',
    notes: 'Primary tobacco supplier – excellent service',
  },
  {
    supplierName: 'Beta Wholesale Co',
    supplierId: 'SUP-002',
    contact: 'Sarah Jones',
    contactDetails: 'Sarah Jones – Account Manager',
    phone: '020 8765 4321',
    email: 'sarah@beta.com',
    address: '456 Trade Centre, Manchester, M1 2AB',
    paymentStatus: 'Pending',
    paymentTerms: 'Net 15',
    dueDate: '2026-05-10',
    uploadDocs: 'Agreement-Beta.pdf',
    notes: 'Vaping products specialist',
  },
  {
    supplierName: 'City Supplies Limited',
    supplierId: 'SUP-003',
    contact: 'Mike Brown',
    contactDetails: 'Mike Brown – Director',
    phone: '020 9876 5432',
    email: 'mike@citysupplies.com',
    address: '789 Commerce Road, Birmingham, B1 3CD',
    paymentStatus: 'Current',
    paymentTerms: 'Net 30',
    dueDate: '2026-06-01',
    uploadDocs: 'Contract-City.pdf',
    notes: 'Accessories and general supplies',
  },
];

export const LEGAL_RECORDS = [
  {
    type: 'Licence',
    business: 'Main Store',
    issueDate: '2025-01-15',
    uploadFile: 'Licence-Main-Store.pdf',
    notes: 'Premises licence for alcohol sales – valid until 2027',
    documentType: 'Premises Licence',
    businessName: 'Main Store – High Street',
    expiryDate: '2027-01-15',
    status: 'Valid',
  },
  {
    type: 'Food Safety Cert',
    business: 'Main Store',
    issueDate: '2025-06-01',
    uploadFile: 'Food-Safety-Cert.pdf',
    notes: 'Level 2 Food Hygiene – renewal required soon',
    documentType: 'Food Safety Certificate',
    businessName: 'Main Store – High Street',
    expiryDate: '2026-06-01',
    status: 'Expiring',
  },
  {
    type: 'Change of DPS',
    business: 'Branch 2',
    issueDate: '2024-12-01',
    uploadFile: 'DPS-Change-2024.pdf',
    notes: '',
    documentType: 'DPS Change Application',
    businessName: 'Branch 2 – Market Road',
    expiryDate: '2026-03-01',
    status: 'Expired',
  },
];

export const PROPERTY_RECORDS = [
  {
    type: 'Utility',
    property: 'Main Store',
    address: '10 High Street, London, SW1A 1AA',
    infoName: 'Gas Bill March 2026',
    priority: 'Medium',
    status: 'Open',
    notes: 'Monthly gas bill payment due',
    requestType: 'Utility Bill',
    propertyName: 'Main Store – High Street',
    description: 'Gas Bill – March 2026',
    assignedTo: 'Finance Team',
  },
  {
    type: 'Maintenance',
    property: 'Branch 2',
    address: '25 Market Road, Manchester, M1 2AB',
    infoName: 'HVAC System Repair',
    priority: 'High',
    status: 'In Progress',
    notes: 'Air conditioning not working – technician scheduled',
    requestType: 'Maintenance Request',
    propertyName: 'Branch 2 – Market Road',
    description: 'HVAC Repair – Air Conditioning',
    assignedTo: 'Maintenance Team',
  },
  {
    type: 'Lease',
    property: 'Warehouse',
    address: '5 Industrial Estate, Leeds, LS1 4EF',
    infoName: 'Annual Lease Renewal',
    priority: 'Low',
    status: 'Pending',
    notes: 'Lease renewal due in 3 months',
    requestType: 'Lease Renewal',
    propertyName: 'Warehouse – Leeds',
    description: 'Annual Lease Renewal 2026',
    assignedTo: 'Legal Team',
  },
];

export const BUSINESS_ENTITIES = [
  { name: 'Main Retail Store', num: 'CH-98765432', cat: 'Retail', hq: 'London, UK' },
  { name: 'Logistics Hub', num: 'CH-11223344', cat: 'Logistics', hq: 'Manchester, UK' },
];

export const BUSINESS_STRUCTURES = [
  { name: 'Whiterock Retail Ltd', crn: '12345678', manager: 'John Smith', sic: '47110', due: '2026-12-15' },
  { name: 'Zenith Logistics Hub', crn: '87654321', manager: 'Sarah Jenkins', sic: '52101', due: '2026-11-20' },
];

export const INVENTORY_ALERTS = [
  { id: 1, name: 'Sugar 1kg', status: 'Low Stock (5 left)', level: 'low' },
  { id: 2, name: 'Notebook A4', status: 'Out of Stock', level: 'out' },
];
export const INVENTORY_STOCK = [
  { name: 'Milk Packet 1L', cat: 'Food & Beverages', stock: '150', status: 'Active' },
];
export const INVENTORY_MOVES = [
  { date: '2026-05-05', item: 'Milk Packet 1L', type: 'IN', qty: '50', notes: 'Monthly replenishment' },
];

export const FLEET_REMINDERS = [
  { id: 1, vehicle: 'CAR 1', type: 'Insurance', status: 'Expiring in 7 days', level: 'soon' },
  { id: 2, vehicle: 'CAR 1', type: 'MOT', status: 'Expired', level: 'expired' },
  { id: 3, vehicle: 'VAN 2', type: 'Road Tax', status: 'Expiring in 12 days', level: 'soon' },
];
export const FLEET_VEHICLES = [
  { name: 'CAR 1', plate: 'ABC-1234', biz: 'Main Retail Store', mot: '2026-04-10', ins: '2026-05-12', tax: '2026-12-01', status: 'Active' },
];
export const FLEET_DELIVERIES = [
  { date: '2026-04-29', v: 'CAR 1', vNum: 'ABC-1234', addr: 'Central Warehouse, London', contact: 'John Doe | +44 7700 900077', notes: 'Urgent delivery', status: 'Scheduled' },
];
export const FLEET_PARCELS = [
  { provider: 'DHL Express', v: 'CAR 1', vNum: 'ABC-1234', area: 'City Central Area', contact: 'Sarah Jones | +44 20 7946 0001', status: 'Active' },
];

export const ACCOUNTING_HISTORY = [
  { date: '2026-04-01', title: 'HQ Office Rent', sub: 'Rent (Apr 2026 - Mar 2027)', category: 'Expense', amount: '-$2,500.00', status: 'Paid' },
];
export const ACCOUNTING_INVOICES = [
  { num: 'INV-2026-001', client: 'Alpha Trading Co.', amount: '$5,000.00', due: '2026-04-30', status: 'Paid' },
];
export const ACCOUNTING_BANKS = [
  { bank: 'Business Central Bank', acc: 'LAKSHAN RAMAWICKRAMA ERP', num: '88776655', sort: '00-11-22', type: 'Business Current', status: 'Active' },
];
export const ACCOUNTING_LOANS = [
  { loan: 'SME Growth Loan', lender: 'BC Bank', total: '$50,000', os: '$32,450', monthly: '$1,200', rate: '5.2%', status: 'Active' },
];
export const ACCOUNTING_DOJO = [
  { date: '2026-04-30', amount: '$1,000.00', fee: '$17.50', net: '$982.50', status: 'Paid' },
];

export const ACCOUNTING_INSURANCE = [
  { type: 'Public Liability', provider: 'Aviva Business', policy: 'POL-882233', premium: '$1,200/yr', expiry: '2026-12-15', status: 'Active' },
  { type: 'Employer Liability', provider: 'AXA Insurance', policy: 'AXA-990011', premium: '$850/yr', expiry: '2026-11-20', status: 'Active' },
];

export const ACCOUNTING_VAT = [
  { type: 'VAT Return Q1', period: 'Jan - Mar 2026', amount: '$4,250.00', date: '2026-04-10', status: 'Paid' },
  { type: 'VAT Return Q2', period: 'Apr - Jun 2026', amount: '$3,800.00', date: '2026-07-10', status: 'Pending' },
];

export const USER_SYSTEM_MAP = [
  { name: 'Dashboard', sub: [] },
  { name: 'Business Management', sub: ['Companies House Structure', 'Basic Details'] },
  { name: 'User Management', sub: ['User Registry', 'Role Permissions'] },
  { name: 'Fleet Management', sub: ['Vehicle Registry', 'Driver Management', 'Fuel Logs', 'Maintenance'] },
  { name: 'Inventory Management', sub: ['Stock Levels', 'Warehouse Tracking', 'Purchase Orders'] },
  { name: 'Accounting', sub: ['Financial Records', 'Bank Details', 'Loans', 'Insurance', 'VAT / Tax'] },
  { name: 'Suppliers', sub: ['Supplier Registry', 'Payment Terms'] },
  { name: 'Legal & Compliance', sub: ['Certificates', 'Policy Documents', 'Audits'] },
  { name: 'Property Management', sub: ['Asset Registry', 'Maintenance Requests', 'Rentals'] },
  { name: 'Reports', sub: ['Profit & Loss', 'Sales Reports', 'Bank Reports', 'Tax Reports'] }
];
export const USER_REGISTRY = [
  { name: 'John Smith', email: 'john@example.com', roles: 'Super Admin', scope: 'All Entities', access: 'All Modules', status: 'Active' },
  { name: 'Jane Doe', email: 'jane@example.com', roles: 'Manager', scope: 'Main Retail Store', access: 'Inventory, Fleet', status: 'Active' },
];

export const LEGAL_DOCS = [
  { title: 'Trade License', type: 'License', auth: 'City Council', file: 'license_2024.pdf', status: 'Active' },
  { title: 'GDPR Compliance', type: 'Permit', auth: 'ICO Office', file: 'gdpr_cert.pdf', status: 'Expired' },
];

export const SUPPLIER_DIRECTORY = [
  { id: 'SUP-101', name: 'Global Logistics Partners', category: 'Services', email: 'contact@global.com', phone: '+44 20 7123 4567', status: 'Active' },
];

export const PURCHASE_ORDERS = [
  { num: 'PO-2026-501', supplier: 'Prime Office Supplies', product: 'Paper Reams (A4)', qty: '50', amount: '$450.00', due: '2026-05-15', status: 'Pending' },
];

export const PROPERTY_ASSETS = [
  { name: 'Main Office HVAC', sub: 'Floor 1, West Wing', type: 'HVAC', doc: 'hvac_manual.pdf', person: 'Robert Chen', contact: '+1 234-567-890', status: 'Operational' },
];

export const PROPERTY_REQUESTS = [
  { date: '2026-04-29', issue: 'Leak in Bathroom', asset: 'Floor 2 Restroom', tech: 'Mike Plumb', prio: 'Urgent', status: 'In Progress' },
];

export const PROPERTY_WASTE = [
  { date: '2026-05-01', contact: 'John Doe', phone: '+1 234-567-888', addr: 'Building A, Service Entrance', status: 'Scheduled' },
];

export const PROPERTY_LICENCES = [
  { type: 'Trade Licence 2026', biz: 'Property Management Div', auth: 'City Planning Dept', expiry: '2027-05-20', issue: '2026-05-20', status: 'Active' },
];

// ─── Dashboard Widget Data ─────────────────────────────────────────────────────

export const DASHBOARD_BUSINESSES = [
  { id: 1, name: 'Alpha Trading Co.', slug: 'alpha-trading', inc: '$125,400', exp: '$42,100', skus: '1,240', flt: 12, st: 'Active' },
  { id: 2, name: 'Beta Logistics Ltd.', slug: 'beta-logistics', inc: '$84,200', exp: '$31,500', skus: '450', flt: 24, st: 'Active' },
  { id: 3, name: 'Whiterock Retail Ltd.', slug: 'whiterock-retail', inc: '$210,500', exp: '$98,400', skus: '3,800', flt: 4, st: 'Active' },
  { id: 4, name: 'Zenith Logistics Hub', slug: 'zenith-logistics', inc: '$15,000', exp: '$2,000', skus: '120', flt: 0, st: 'Pending' },
  { id: 5, name: 'Prime Supplies UK', slug: 'prime-supplies', inc: '$58,000', exp: '$12,800', skus: '6,200', flt: 2, st: 'Active' },
  { id: 6, name: 'Global Logistics Partners', slug: 'global-logistics', inc: '$92,300', exp: '$28,500', skus: '1,100', flt: 35, st: 'Active' },
  { id: 7, name: 'Smart Solutions Ltd.', slug: 'smart-solutions', inc: '$45,000', exp: '$12,000', skus: '850', flt: 3, st: 'Active' },
  { id: 8, name: 'Ocean View Exports', slug: 'ocean-view', inc: '$112,000', exp: '$45,600', skus: '2,400', flt: 8, st: 'Active' },
  { id: 9, name: 'TechConnect Inc.', slug: 'techconnect', inc: '$38,500', exp: '$15,200', skus: '320', flt: 1, st: 'Suspended' },
  { id: 10, name: 'Consulting Ltd.', slug: 'consulting-ltd', inc: '$12,400', exp: '$4,100', skus: '15', flt: 0, st: 'Active' },
];

export const DASHBOARD_FLEET = [
  { v: 'CAR 1', p: 'ABC-1234', i: '2026-06-15', s: 'Active' },
  { v: 'VAN 2', p: 'DEF-5678', i: '2026-05-03', s: 'Active' },
  { v: 'TRK-007', p: 'GHI-9012', i: '2026-05-06', s: 'Maint' },
  { v: 'CAR 2', p: 'WP-BC-5678', i: '2026-12-01', s: 'Active' },
  { v: 'VAN-002', p: 'JKL-3456', i: '2026-05-04', s: 'Active' },
  { v: 'TRK-010', p: 'MNO-7890', i: '2026-07-12', s: 'Active' },
  { v: 'VAN-005', p: 'PQR-1234', i: '2026-05-20', s: 'Repair' },
  { v: 'CAR-003', p: 'STU-5678', i: '2026-11-30', s: 'Active' },
  { v: 'TRK-022', p: 'VWX-9012', i: '2026-05-01', s: 'Impound' },
  { v: 'VAN-011', p: 'YZA-3456', i: '2026-08-15', s: 'Active' },
];

export const DASHBOARD_NOTES = [
  'Renew trade licence before May 20 — contact City Planning Dept',
  'TRK-007 and VAN-002 insurance both expiring this month — call broker',
  'Follow up with Global Logistics regarding the pending PO-501 shipment',
  'Prepare Q2 financial summary for the board meeting next Tuesday',
  'Verify inventory levels for high-demand SKUs in Whiterock Retail',
];

export const DASHBOARD_VAT = [
  { type: 'Corporation Tax 2025', period: 'Jan–Dec 2025', amount: '$15,450', status: 'Paid' },
  { type: 'VAT Q1 2026', period: 'Jan–Mar 2026', amount: '$8,320', status: 'Filed' },
  { type: 'VAT Q2 2026', period: 'Apr–Jun 2026', amount: '$0', status: 'Draft' },
];

export const DASHBOARD_TODOS = [
  { t: 'Renew TRK-007 insurance', d: true },
  { t: 'File VAT Q2 2026', d: false },
  { t: 'Review supplier PO-2026-503 overdue', d: false },
  { t: 'Update GDPR compliance cert', d: true },
];

export const DASHBOARD_PASSWORDS = [
  { s: 'HMRC Online', u: 'admin@businesscentral.com' },
  { s: 'Companies House', u: 'john.smith@bc.com' },
  { s: 'Allianz Portal', u: 'insurance@bc.com' },
];

export const DASHBOARD_SUPPLIER_PAYMENTS = [
  { p: 'PO-2026-501', s: 'Prime Office', a: '$450', st: 'Pending' },
  { p: 'PO-2026-502', s: 'Global Logistics', a: '$1,800', st: 'Paid' },
  { p: 'PO-2026-503', s: 'TechConnect', a: '$2,750', st: 'Overdue' },
];

export const DASHBOARD_SALES = [
  { i: 'INV-2026-001', c: 'Alpha Trading', a: '$5,000', s: 'Paid' },
  { i: 'INV-2026-002', c: 'Consulting Ltd', a: '$1,200', s: 'Sent' },
  { i: 'INV-2026-003', c: 'Beta Logistics', a: '$3,800', s: 'Overdue' },
];

export const DASHBOARD_BANKS = [
  { b: 'BC Bank', n: 'LAKSHAN RAMAWICKRAMA', bl: '$142,350' },
  { b: 'Barclays', n: 'Alpha Trading Co.', bl: '$58,200' },
  { b: 'HSBC', n: 'Beta Logistics Ltd.', bl: '$23,750' },
];

export const DASHBOARD_MAINTENANCE = [
  { a: 'Office HVAC', p: 'Urgent', s: 'Pending' },
  { a: 'Elevator A', p: 'Medium', s: 'Scheduled' },
  { a: 'Van 2', p: 'Urgent', s: 'In Progress' },
];

export const DASHBOARD_LOW_STOCK = [
  { i: 'Sugar 1kg', c: 5, s: 'Reorder' },
  { i: 'Notebook A4', c: 0, s: 'Out of Stock' },
  { i: 'Milk 1L', c: 150, s: 'Good' },
];

export const DASHBOARD_ACTIVITY = [
  { t: '2m', a: 'Admin updated VAT Q1 to Filed.' },
  { t: '15m', a: 'John created user Sarah.' },
  { t: '1h', a: 'Backup successful.' },
];

export const DASHBOARD_RENEWALS = [
  { e: 'Alpha Trading', d: '3 Days', u: true },
  { e: 'TRK-007 (Fleet)', d: '12 Days', u: false },
  { e: 'Main Hub Retail', d: '28 Days', u: false },
];

export const DASHBOARD_PL = {
  income: '$482,800',
  expenses: '$237,585',
  grossProfit: '$245,215',
  tax: '$49,043',
  netProfit: '$196,172',
};

export const DASHBOARD_EMAILS = [
  { email: 'admin@company.com', label: 'Primary Account', status: 'Connected', type: 'primary' },
  { email: 'support@company.com', label: 'Support Inbox', status: 'Connected', type: 'support' },
];

// ─── Additional Consolidated Mock Data ───────────────────────────────────────

export const SYSTEM_CREDENTIALS = [
  {
    id: 'cred-1',
    service: 'Till Access',
    account: 'Till-Main-01',
    status: 'Active',
    support: '+94 11 234 5678',
    password: 'TILL_PASSWORD_123',
  },
  {
    id: 'cred-2',
    service: 'PayPoint Portal',
    account: 'admin_bp_retail',
    status: 'Active',
    support: '+44 20 8765 4321',
    password: 'PAYPOINT_LOGIN_99',
  },
];

export const SYSTEM_ALERTS = [
  { label: 'PayPoint Portal', msg: 'Password expires in 5 days', type: 'soon' },
  { label: 'Lottery Terminal', msg: 'Maintenance Scheduled', type: 'info' },
];

export const ACCOUNTING_SUMMARY = {
  income: '$12,450.00',
  expenses: '$8,320.00',
};

export const REPORT_STATS = [
  { title: 'Total Revenue', value: '$124,500', trend: '+12.5%', isUp: true },
  { title: 'Operating Costs', value: '$42,300', trend: '-3.2%', isUp: false },
  { title: 'Active Inventories', value: '1,204', trend: '+40', isUp: true },
  { title: 'Fleet Efficiency', value: '94%', trend: '+2.1%', isUp: true },
];

export const LEGAL_SUMMARY = {
  expiredDocs: 1,
};

export const SUPPLIER_METADATA = {
  nextId: 'SUP-104',
};

export const LOGIN_CREDENTIALS = {
  superAdmin: {
    email: 'superadmin@central.com',
    username: 'superadmin',
    password: 'superadmin123',
    altPassword: 'admin123',
  },
  companyAdmin: {
    email: 'admin@central.com',
    username: 'admin',
    password: 'admin123',
  },
};

export const REPORT_TEMPLATES = [
  { label: 'Monthly Financial Audit', format: 'PDF' },
  { label: 'Inventory Stock Level', format: 'XLSX' },
  { label: 'Fleet Maintenance Log', format: 'CSV' },
  { label: 'User Access Report', format: 'JSON' },
];

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
