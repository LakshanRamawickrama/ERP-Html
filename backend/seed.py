import os
import django
import sys
from datetime import datetime, timedelta

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.business.models import BusinessEntity
from apps.fleet.models import Vehicle, Delivery
from apps.inventory.models import Product
from apps.accounting.models import Transaction, BankAccount
from apps.legal.models import LegalDocument
from apps.reminders.models import Reminder
from apps.property.models import Asset
from apps.users.models import StaffProfile
from apps.suppliers.models import Supplier

def seed_data():
    print("Seeding MongoDB Database...")

    # 1. Business Entities
    BusinessEntity.objects.all().delete()
    BusinessEntity.objects.create(name="Whiterock Retail Ltd", company_number="WR-12345", tax_id="VAT-999", category="Retail")
    BusinessEntity.objects.create(name="Global Logistics Pro", company_number="GL-67890", tax_id="VAT-888", category="Logistics")

    # 2. Fleet
    Vehicle.objects.all().delete()
    v1 = Vehicle.objects.create(
        name="Mercedes Sprinter", 
        plate_number="WN70 ABC", 
        business="Whiterock Retail Ltd",
        mot_date="2024-05-15",
        insurance_date="2024-06-10",
        road_tax_date="2024-07-01",
        status="Active"
    )
    v2 = Vehicle.objects.create(
        name="Ford Transit", 
        plate_number="FX22 XYZ", 
        business="Global Logistics Pro",
        mot_date="2024-08-20",
        insurance_date="2024-09-12",
        road_tax_date="2024-10-05",
        status="Maintenance"
    )

    # 3. Inventory
    Product.objects.all().delete()
    Product.objects.create(name="Office Chair Luxe", sku="CHAIR-001", category="Furniture", quantity=25, price=150.00)
    Product.objects.create(name="Standard Laptop", sku="LAP-010", category="Electronics", quantity=10, price=850.00)

    # 4. Accounting
    Transaction.objects.all().delete()
    Transaction.objects.create(title="Monthly Rent", category="Expense", type="Expense", amount=2500.00, date="2024-05-01", status="Paid")
    Transaction.objects.create(title="Consultancy Fee", category="Income", type="Income", amount=5000.00, date="2024-05-05", status="Paid")

    BankAccount.objects.all().delete()
    BankAccount.objects.create(bank_name="Barclays", account_name="Main Biz", account_number="12345678", sort_code="20-00-00", account_type="Current", status="Active")

    # 5. Legal
    LegalDocument.objects.all().delete()
    LegalDocument.objects.create(title="Office Lease 2024", type="Lease", status="Active", expiry_date="2030-01-01")

    # 6. Reminders
    Reminder.objects.all().delete()
    Reminder.objects.create(
        title="MOT Renewal - WN70 ABC", 
        description="Annual MOT due next week", 
        due_date=datetime.now() + timedelta(days=7), 
        priority="High"
    )

    # 7. Property (Assets)
    Asset.objects.all().delete()
    Asset.objects.create(name="HQ Office Building", location="London", asset_type="Real Estate", assigned_person="John Doe", contact="john@whiterock.com", status="Operational")
    Asset.objects.create(name="Server Rack A1", location="Data Center", asset_type="IT Equipment", assigned_person="Tech Support", contact="support@whiterock.com", status="Operational")

    # 8. Users (Staff Profiles)
    StaffProfile.objects.all().delete()
    StaffProfile.objects.create(name="Admin User", role="Super Admin", department="Management", email="admin@erp.com", status="Active")
    StaffProfile.objects.create(name="Jane Smith", role="Accountant", department="Finance", email="jane@erp.com", status="Active")

    # 9. Suppliers
    Supplier.objects.all().delete()
    Supplier.objects.create(name="Office Depot", contact_person="Sales Team", email="sales@officedepot.com", phone="020-1234-5678", category="Office Supplies", status="Active")

    print("Seeding Complete! MongoDB is now populated with valid data.")

if __name__ == "__main__":
    seed_data()
