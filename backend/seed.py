import os
import django
import sys
from datetime import datetime, timedelta

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.business.models import BusinessEntity, CompanyStructure
from apps.fleet.models import Vehicle, Delivery, ParcelPartner
from apps.inventory.models import Product, StockMovement
from apps.accounting.models import Transaction, Invoice, BankAccount, Loan, InsurancePolicy, VATRecord, DojoSettlement
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
    if 'localhost' in host:
         print("WARNING: Connecting to localhost MongoDB! This might fail in production.")
    else:
         print("Cloud MongoDB connection detected.")
    print("Seeding MongoDB Database with Full ERP Data...")
    
    SUPER_ADMIN_EMAIL = 'superadmin@erp.com'
    BUSINESS_1 = 'Main Retail Store'
    BUSINESS_2 = 'Logistics Hub'

    # 1. Business Entities
    BusinessEntity.objects.all().delete()
    BusinessEntity.objects.create(name=BUSINESS_1, company_number='CH-98765432', category='Retail', hq_location='London, UK', created_by=SUPER_ADMIN_EMAIL)
    BusinessEntity.objects.create(name=BUSINESS_2, company_number='CH-11223344', category='Logistics', hq_location='Manchester, UK', created_by=SUPER_ADMIN_EMAIL)
    
    CompanyStructure.objects.all().delete()
    CompanyStructure.objects.create(name=BUSINESS_1, crn='12345678', manager='John Smith', sic_code='47110', filing_due='2026-12-15', created_by=SUPER_ADMIN_EMAIL)
    CompanyStructure.objects.create(name=BUSINESS_2, crn='87654321', manager='Sarah Jenkins', sic_code='52101', filing_due='2026-11-20', created_by=SUPER_ADMIN_EMAIL)

    # 5. Legal
    LegalDocument.objects.all().delete()
    LegalDocument.objects.create(title='Trade License', type='License', status='Active', expiry_date='2027-05-20', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    LegalDocument.objects.create(title='GDPR Compliance Certificate', type='Permit', status='Expired', expiry_date='2025-01-01', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    LegalDocument.objects.create(title='Employment Contract - J. Smith', type='Contract', status='Active', expiry_date='2027-12-31', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    LegalDocument.objects.create(title='Premises Lease Agreement', type='Agreement', status='Active', expiry_date='2028-06-01', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    LegalDocument.objects.create(title='NDA - Tech Supplier', type='NDA', status='Active', expiry_date='2026-11-15', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    # 2. Fleet
    Vehicle.objects.all().delete()
    v1 = Vehicle.objects.create(name='CAR 1', plate_number='ABC-1234', business=BUSINESS_1, mot_date='2026-05-20', insurance_date='2026-06-12', road_tax_date='2026-12-01', status='Active', created_by=SUPER_ADMIN_EMAIL)
    v2 = Vehicle.objects.create(name="Ford Transit", plate_number="XY34 FGH", business=BUSINESS_2, mot_date="2026-05-15", insurance_date="2026-06-10", road_tax_date="2026-06-15", status="Active", created_by=SUPER_ADMIN_EMAIL)

    Delivery.objects.all().delete()
    Delivery.objects.create(vehicle=v1, pickup_date="2026-05-08", delivery_date="2026-05-09", address='Central Warehouse, London', contact_person='John Doe', contact_number='+44 7700 900077', status='Delivered', notes='Urgent delivery', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    Delivery.objects.create(vehicle=v2, pickup_date="2026-05-12", delivery_date="2026-05-14", address='South Depot, Bristol', contact_person='Bob Jones', contact_number='+44 7700 900099', status='Pending', notes='Awaiting clearance', business=BUSINESS_2, created_by=SUPER_ADMIN_EMAIL)

    ParcelPartner.objects.all().delete()
    ParcelPartner.objects.create(provider='DPD Logistics', vehicle=v1, service_date='2026-05-10', area='London Central', contact_name='Alice Cooper', contact_number='+44 7700 900111', status='Active', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    # 3. Inventory
    Product.objects.all().delete()
    p1 = Product.objects.create(name="Milk Packet 1L", sku="MILK-001", category="Food & Beverages", quantity=150, price=1.20, min_stock=20, business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    p2 = Product.objects.create(name="Sugar 1kg", sku="SUG-001", category="Groceries", quantity=8, price=0.90, min_stock=10, business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    StockMovement.objects.all().delete()
    StockMovement.objects.create(date="2026-05-01", product=p1, type="IN", quantity=100, notes="Monthly replenishment", business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    # 4. Accounting
    Transaction.objects.all().delete()
    Transaction.objects.create(title='HQ Office Rent', category='Rent', type='Expense', amount=2500.00, date='2026-04-01', status='Paid', notes='Apr 2026 - Mar 2027', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    Transaction.objects.create(title='Product Sales Revenue', category='Income', type='Income', amount=12500.00, date='2026-04-15', status='Paid', notes='Retail sales Q1', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    Invoice.objects.all().delete()
    Invoice.objects.create(number='INV-2026-001', client='Alpha Trading Co.', amount=5000.00, due_date='2026-04-30', status='Paid', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    Invoice.objects.create(number='INV-2026-002', client='Beta Logistics Ltd', amount=3800.00, due_date='2026-05-15', status='Overdue', business=BUSINESS_2, created_by=SUPER_ADMIN_EMAIL)

    BankAccount.objects.all().delete()
    BankAccount.objects.create(bank_name='Business Central Bank', account_name='LAKSHAN RAMAWICKRAMA ERP', account_number='88776655', sort_code='00-11-22', account_type='Business Current', status='Active', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    Loan.objects.all().delete()
    Loan.objects.create(name='Business Expansion Loan', lender='HSBC Business', total_amount=50000.00, outstanding_amount=42000.00, monthly_payment=1250.00, interest_rate=4.5, status='Active', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    InsurancePolicy.objects.all().delete()
    InsurancePolicy.objects.create(type='Public Liability', provider='Aviva Business', policy_number='PL-887766', premium=1200.00, start_date='2026-01-01', expiry_date='2026-12-31', renewal_reminder='30 Days Before', status='Active', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    VATRecord.objects.all().delete()
    VATRecord.objects.create(type='VAT Return Q1', period='Jan - Mar 2026', amount=4250.00, date='2026-04-10', status='Paid', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    DojoSettlement.objects.all().delete()
    DojoSettlement.objects.create(date='2026-05-01', amount=3250.00, fee=32.50, net=3217.50, method='Contactless', status='Settled', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    # 6. Reminders
    Reminder.objects.all().delete()
    Reminder.objects.create(title='Vehicle Insurance Renewal', description='Annual HGV insurance renewal', due_date=datetime.now() + timedelta(days=15), priority='High', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    Reminder.objects.create(title='VAT Return Q2 Submission', description='Quarterly VAT filing', due_date=datetime.now() + timedelta(days=30), priority='High', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    # 7. Property
    Asset.objects.all().delete()
    a1 = Asset.objects.create(name='Main Office HVAC', location='Floor 1', asset_type='HVAC', assigned_person='Robert Chen', contact='+1 234-567-890', status='Operational', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    
    MaintenanceRequest.objects.all().delete()
    MaintenanceRequest.objects.create(issue='Leak in Ground Floor Bathroom', asset=a1, priority='Urgent', technician='Mike Plumb', status='In Progress', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    WasteCollection.objects.all().delete()
    WasteCollection.objects.create(date='2026-05-15', contact_person='Alice Smith', phone='+44 7700 900555', address='Main Street Warehouse', status='Active', notes='Weekly Pickup', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    PropertyLicence.objects.all().delete()
    PropertyLicence.objects.create(type='HMO Licence', authority='London City Council', issue_date='2023-01-01', expiry_date='2028-10-10', status='Active', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    # 8. Users
    from django.contrib.auth.hashers import make_password
    
    StaffProfile.objects.all().delete()
    # Super Admin Profile
    StaffProfile.objects.create(
        name='Lakshan Ramawickrama', 
        username='superadmin',
        role='super_admin', 
        assigned_business='All', 
        email=SUPER_ADMIN_EMAIL, 
        status='Active',
        password=make_password('superpassword123')
    )
    # Admin Profile
    StaffProfile.objects.create(
        name='Operations Manager', 
        username='admin',
        role='admin', 
        assigned_business=BUSINESS_1, 
        email='admin@erp.com', 
        status='Active',
        password=make_password('adminpassword123')
    )

    SystemCredential.objects.all().delete()
    SystemCredential.objects.create(service='AWS Portal', account='admin_user', password='encrypted_password123', support='Cloud Infra Team', status='Active')

    SystemAlert.objects.all().delete()
    SystemAlert.objects.create(label='Server High Latency', type='warning', message='Region us-east-1 experiencing issues')

    # 9. Suppliers
    Supplier.objects.all().delete()
    s1 = Supplier.objects.create(name='Global Logistics Partners', contact_person='Sales Team', email='contact@global.com', phone='+44 20 7123 4567', category='Services', status='Active', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    PurchaseOrder.objects.all().delete()
    PurchaseOrder.objects.create(number='PO-2026-001', supplier=s1, product='Industrial Lubricants', quantity=12, amount=1250.00, date='2026-05-15', status='Paid', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)

    # 10. Connected Emails
    ConnectedEmail.objects.all().delete()
    ConnectedEmail.objects.create(email='admin@mainretailstore.com', label='Primary Business', type='primary', password='', status='Connected', created_by=SUPER_ADMIN_EMAIL)
    ConnectedEmail.objects.create(email='support@mainretailstore.com', label='Support Inbox', type='other', password='', status='Connected', created_by=SUPER_ADMIN_EMAIL)
    ConnectedEmail.objects.create(email='logistics@logisticshub.com', label='Logistics Hub', type='other', password='', status='Connected', created_by=SUPER_ADMIN_EMAIL)

    # 11. Notes
    Note.objects.all().delete()
    Note.objects.create(text='Review Q1 sales figures before board meeting on Friday.', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    Note.objects.create(text='Vehicle insurance renewal due next month — contact broker.', business=BUSINESS_1, created_by=SUPER_ADMIN_EMAIL)
    Note.objects.create(text='Chase Beta Logistics Ltd for overdue invoice INV-2026-002.', business=BUSINESS_2, created_by=SUPER_ADMIN_EMAIL)

    print("Seeding Complete! Data is now isolated by business.")

if __name__ == "__main__":
    seed_data()
