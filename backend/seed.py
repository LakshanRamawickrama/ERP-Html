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
    v1 = Vehicle.objects.create(name='CAR 1', plate_number='ABC-1234', business='Main Retail Store', mot_date='2026-05-20', insurance_date='2026-06-12', road_tax_date='2026-12-01', status='Active')
    v2 = Vehicle.objects.create(name="Mercedes Sprinter", plate_number="AB12 CDE", business="Whiterock Retail Ltd", mot_date="2026-06-20", insurance_date="2026-05-15", road_tax_date="2026-07-01", status="Active")
    v3 = Vehicle.objects.create(name="Ford Transit", plate_number="XY34 FGH", business="Logistics Hub", mot_date="2026-05-15", insurance_date="2026-06-10", road_tax_date="2026-06-15", status="Active")

    Delivery.objects.all().delete()
    Delivery.objects.create(vehicle=v1, pickup_date="2026-05-08", delivery_date="2026-05-09", address='Central Warehouse, London', contact_person='John Doe', contact_number='+44 7700 900077', status='Delivered', notes='Urgent delivery')
    Delivery.objects.create(vehicle=v2, pickup_date="2026-05-10", delivery_date="2026-05-11", address='North Branch, Manchester', contact_person='Alice Smith', contact_number='+44 7700 900088', status='In Transit', notes='Standard drop-off')
    Delivery.objects.create(vehicle=v3, pickup_date="2026-05-12", delivery_date="2026-05-14", address='South Depot, Bristol', contact_person='Bob Jones', contact_number='+44 7700 900099', status='Pending', notes='Awaiting clearance')

    ParcelPartner.objects.all().delete()
    ParcelPartner.objects.create(provider='DHL Express', vehicle=v1, service_date="2026-05-01", area='City Central Area', contact_name='Sarah Jones', contact_number='+44 20 7946 0001', status='Active')
    ParcelPartner.objects.create(provider='FedEx Ground', vehicle=v2, service_date="2026-05-05", area='North Region', contact_name='Mark Davis', contact_number='+44 20 7946 0002', status='Active')
    ParcelPartner.objects.create(provider='UPS Standard', vehicle=v3, service_date="2026-05-10", area='South Region', contact_name='Emma Wilson', contact_number='+44 20 7946 0003', status='Pending Review')

    # 3. Inventory
    Product.objects.all().delete()
    p1 = Product.objects.create(name="Milk Packet 1L", sku="MILK-001", category="Food & Beverages", quantity=150, price=1.20, min_stock=20)
    p2 = Product.objects.create(name="Sugar 1kg", sku="SUG-001", category="Groceries", quantity=8, price=0.90, min_stock=10)
    p3 = Product.objects.create(name="Notebook A4", sku="NOTE-001", category="Stationery", quantity=0, price=2.50, min_stock=5)
    p4 = Product.objects.create(name="Coffee Beans 500g", sku="COF-001", category="Food & Beverages", quantity=45, price=8.50, min_stock=15)
    p5 = Product.objects.create(name="Printer Ink Black", sku="INK-001", category="Office Supplies", quantity=3, price=25.00, min_stock=5)

    StockMovement.objects.all().delete()
    StockMovement.objects.create(date="2026-05-01", product=p1, type="IN", quantity=100, notes="Monthly replenishment")
    StockMovement.objects.create(date="2026-05-03", product=p2, type="OUT", quantity=15, notes="Sent to Store A")
    StockMovement.objects.create(date="2026-05-05", product=p3, type="OUT", quantity=10, notes="Damaged goods")
    StockMovement.objects.create(date="2026-05-06", product=p4, type="IN", quantity=30, notes="New shipment")
    StockMovement.objects.create(date="2026-05-07", product=p5, type="OUT", quantity=2, notes="Internal office use")

    # 4. Accounting
    Transaction.objects.all().delete()
    Transaction.objects.create(title='HQ Office Rent', category='Rent', type='Expense', amount=2500.00, date='2026-04-01', status='Paid', notes='Apr 2026 - Mar 2027')
    Transaction.objects.create(title='Product Sales Revenue', category='Income', type='Income', amount=12500.00, date='2026-04-15', status='Paid', notes='Retail sales Q1')
    Transaction.objects.create(title='Staff Salaries', category='Salary', type='Expense', amount=8000.00, date='2026-04-30', status='Paid', notes='April payroll')
    Transaction.objects.create(title='Office Supplies Purchase', category='Supplies', type='Expense', amount=350.00, date='2026-05-02', status='Paid', notes='Stationery and consumables')
    Transaction.objects.create(title='Consulting Services Income', category='Income', type='Income', amount=3200.00, date='2026-05-05', status='Pending', notes='Invoice INV-2026-004')

    Invoice.objects.all().delete()
    Invoice.objects.create(number='INV-2026-001', client='Alpha Trading Co.', amount=5000.00, due_date='2026-04-30', status='Paid')
    Invoice.objects.create(number='INV-2026-002', client='Beta Logistics Ltd', amount=3800.00, due_date='2026-05-15', status='Overdue')
    Invoice.objects.create(number='INV-2026-003', client='Gamma Retail Group', amount=1200.00, due_date='2026-05-28', status='Pending')
    Invoice.objects.create(number='INV-2026-004', client='Delta Consultancy', amount=3200.00, due_date='2026-06-10', status='Sent')

    BankAccount.objects.all().delete()
    BankAccount.objects.create(bank_name='Business Central Bank', account_name='LAKSHAN RAMAWICKRAMA ERP', account_number='88776655', sort_code='00-11-22', account_type='Business Current', status='Active')
    BankAccount.objects.create(bank_name='Lloyds Business Banking', account_name='Whiterock Retail Ltd', account_number='12345678', sort_code='30-92-10', account_type='Business Savings', status='Active')

    Loan.objects.all().delete()
    Loan.objects.create(name='SME Growth Loan', lender='BC Bank', total_amount=50000, outstanding_amount=32450, monthly_payment=1200, interest_rate=5.2, status='Active')
    Loan.objects.create(name='Equipment Finance', lender='Barclays Commercial', total_amount=15000, outstanding_amount=9800, monthly_payment=450, interest_rate=3.8, status='Active')

    InsurancePolicy.objects.all().delete()
    InsurancePolicy.objects.create(type='Public Liability', provider='Aviva Business', policy_number='POL-882233', premium=1200.00, expiry_date='2026-12-15', status='Active')
    InsurancePolicy.objects.create(type='Employer Liability', provider='AXA Commercial', policy_number='POL-445566', premium=950.00, expiry_date='2026-09-30', status='Active')
    InsurancePolicy.objects.create(type='Fleet Insurance', provider='Direct Line Business', policy_number='POL-771188', premium=3400.00, expiry_date='2026-07-20', status='Active')

    VATRecord.objects.all().delete()
    VATRecord.objects.create(type='VAT Return Q1', period='Jan - Mar 2026', amount=4250.00, date='2026-04-10', status='Paid')
    VATRecord.objects.create(type='VAT Return Q2', period='Apr - Jun 2026', amount=5100.00, date='2026-07-10', status='Pending')

    DojoSettlement.objects.all().delete()
    DojoSettlement.objects.create(date='2026-05-01', amount=3250.00, fee=32.50, net=3217.50, method='Contactless', status='Settled')
    DojoSettlement.objects.create(date='2026-05-02', amount=1800.00, fee=18.00, net=1782.00, method='Card', status='Settled')
    DojoSettlement.objects.create(date='2026-05-03', amount=4100.00, fee=41.00, net=4059.00, method='Online', status='Settled')
    DojoSettlement.objects.create(date='2026-05-04', amount=950.00, fee=9.50, net=940.50, method='Contactless', status='Pending')
    DojoSettlement.objects.create(date='2026-05-05', amount=2750.00, fee=27.50, net=2722.50, method='Card', status='Settled')

    # 5. Legal
    LegalDocument.objects.all().delete()
    LegalDocument.objects.create(title='Trade License', type='License', status='Active', expiry_date='2027-05-20')
    LegalDocument.objects.create(title='GDPR Compliance Certificate', type='Permit', status='Expired', expiry_date='2025-01-01')
    LegalDocument.objects.create(title='Employment Contract - J. Smith', type='Contract', status='Active', expiry_date='2027-12-31')
    LegalDocument.objects.create(title='Premises Lease Agreement', type='Agreement', status='Active', expiry_date='2028-06-01')
    LegalDocument.objects.create(title='NDA - Tech Supplier', type='NDA', status='Active', expiry_date='2026-11-15')

    # 6. Reminders
    Reminder.objects.all().delete()
    Reminder.objects.create(title='Vehicle Insurance Renewal', description='Annual HGV insurance renewal for fleet group A', due_date=datetime.now() + timedelta(days=15), priority='High')
    Reminder.objects.create(title='VAT Return Q2 Submission', description='Quarterly VAT filing due to HMRC for Apr-Jun 2026', due_date=datetime.now() + timedelta(days=30), priority='High')
    Reminder.objects.create(title='MOT Due - Ford Transit', description='Annual MOT test for XY34 FGH due next month', due_date=datetime.now() + timedelta(days=20), priority='Medium')
    Reminder.objects.create(title='Trade License Renewal', description='Renew annual trade licence with City Planning Dept', due_date=datetime.now() + timedelta(days=45), priority='Medium')
    Reminder.objects.create(title='Staff Annual Review', description='Schedule annual performance review for all staff members', due_date=datetime.now() + timedelta(days=60), priority='Low')

    # 7. Property
    Asset.objects.all().delete()
    a1 = Asset.objects.create(name='Main Office HVAC', location='Floor 1, West Wing', asset_type='HVAC', assigned_person='Robert Chen', contact='+1 234-567-890', status='Operational')
    a2 = Asset.objects.create(name='Passenger Elevator', location='Main Lobby', asset_type='Elevator', assigned_person='Sarah Park', contact='+44 20 7123 9999', status='Operational')
    a3 = Asset.objects.create(name='Fire Suppression System', location='All Floors', asset_type='Fire Safety', assigned_person='Mark Webb', contact='+44 20 8888 1122', status='Needs Attention')

    MaintenanceRequest.objects.all().delete()
    MaintenanceRequest.objects.create(issue='Leak in Ground Floor Bathroom', asset=a1, priority='Urgent', technician='Mike Plumb', status='In Progress')
    MaintenanceRequest.objects.create(issue='Elevator Door Sensor Fault', asset=a2, priority='Urgent', technician='Lift Tech Ltd', status='Pending')
    MaintenanceRequest.objects.create(issue='Annual Fire System Inspection', asset=a3, priority='Standard', technician='SafeGuard Services', status='Scheduled')

    WasteCollection.objects.all().delete()
    WasteCollection.objects.create(date='2026-05-01', contact_person='John Doe', phone='+1 234-567-888', address='Building A, Service Entrance', status='Completed')
    WasteCollection.objects.create(date='2026-05-08', contact_person='Jane Mills', phone='+44 20 9999 3344', address='Rear Loading Bay, Unit 2', status='Scheduled')
    WasteCollection.objects.create(date='2026-05-15', contact_person='John Doe', phone='+1 234-567-888', address='Building A, Service Entrance', status='Scheduled')

    PropertyLicence.objects.all().delete()
    PropertyLicence.objects.create(type='Trade Licence 2026', business='Property Management Div', authority='City Planning Dept', issue_date='2026-05-20', expiry_date='2027-05-20', status='Active')
    PropertyLicence.objects.create(type='HMO Licence', business='Whiterock Retail Ltd', authority='London Borough Council', issue_date='2025-01-01', expiry_date='2026-06-30', status='Active')
    PropertyLicence.objects.create(type='Food Hygiene Permit', business='Main Retail Store', authority='Environmental Health Office', issue_date='2024-03-15', expiry_date='2025-03-15', status='Expired')

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
    from apps.suppliers.models import Supplier, PurchaseOrder
    Supplier.objects.all().delete()
    s1 = Supplier.objects.create(name='Global Logistics Partners', contact_person='Sales Team', email='contact@global.com', phone='+44 20 7123 4567', category='Services', status='Active')
    s2 = Supplier.objects.create(name='Acme Supplies Ltd', contact_person='Manager', email='sales@acme.com', phone='+44 20 8888 7777', category='Hardware', status='Active')

    PurchaseOrder.objects.all().delete()
    PurchaseOrder.objects.create(number='PO-2026-001', supplier=s1, product='Industrial Lubricants', quantity=12, amount=1250.00, date='2026-05-15', status='Paid')
    PurchaseOrder.objects.create(number='PO-2026-002', supplier=s2, product='Office Stationery Kit', quantity=50, amount=450.00, date='2026-05-20', status='Pending')
    PurchaseOrder.objects.create(number='PO-2026-003', supplier=s1, product='Fleet Spare Parts', quantity=5, amount=2800.00, date='2026-05-25', status='Pending')

    # 10. System
    SystemCredential.objects.all().delete()
    SystemCredential.objects.create(service='Till Access', account='Till-Main-01', password='TILL_PASSWORD_123', support='+94 11 234 5678', status='Active')
    
    SystemAlert.objects.all().delete()
    SystemAlert.objects.create(label='PayPoint Portal', message='Password expires in 5 days', type='soon')

    print("Seeding Complete! All mock data from the frontend is now in MongoDB.")

if __name__ == "__main__":
    seed_data()
