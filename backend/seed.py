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
from apps.accounting.models import Transaction, Invoice, BankAccount, Loan, InsurancePolicy, VATRecord
from apps.legal.models import LegalDocument
from apps.reminders.models import Reminder
from apps.property.models import Asset, MaintenanceRequest, WasteCollection, PropertyLicence
from apps.users.models import StaffProfile
from apps.suppliers.models import Supplier
from apps.system.models import SystemCredential, SystemAlert

def seed_data():
    print("Seeding MongoDB Database with Full ERP Data...")

    # 1. Business Entities
    BusinessEntity.objects.all().delete()
    BusinessEntity.objects.create(name='Main Retail Store', company_number='CH-98765432', category='Retail', hq_location='London, UK')
    BusinessEntity.objects.create(name='Logistics Hub', company_number='CH-11223344', category='Logistics', hq_location='Manchester, UK')
    BusinessEntity.objects.create(name="Whiterock Retail Ltd", company_number="WR-12345", tax_id="VAT-999", category="Retail", hq_location="London")
    
    CompanyStructure.objects.all().delete()
    CompanyStructure.objects.create(name='Whiterock Retail Ltd', crn='12345678', manager='John Smith', sic_code='47110', filing_due='2026-12-15')
    CompanyStructure.objects.create(name='Zenith Logistics Hub', crn='87654321', manager='Sarah Jenkins', sic_code='52101', filing_due='2026-11-20')

    # 2. Fleet
    Vehicle.objects.all().delete()
    v1 = Vehicle.objects.create(name='CAR 1', plate_number='ABC-1234', business='Main Retail Store', mot_date='2026-04-10', insurance_date='2026-05-12', road_tax_date='2026-12-01', status='Active')
    Vehicle.objects.create(name="Mercedes Sprinter", plate_number="AB12 CDE", business="Whiterock Retail Ltd", mot_date="2026-05-20", insurance_date="2026-05-15", road_tax_date="2026-07-01", status="Active")
    Vehicle.objects.create(name="Ford Transit", plate_number="XY34 FGH", business="Global Logistics Pro", mot_date="2026-05-25", insurance_date="2026-05-10", road_tax_date="2026-06-15", status="Active")

    Delivery.objects.all().delete()
    Delivery.objects.create(vehicle=v1, pickup_date="2026-04-29", delivery_date="2026-04-30", address='Central Warehouse, London', contact_person='John Doe', contact_number='+44 7700 900077', status='Scheduled', notes='Urgent delivery')

    ParcelPartner.objects.all().delete()
    ParcelPartner.objects.create(provider='DHL Express', vehicle=v1, service_date="2026-05-01", area='City Central Area', contact_name='Sarah Jones', contact_number='+44 20 7946 0001', status='Active')

    # 3. Inventory
    Product.objects.all().delete()
    p1 = Product.objects.create(name="Milk Packet 1L", sku="MILK-001", category="Food & Beverages", quantity=150, price=1.20, min_stock=20)
    Product.objects.create(name="Sugar 1kg", sku="SUG-001", category="Groceries", quantity=5, price=0.90, min_stock=10)
    Product.objects.create(name="Notebook A4", sku="NOTE-001", category="Stationery", quantity=0, price=2.50, min_stock=5)

    StockMovement.objects.all().delete()
    StockMovement.objects.create(date="2026-05-05", product=p1, type="IN", quantity=50, notes="Monthly replenishment")

    # 4. Accounting
    Transaction.objects.all().delete()
    Transaction.objects.create(title='HQ Office Rent', category='Rent', type='Expense', amount=2500.00, date='2026-04-01', status='Paid', notes='Apr 2026 - Mar 2027')
    
    Invoice.objects.all().delete()
    Invoice.objects.create(number='INV-2026-001', client='Alpha Trading Co.', amount=5000.00, due_date='2026-04-30', status='Paid')
    Invoice.objects.create(number='INV-2026-003', client='Beta Logistics', amount=3800.00, due_date='2026-05-15', status='Overdue')

    BankAccount.objects.all().delete()
    BankAccount.objects.create(bank_name='Business Central Bank', account_name='LAKSHAN RAMAWICKRAMA ERP', account_number='88776655', sort_code='00-11-22', account_type='Business Current', status='Active')

    Loan.objects.all().delete()
    Loan.objects.create(name='SME Growth Loan', lender='BC Bank', total_amount=50000, outstanding_amount=32450, monthly_payment=1200, interest_rate=5.2, status='Active')

    InsurancePolicy.objects.all().delete()
    InsurancePolicy.objects.create(type='Public Liability', provider='Aviva Business', policy_number='POL-882233', premium=1200.00, expiry_date='2026-12-15', status='Active')

    VATRecord.objects.all().delete()
    VATRecord.objects.create(type='VAT Return Q1', period='Jan - Mar 2026', amount=4250.00, date='2026-04-10', status='Paid')

    # 5. Legal
    LegalDocument.objects.all().delete()
    LegalDocument.objects.create(title='Trade License', type='License', status='Active', expiry_date='2027-05-20')
    LegalDocument.objects.create(title='GDPR Compliance', type='Permit', status='Expired', expiry_date='2025-01-01')

    # 6. Reminders
    Reminder.objects.all().delete()
    Reminder.objects.create(title='Vehicle Insurance Renewal', description='Annual HGV insurance renewal for fleet group A', due_date=datetime.now() + timedelta(days=15), priority='High')

    # 7. Property
    Asset.objects.all().delete()
    a1 = Asset.objects.create(name='Main Office HVAC', location='Floor 1, West Wing', asset_type='HVAC', assigned_person='Robert Chen', contact='+1 234-567-890', status='Operational')
    
    MaintenanceRequest.objects.all().delete()
    MaintenanceRequest.objects.create(issue='Leak in Bathroom', asset=a1, priority='Urgent', technician='Mike Plumb', status='In Progress')

    WasteCollection.objects.all().delete()
    WasteCollection.objects.create(date="2026-05-01", contact_person='John Doe', phone='+1 234-567-888', address='Building A, Service Entrance', status='Scheduled')

    PropertyLicence.objects.all().delete()
    PropertyLicence.objects.create(type='Trade Licence 2026', business='Property Management Div', authority='City Planning Dept', issue_date="2026-05-20", expiry_date="2027-05-20", status='Active')

    # 8. Users
    from django.contrib.auth.models import User
    from pymongo import MongoClient
    
    # Use pymongo to clear users collection safely
    client = MongoClient('mongodb://localhost:27017/')
    client.ERP_System_Pro.auth_user.delete_many({})
    client.ERP_System_Pro.authtoken_token.delete_many({})

    # 1. Super Admin User
    User.objects.create_superuser('superadmin', 'superadmin@erp.com', 'superpassword123')

    # 2. Regular Admin User
    User.objects.create_user('admin', 'admin@erp.com', 'adminpassword123')

    StaffProfile.objects.all().delete()
    # Link Super Admin
    StaffProfile.objects.create(
        name='Lakshan Ramawickrama', 
        role='super_admin', 
        assigned_business='All', 
        email='superadmin@erp.com', 
        status='Active'
    )
    # Link Admin
    StaffProfile.objects.create(
        name='Operations Manager', 
        role='admin', 
        assigned_business='Main Retail Store', 
        email='admin@erp.com', 
        status='Active'
    )

    # 9. Suppliers
    Supplier.objects.all().delete()
    Supplier.objects.create(name='Global Logistics Partners', contact_person='Sales Team', email='contact@global.com', phone='+44 20 7123 4567', category='Services', status='Active')

    # 10. System
    SystemCredential.objects.all().delete()
    SystemCredential.objects.create(service='Till Access', account='Till-Main-01', password='TILL_PASSWORD_123', support='+94 11 234 5678', status='Active')
    
    SystemAlert.objects.all().delete()
    SystemAlert.objects.create(label='PayPoint Portal', message='Password expires in 5 days', type='soon')

    print("Seeding Complete! All mock data from the frontend is now in MongoDB.")

if __name__ == "__main__":
    seed_data()
