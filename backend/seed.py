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

    # 5. Accounting - Transactions
    Transaction.objects.all().delete()
    Transaction.objects.create(title='Monthly Rent - Main Office', category='Rent', type='Expense', amount=2500.00, date='2026-05-13', status='Paid', business=BIZ_1, payment_method='Bank Transfer', reference_number='RENT-MAY-26', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Stock Purchase - Prime Logistics', category='Supplier Payments', type='Expense', amount=450.50, date='2026-05-12', status='Pending', business=BIZ_2, payment_method='Credit Card', reference_number='PO-77889', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Business Mortgage Repayment', category='Mortgage', type='Expense', amount=2450.00, date='2026-05-10', status='Paid', business=BIZ_5, payment_method='Direct Debit', reference_number='MORT-771', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Annual Liability Insurance', category='Insurance', type='Expense', amount=850.00, date='2026-05-08', status='Paid', business=BIZ_ALL, payment_method='Bank Transfer', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Q1 VAT Submission', category='VAT / Tax', type='Expense', amount=3420.15, date='2026-05-13', status='Pending', business=BIZ_1, payment_method='HMRC Portal', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Consultancy Fees - Q2', category='Accountant Fees', type='Expense', amount=1200.00, date='2026-05-11', status='Paid', business=BIZ_5, payment_method='Bank Transfer', created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Utility Bill - Manchester Hub', category='Bank Charges', type='Expense', amount=85.20, date='2026-05-09', status='Paid', business=BIZ_2, payment_method='Direct Debit', created_by=SUPER_ADMIN_EMAIL)

    Invoice.objects.all().delete()
    Invoice.objects.create(number='INV-2026-001', client='Global Supplies Ltd', amount=850.00, invoice_date='2026-05-10', due_date='2026-05-24', status='Sent', invoice_type='Service', payment_method='Bank Transfer', created_by=SUPER_ADMIN_EMAIL)
    Invoice.objects.create(number='INV-2026-002', client='Prime Office Supplies', amount=120.50, invoice_date='2026-05-12', due_date='2026-05-26', status='Paid', invoice_type='Product', payment_method='Card', created_by=SUPER_ADMIN_EMAIL)

    BankAccount.objects.all().delete()
    BankAccount.objects.create(bank_name='Barclays', account_name='Main Business Current', account_number='****5678', sort_code='20-30-40', account_type='Business Current', status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)
    BankAccount.objects.create(bank_name='HSBC', account_name='Business Savings', account_number='****1122', sort_code='40-50-60', account_type='Business Savings', status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    Loan.objects.all().delete()
    Loan.objects.create(name='Equipment Finance', lender='NatWest Business', total_amount=25000.00, outstanding_amount=12450.00, monthly_payment=450.00, interest_rate=5.2, start_date='2025-01-01', end_date='2030-01-01', status='Active', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    InsurancePolicy.objects.all().delete()
    InsurancePolicy.objects.create(type='Professional Indemnity', provider='Hiscox', policy_number='HIS-8877', premium=45.00, expiry_date='2027-01-15', status='Active', asset_details='Business Operations', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    VATRecord.objects.all().delete()
    VATRecord.objects.create(type='VAT Q1 2026', period_start='2026-01-01', period_end='2026-03-31', amount=3420.15, filing_deadline='2026-05-07', payment_due='2026-05-14', status='Pending', reference_number='VAT-Q1-26', business=BIZ_1, created_by=SUPER_ADMIN_EMAIL)

    PaymentServiceRecord.objects.all().delete()
    PaymentServiceRecord.objects.create(provider='Dojo', biz=BIZ_1, type='Card Payment', date='2026-05-13', reference='DJ-999-001', gross_amount=450.00, fee_amount=12.50, net_amount=437.50, status='Paid', method='Card', staff='Admin', notes='Morning shift settlement', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='Lottery', biz=BIZ_3, type='Lottery sale', date='2026-05-13', reference='LT-888-002', gross_amount=120.00, fee_amount=6.00, net_amount=114.00, status='Paid', method='EuroMillions', game_type='EuroMillions', draw_date='2026-05-14', ticket_number='SN-777-111', prize=10.00, claim_status='Unclaimed', staff='Manager', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='PayPoint', biz=BIZ_4, type='Bill payment', date='2026-05-12', reference='PP-111-003', gross_amount=85.00, fee_amount=1.50, net_amount=83.50, status='Pending', bill_type='Electricity', customer_reference='ACC-555', provider_name='British Gas', created_by=SUPER_ADMIN_EMAIL)
    PaymentServiceRecord.objects.create(provider='PayZone', biz=BIZ_1, type='Top-up', date='2026-05-13', reference='PZ-222-004', gross_amount=20.00, fee_amount=0.40, net_amount=19.60, status='Paid', bill_type='Mobile Top-up', customer_reference='07700 900000', provider_name='EE', voucher_code='VC-123456', created_by=SUPER_ADMIN_EMAIL)

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
    StaffProfile.objects.all().delete()
    StaffProfile.objects.create(name='Lakshan Ramawickrama', username='superadmin', role='super_admin', email='superadmin@erp.com', status='Active', assigned_business='All', password=make_password('superadmin123'))

    SystemAlert.objects.all().delete()
    SystemAlert.objects.create(label='Low Stock', type='warning', message='Milk Packet 1L is approaching limit')
    
    SystemCredential.objects.all().delete()
    SystemCredential.objects.create(service='Till Access', status='Active')

    print("Seeding Complete! All data from db.ts migrated to MongoDB.")

if __name__ == "__main__":
    seed_data()
