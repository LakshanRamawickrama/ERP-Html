import os
import django
import sys
from datetime import datetime, timedelta
from django.utils import timezone

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
# Monkeypatch for django-mongodb-backend compatibility with newer pymongo
from pymongo import MongoClient
if not hasattr(MongoClient, '_options'):
    def _get_options(self):
        return getattr(self, '_MongoClient__options', None) or getattr(self, '_options_fallback', None)
    def _set_options(self, val):
        self._options_fallback = val
    MongoClient._options = property(_get_options, _set_options)

django.setup()

from apps.business.models import BusinessEntity, CompanyStructure
from apps.fleet.models import Vehicle, Delivery, ParcelPartner, Parcel
from apps.inventory.models import Product, StockMovement
from apps.accounting.models import Transaction, Invoice, BankAccount, Loan, InsurancePolicy, VATRecord, PaymentServiceRecord
from apps.legal.models import LegalDocument
from apps.reminders.models import Reminder
from apps.property.models import Asset, MaintenanceRequest, WasteCollection, PropertyLicence
from apps.users.models import StaffProfile
from apps.suppliers.models import Supplier, PurchaseOrder
from apps.system.models import SystemCredential, SystemAlert, ConnectedEmail, Note

def seed_data():
    from django.conf import settings
    db_config = settings.DATABASES['default']
    host = db_config.get('HOST') or db_config.get('CLIENT', {}).get('host', 'unknown')
    
    clean_host = host.split('@')[-1] if '@' in host else host
    print(f"Target Database Host: {clean_host}")
    print("Seeding MongoDB Database with Comprehensive ERP Data from db.ts...")
    
    SUPER_ADMIN_EMAIL = 'superadmin@erp.com'
    BIZ_1 = 'Main Retail Store'
    BIZ_2 = 'Logistics Hub'
    BIZ_3 = 'Whiterock Retail Ltd'
    BIZ_4 = 'Zenith Logistics Hub'
    BIZ_5 = 'Holding Company'
    BIZ_ALL = 'All Entities'
    
    # 1. Business Entities
    BusinessEntity.objects.all().delete()
    BusinessEntity.objects.create(
        name=BIZ_1, company_number='CH-0001', category='Retail',
        hq_location='123 High Street, London, EC1A 1BB',
        tax_id='GB-VAT-123456789', currency='GBP', timezone='Europe/London',
        fiscal_year='April - March', status='Active',
        phone='020 7946 0001', email='info@mainretail.co.uk',
        website='https://www.mainretail.co.uk',
        created_by=SUPER_ADMIN_EMAIL
    )
    BusinessEntity.objects.create(
        name=BIZ_2, company_number='CH-0002', category='Service Provider',
        hq_location='45 Quay Street, Manchester, M3 3EY',
        tax_id='GB-VAT-987654321', currency='GBP', timezone='Europe/London',
        fiscal_year='January - December', status='Active',
        phone='0161 496 0002', email='ops@logisticshub.co.uk',
        website='https://www.logisticshub.co.uk',
        created_by=SUPER_ADMIN_EMAIL
    )
    BusinessEntity.objects.create(
        name=BIZ_3, company_number='CH-0003', category='Retail',
        hq_location='78 Broadmead, Bristol, BS1 3DG',
        tax_id='GB-VAT-112233445', currency='GBP', timezone='Europe/London',
        fiscal_year='April - March', status='Active',
        phone='0117 920 0003', email='contact@whiterockretail.co.uk',
        website='https://www.whiterockretail.co.uk',
        created_by=SUPER_ADMIN_EMAIL
    )
    BusinessEntity.objects.create(
        name=BIZ_4, company_number='CH-0004', category='Logistics',
        hq_location='12 Broad Street, Birmingham, B1 2HF',
        tax_id='GB-VAT-556677889', currency='GBP', timezone='Europe/London',
        fiscal_year='January - December', status='Active',
        phone='0121 230 0004', email='dispatch@zenithlogistics.co.uk',
        website='https://www.zenithlogistics.co.uk',
        created_by=SUPER_ADMIN_EMAIL
    )
    BusinessEntity.objects.create(
        name=BIZ_5, company_number='CH-0005', category='Holding Company',
        hq_location='One Canada Square, London, E14 5AB',
        tax_id='GB-VAT-998877665', currency='GBP', timezone='Europe/London',
        fiscal_year='April - March', status='Active',
        phone='020 7946 0005', email='group@holdingco.co.uk',
        website='https://www.holdingco.co.uk',
        created_by=SUPER_ADMIN_EMAIL
    )

    CompanyStructure.objects.all().delete()
    CompanyStructure.objects.create(
        name='Main Retail HQ', business=BIZ_1, crn='CRN-001',
        filing_due=timezone.now().date() + timedelta(days=90),
        manager='John Smith', status='Active', sic_code='47190',
        address='123 High Street, London, EC1A 1BB',
        location='London', house_code='LON-001',
        contact_number='020 7946 0001',
        opening_hours='Mon-Sat 08:00-20:00, Sun 10:00-18:00',
        created_by=SUPER_ADMIN_EMAIL
    )
    CompanyStructure.objects.create(
        name='Northern Logistics Hub', business=BIZ_2, crn='CRN-002',
        filing_due=timezone.now().date() + timedelta(days=120),
        manager='Sarah Wilson', status='Active', sic_code='49410',
        address='45 Quay Street, Manchester, M3 3EY',
        location='Manchester', house_code='MCR-002',
        contact_number='0161 496 0002',
        opening_hours='Mon-Fri 07:00-18:00',
        created_by=SUPER_ADMIN_EMAIL
    )
    CompanyStructure.objects.create(
        name='Whiterock Branch', business=BIZ_3, crn='CRN-003',
        filing_due=timezone.now().date() + timedelta(days=60),
        manager='Mike Brown', status='Active', sic_code='47190',
        address='78 Broadmead, Bristol, BS1 3DG',
        location='Bristol', house_code='BST-003',
        contact_number='0117 920 0003',
        opening_hours='Mon-Sat 09:00-19:00, Sun 11:00-17:00',
        created_by=SUPER_ADMIN_EMAIL
    )
    CompanyStructure.objects.create(
        name='Zenith Birmingham Depot', business=BIZ_4, crn='CRN-004',
        filing_due=timezone.now().date() + timedelta(days=150),
        manager='Emily Clarke', status='Active', sic_code='52100',
        address='12 Broad Street, Birmingham, B1 2HF',
        location='Birmingham', house_code='BHM-004',
        contact_number='0121 230 0004',
        opening_hours='Mon-Fri 06:00-22:00',
        created_by=SUPER_ADMIN_EMAIL
    )
    CompanyStructure.objects.create(
        name='Holding Company HQ', business=BIZ_5, crn='CRN-005',
        filing_due=timezone.now().date() + timedelta(days=200),
        manager='David Harrison', status='Active', sic_code='64205',
        address='One Canada Square, London, E14 5AB',
        location='London (Canary Wharf)', house_code='CW-005',
        contact_number='020 7946 0005',
        opening_hours='Mon-Fri 09:00-17:30',
        created_by=SUPER_ADMIN_EMAIL
    )

    # 2. Legal Documents
    LegalDocument.objects.all().delete()
    LegalDocument.objects.create(title='Alcohol License', type='License Applications', expiry_date='2027-12-31', status='Active', authority='Local Council', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    LegalDocument.objects.create(title='Public Liability Certificate', type='Temp Records', expiry_date='2026-12-31', status='Active', authority='Insurance Provider', business=BIZ_ALL, created_by=SUPER_ADMIN_EMAIL)
    LegalDocument.objects.create(title='Trade License', type='License', status='Active', expiry_date='2027-05-20', authority='City Council', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    # 3. Fleet
    Vehicle.objects.all().delete()
    v1 = Vehicle.objects.create(name='CAR 1', plate_number='ABC-1234', business=BIZ_2, status='Active', fuel_type='Petrol', created_by=SUPER_ADMIN_EMAIL)
    v2 = Vehicle.objects.create(name='VAN 2', plate_number='XYZ-5678', business=BIZ_2, status='In Service', fuel_type='Diesel', created_by=SUPER_ADMIN_EMAIL)
    
    Delivery.objects.all().delete()
    Delivery.objects.create(vehicle=v1, address='Birmingham', contact_person='Driver A', contact_number='0123456789', status='In Transit', business=BIZ_2, created_by=SUPER_ADMIN_EMAIL)
    Delivery.objects.create(vehicle=v2, address='Liverpool', contact_person='Driver B', contact_number='0123456789', status='Delivered', business=BIZ_2, created_by=SUPER_ADMIN_EMAIL)
    
    Parcel.objects.all().delete()
    Parcel.objects.create(reference='PC-123', client_name='Alice Johnson', status='Ready for Collection', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    ParcelPartner.objects.all().delete()
    ParcelPartner.objects.create(provider='DPD Logistics', vehicle=v1, service_date='2026-05-10', area='London Central', contact_name='Alice Cooper', contact_number='0123456789', status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    # 4. Inventory
    Product.objects.all().delete()
    Product.objects.create(name='Milk Packet 1L', category='Food & Beverages', quantity=150, min_stock=50, price=1.20, business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    Product.objects.create(name='Sugar 1kg', category='Groceries', quantity=200, min_stock=30, price=0.85, business=BIZ_3, created_by=SUPER_ADMIN_EMAIL)

    # 5. Accounting - Transactions (Financial Records)
    Transaction.objects.all().delete()
    Transaction.objects.create(title='Monthly Rent - Main Office', category='Rent', type='Expense', amount=2500.00, date='2026-05-13', status='Paid', business=BIZ_1, payment_method='Bank Transfer', reference_number='RENT-MAY-26', notes='Monthly lease for High Street premises', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Stock Purchase - Prime Logistics', category='Supplier Payments', type='Expense', amount=450.50, date='2026-05-12', status='Pending', business=BIZ_2, payment_method='Credit Card', reference_number='PO-77889', notes='Bulk order for Manchester warehouse', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Business Mortgage Repayment', category='Mortgage', type='Expense', amount=2450.00, date='2026-05-10', status='Paid', business=BIZ_5, payment_method='Direct Debit', reference_number='MORT-771', notes='Monthly mortgage instalment', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Annual Liability Insurance', category='Insurance', type='Expense', amount=850.00, date='2026-05-08', status='Paid', business=BIZ_ALL, payment_method='Bank Transfer', notes='Annual premium for public liability cover', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Q1 VAT Submission', category='VAT / Tax', type='Expense', amount=3420.15, date='2026-05-13', status='Pending', business=BIZ_1, payment_method='HMRC Portal', reference_number='VAT-Q1-2026', notes='Quarterly VAT return', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Consultancy Fees - Q2', category='Accountant Fees', type='Expense', amount=1200.00, date='2026-05-11', status='Paid', business=BIZ_5, payment_method='Bank Transfer', reference_number='ACC-Q2-26', notes='Quarterly accountancy retainer', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Utility Bill - Manchester Hub', category='Bank Charges', type='Expense', amount=85.20, date='2026-05-09', status='Paid', business=BIZ_2, payment_method='Direct Debit', reference_number='UTL-MCR-05', notes='Gas and electric combined bill', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Employee Salary - May 2026', category='Wages', type='Expense', amount=4800.00, date='2026-05-01', status='Paid', business=BIZ_1, payment_method='Bank Transfer', reference_number='SAL-MAY-001', notes='Monthly payroll run', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='POS Revenue - Week 19', category='Sales Revenue', type='Income', amount=6750.00, date='2026-05-11', status='Paid', business=BIZ_3, payment_method='Card Terminal', reference_number='REV-W19-BR', notes='Weekly POS takings from Bristol store', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Fuel Expense - Fleet', category='Transport', type='Expense', amount=320.00, date='2026-05-07', status='Paid', business=BIZ_4, payment_method='Fuel Card', reference_number='FUEL-MAY-04', notes='Weekly fleet fuel costs', created_by=SUPER_ADMIN_EMAIL)

    # 5b. Invoices
    Invoice.objects.all().delete()
    Invoice.objects.create(number='INV-2026-001', client='Global Supplies Ltd', amount=850.00, invoice_date='2026-05-10', due_date='2026-05-24', status='Sent', invoice_type='Service', payment_method='Bank Transfer', reference_number='REF-GS-001', business=BIZ_1, notes='Monthly consulting retainer', created_by=SUPER_ADMIN_EMAIL)
    Invoice.objects.create(number='INV-2026-002', client='Prime Office Supplies', amount=120.50, invoice_date='2026-05-12', due_date='2026-05-26', status='Paid', invoice_type='Product', payment_method='Card', reference_number='REF-POS-002', business=BIZ_1, notes='Stationery and printer cartridges', created_by=SUPER_ADMIN_EMAIL)
    Invoice.objects.create(number='INV-2026-003', client='Zenith Transport Co', amount=3200.00, invoice_date='2026-05-05', due_date='2026-05-19', status='Overdue', invoice_type='Service', payment_method='Bank Transfer', reference_number='REF-ZT-003', business=BIZ_4, notes='Cross-country freight charges', created_by=SUPER_ADMIN_EMAIL)
    Invoice.objects.create(number='INV-2026-004', client='Whiterock Wholesale', amount=1580.00, invoice_date='2026-05-08', due_date='2026-06-08', status='Pending', invoice_type='Product', payment_method='Credit Card', reference_number='REF-WW-004', business=BIZ_3, notes='Bulk FMCG goods for retail', created_by=SUPER_ADMIN_EMAIL)
    Invoice.objects.create(number='INV-2026-005', client='Harrison & Partners', amount=2400.00, invoice_date='2026-04-28', due_date='2026-05-28', status='Draft', invoice_type='Service', payment_method='Bank Transfer', reference_number='REF-HP-005', business=BIZ_5, notes='Legal advisory services', created_by=SUPER_ADMIN_EMAIL)

    # 5c. Bank Accounts
    BankAccount.objects.all().delete()
    BankAccount.objects.create(bank_name='Barclays', account_name='Main Business Current', account_number='****5678', sort_code='20-30-40', iban='GB29 BARC 2030 4012 3456 78', account_type='Business Current', status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    BankAccount.objects.create(bank_name='HSBC', account_name='Business Savings', account_number='****1122', sort_code='40-50-60', iban='GB82 HSBC 4050 6098 7611 22', account_type='Business Savings', status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    BankAccount.objects.create(bank_name='Lloyds', account_name='Logistics Ops Account', account_number='****3344', sort_code='30-80-12', iban='GB55 LOYD 3080 1209 8733 44', account_type='Business Current', status='Active', business=BIZ_2, created_by=SUPER_ADMIN_EMAIL)
    BankAccount.objects.create(bank_name='NatWest', account_name='Whiterock Trading', account_number='****7788', sort_code='60-10-22', iban='GB41 NWBK 6010 2211 2277 88', account_type='Business Current', status='Active', business=BIZ_3, created_by=SUPER_ADMIN_EMAIL)
    BankAccount.objects.create(bank_name='Starling', account_name='Zenith Fleet Card', account_number='****9900', sort_code='60-83-71', iban='GB12 STRG 6083 7100 1199 00', account_type='Business Current', status='Active', business=BIZ_4, created_by=SUPER_ADMIN_EMAIL)

    # 5d. Loans
    Loan.objects.all().delete()
    Loan.objects.create(name='Equipment Finance', lender='NatWest Business', total_amount=25000.00, outstanding_amount=12450.00, monthly_payment=450.00, interest_rate=5.2, purpose='Shop fit-out and refrigeration', start_date='2025-01-01', end_date='2030-01-01', next_payment_date='2026-06-01', reminder_days=7, status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    Loan.objects.create(name='Commercial Vehicle Lease', lender='Close Brothers', total_amount=48000.00, outstanding_amount=32000.00, monthly_payment=800.00, interest_rate=4.8, purpose='Fleet expansion - 2 new vans', start_date='2025-06-01', end_date='2030-06-01', next_payment_date='2026-06-01', reminder_days=14, status='Active', business=BIZ_2, created_by=SUPER_ADMIN_EMAIL)
    Loan.objects.create(name='Premises Renovation Loan', lender='Barclays Business', total_amount=75000.00, outstanding_amount=68500.00, monthly_payment=1250.00, interest_rate=6.1, purpose='Bristol store refurbishment', start_date='2026-01-15', end_date='2031-01-15', next_payment_date='2026-06-15', reminder_days=7, status='Active', business=BIZ_3, created_by=SUPER_ADMIN_EMAIL)

    # 5e. Insurance Policies
    InsurancePolicy.objects.all().delete()
    InsurancePolicy.objects.create(type='Public Liability', provider='AXA Business', policy_number='AXA-PL-44210', premium=680.00, coverage_amount=5000000.00, asset_details='All business premises and public areas', contact_info='0800 169 5656', start_date='2026-01-01', expiry_date='2027-01-01', reminder_days=30, status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    InsurancePolicy.objects.create(type='Employers Liability', provider='Aviva', policy_number='AVV-EL-88901', premium=520.00, coverage_amount=10000000.00, asset_details='All employed staff across entities', contact_info='0800 068 6800', start_date='2026-03-01', expiry_date='2027-03-01', reminder_days=30, status='Active', business=BIZ_ALL, created_by=SUPER_ADMIN_EMAIL)
    InsurancePolicy.objects.create(type='Vehicle Insurance', provider='Direct Line Business', policy_number='DLB-VEH-55123', premium=1450.00, coverage_amount=250000.00, asset_details='CAR 1 (ABC-1234), VAN 2 (XYZ-5678)', contact_info='0345 246 3761', start_date='2026-02-01', expiry_date='2027-02-01', reminder_days=30, status='Active', business=BIZ_2, created_by=SUPER_ADMIN_EMAIL)
    InsurancePolicy.objects.create(type='Property / Building', provider='Zurich', policy_number='ZUR-PROP-33210', premium=890.00, coverage_amount=2000000.00, asset_details='78 Broadmead, Bristol BS1 3DG', contact_info='0800 232 1903', start_date='2025-11-01', expiry_date='2026-11-01', reminder_days=60, status='Active', business=BIZ_3, created_by=SUPER_ADMIN_EMAIL)
    InsurancePolicy.objects.create(type='Professional Indemnity', provider='Hiscox', policy_number='HIS-PI-8877', premium=45.00, coverage_amount=500000.00, asset_details='Business operations and advisory services', contact_info='0800 840 0033', start_date='2026-01-15', expiry_date='2027-01-15', reminder_days=30, status='Active', business=BIZ_5, created_by=SUPER_ADMIN_EMAIL)
    InsurancePolicy.objects.create(type='Cyber Insurance', provider='CFC Underwriting', policy_number='CFC-CYB-10299', premium=320.00, coverage_amount=1000000.00, asset_details='IT infrastructure, POS systems, customer data', contact_info='020 7220 8500', start_date='2026-04-01', expiry_date='2027-04-01', reminder_days=30, status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    # 5f. VAT / Tax Records
    VATRecord.objects.all().delete()
    VATRecord.objects.create(type='VAT Q1 2026', period_start='2026-01-01', period_end='2026-03-31', amount=3420.15, filing_deadline='2026-05-07', payment_due='2026-05-14', status='Pending', reference_number='VAT-Q1-26', transaction_reference='TXN-VAT-Q1', reminder_days=14, business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    VATRecord.objects.create(type='VAT Q4 2025', period_start='2025-10-01', period_end='2025-12-31', amount=2890.50, filing_deadline='2026-02-07', payment_due='2026-02-14', status='Paid', reference_number='VAT-Q4-25', transaction_reference='TXN-VAT-Q4', reminder_days=14, business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    VATRecord.objects.create(type='Corporation Tax 2025', period_start='2025-04-01', period_end='2026-03-31', amount=12500.00, filing_deadline='2026-12-31', payment_due='2027-01-01', status='Filed', reference_number='CT-2025-26', transaction_reference='TXN-CT-2526', reminder_days=30, business=BIZ_5, created_by=SUPER_ADMIN_EMAIL)
    VATRecord.objects.create(type='PAYE Monthly - May', period_start='2026-05-01', period_end='2026-05-31', amount=1840.00, filing_deadline='2026-06-19', payment_due='2026-06-22', status='Pending', reference_number='PAYE-MAY-26', reminder_days=7, business=BIZ_3, created_by=SUPER_ADMIN_EMAIL)
    VATRecord.objects.create(type='VAT Q1 2026 - Logistics', period_start='2026-01-01', period_end='2026-03-31', amount=5610.00, filing_deadline='2026-05-07', payment_due='2026-05-14', status='Paid', reference_number='VAT-Q1-LOG', transaction_reference='TXN-VAT-LOG', reminder_days=14, business=BIZ_2, created_by=SUPER_ADMIN_EMAIL)

    # 5g. Payment Service Records (Merchant Services)
    PaymentServiceRecord.objects.all().delete()
    PaymentServiceRecord.objects.create(provider='Dojo', biz=BIZ_1, type='Card Payment', date='2026-05-13', reference='DJ-999-001', gross_amount=450.00, fee_amount=12.50, net_amount=437.50, status='Paid', method='Card', staff='Admin', notes='Morning shift settlement', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='Dojo', biz=BIZ_3, type='Card Payment', date='2026-05-13', reference='DJ-999-005', gross_amount=620.00, fee_amount=17.36, net_amount=602.64, status='Paid', method='Card', staff='Sarah', notes='Full day takings - Bristol', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='Lottery', biz=BIZ_1, type='Lottery sale', date='2026-05-13', reference='LT-888-002', gross_amount=120.00, fee_amount=6.00, net_amount=114.00, status='Paid', method='EuroMillions', game_type='EuroMillions', draw_date='2026-05-14', ticket_number='SN-777-111', prize=10.00, claim_status='Unclaimed', staff='Manager', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='Lottery', biz=BIZ_3, type='Lottery sale', date='2026-05-12', reference='LT-888-006', gross_amount=85.00, fee_amount=4.25, net_amount=80.75, status='Paid', method='Lotto', game_type='Lotto', draw_date='2026-05-15', ticket_number='SN-888-222', prize=0, claim_status='N/A', staff='Admin', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='PayPoint', biz=BIZ_1, type='Bill payment', date='2026-05-12', reference='PP-111-003', gross_amount=85.00, fee_amount=1.50, net_amount=83.50, status='Pending', bill_type='Electricity', customer_reference='ACC-555', provider_name='British Gas', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='PayPoint', biz=BIZ_4, type='Bill payment', date='2026-05-11', reference='PP-111-007', gross_amount=142.00, fee_amount=2.10, net_amount=139.90, status='Paid', bill_type='Council Tax', customer_reference='CT-8821', provider_name='Birmingham Council', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='PayZone', biz=BIZ_1, type='Top-up', date='2026-05-13', reference='PZ-222-004', gross_amount=20.00, fee_amount=0.40, net_amount=19.60, status='Paid', bill_type='Mobile Top-up', customer_reference='07700 900000', provider_name='EE', voucher_code='VC-123456', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='PayZone', biz=BIZ_3, type='Top-up', date='2026-05-10', reference='PZ-222-008', gross_amount=30.00, fee_amount=0.60, net_amount=29.40, status='Paid', bill_type='Mobile Top-up', customer_reference='07700 900111', provider_name='Vodafone', voucher_code='VC-789012', created_by=SUPER_ADMIN_EMAIL)

    Supplier.objects.all().delete()
    s1 = Supplier.objects.create(supplier_id='SUP-001', name='Global Logistics Partners', category='Logistics', status='Active', phone='020 7946 0000', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    s2 = Supplier.objects.create(supplier_id='SUP-002', name='Prime Office Supplies', category='Office Supplies', status='Active', phone='0161 496 0000', business=BIZ_2, created_by=SUPER_ADMIN_EMAIL)

    PurchaseOrder.objects.all().delete()
    PurchaseOrder.objects.create(number='PO-2026-001', supplier=s2, amount=250.00, status='Paid', date='2026-05-10', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    Asset.objects.all().delete()
    a1 = Asset.objects.create(name='Main Office HVAC', location='Floor 1', asset_type='HVAC', assigned_person='Robert Chen', contact='0123456789', status='Operational', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    
    MaintenanceRequest.objects.all().delete()
    MaintenanceRequest.objects.create(issue='Leaking Tap', asset=a1, priority='Medium', technician='Mike Plumb', status='Pending', business=BIZ_2, created_by=SUPER_ADMIN_EMAIL)

    WasteCollection.objects.all().delete()
    WasteCollection.objects.create(date=timezone.now().date(), contact_person='Waste Team', phone='0123456789', address='Main Street Warehouse', status='Collected', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    PropertyLicence.objects.all().delete()
    PropertyLicence.objects.create(type='Premises License', authority='Local Council', issue_date=timezone.now().date(), status='Active', expiry_date=timezone.now().date() + timedelta(days=365), business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    from django.contrib.auth.hashers import make_password
    import json
    StaffProfile.objects.all().delete()
    
    # Super Admin
    StaffProfile.objects.create(
        name='Lakshan Ramawickrama', 
        username='superadmin', 
        role='super_admin', 
        email='superadmin@erp.com', 
        status='Active', 
        assigned_business='All', 
        access='All',
        permissions='{}',
        password=make_password('superadmin123')
    )
    
    # John Retailer - Only Retail/Inventory modules
    john_perms = {
        'Business Profile': ['view', 'add', 'edit'],
        'Inventory Management': ['view', 'add', 'edit', 'delete'],
        'Accounting': ['view'],
        'Dashboard': ['Business Details', 'Profit & Loss', 'Low Stock']
    }
    StaffProfile.objects.create(
        name='John Retailer', 
        username='admin_retail', 
        role='admin', 
        email='john@retail.co.uk', 
        status='Active', 
        assigned_business=BIZ_1, 
        access='Business Management, Inventory Management, Accounting',
        permissions=json.dumps(john_perms),
        password=make_password('admin123')
    )
    
    # Sarah Logistics - Only Fleet/Suppliers modules
    sarah_perms = {
        'Fleet Management': ['view', 'add', 'edit', 'delete'],
        'Suppliers': ['view', 'add', 'edit'],
        'Dashboard': ['Fleet Management', 'Supplier Payments', 'Recent Activity']
    }
    StaffProfile.objects.create(
        name='Sarah Logistics', 
        username='admin_logistics', 
        role='admin', 
        email='sarah@logistics.co.uk', 
        status='Active', 
        assigned_business=BIZ_2, 
        access='Fleet Management, Suppliers',
        permissions=json.dumps(sarah_perms),
        password=make_password('admin123')
    )

    SystemAlert.objects.all().delete()
    SystemAlert.objects.create(label='Low Stock', type='warning', message='Milk Packet 1L is approaching limit')
    SystemAlert.objects.create(label='Compliance Due', type='info', message='Annual health and safety audit due in 15 days')
    
    SystemCredential.objects.all().delete()
    SystemCredential.objects.create(service='Retail Till Access', account='admin_till_01', password='PIN-8822', status='Active', biz=BIZ_1, support='020 7946 0999', notes='Primary checkout till - Main Store', created_by=SUPER_ADMIN_EMAIL)
    SystemCredential.objects.create(service='HMRC Tax Portal', account='zerotax_admin', password='Tax-Pass-2026!', status='Active', biz=BIZ_5, support='0300 200 3300', notes='Used for quarterly VAT and Corp Tax filings', created_by=SUPER_ADMIN_EMAIL)
    SystemCredential.objects.create(service='Fleet Tracking (GPS)', account='ops_manager_02', password='Fleet-Secure-88', status='Active', biz=BIZ_2, support='0161 496 0777', notes='Live tracking portal for delivery vans', created_by=SUPER_ADMIN_EMAIL)
    SystemCredential.objects.create(service='Inventory ERP Backup', account='db_backup_sys', password='DB-Backup-Admin-!23', status='Active', biz=BIZ_ALL, support='IT Support Ext 101', notes='Scheduled database maintenance and backups', created_by=SUPER_ADMIN_EMAIL)
    SystemCredential.objects.create(service='CCTV Remote View', account='security_hq', password='Cam-Master-View-7', status='Active', biz=BIZ_1, support='020 7946 0555', notes='Remote access for London HQ security cameras', created_by=SUPER_ADMIN_EMAIL)
    SystemCredential.objects.create(service='Merchant Dojo Terminal', account='store_manager_br', password='Dojo-Login-5544', status='Active', biz=BIZ_3, support='0800 032 1088', notes='Merchant portal for Bristol card payments', created_by=SUPER_ADMIN_EMAIL)
    SystemCredential.objects.create(service='Supplier Portal - Prime', account='whiterock_buyer', password='Supply-Chain-2026', status='Active', biz=BIZ_3, support='0117 920 0444', notes='Order management system for Whiterock', created_by=SUPER_ADMIN_EMAIL)

    print("Seeding Complete! All data from db.ts migrated to MongoDB.")

if __name__ == "__main__":
    seed_data()
