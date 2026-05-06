import os
import django
import sys

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

def seed_data():
    print("🌱 Seeding MongoDB Database...")

    # 1. Business Entities
    BusinessEntity.objects.all().delete()
    BusinessEntity.objects.create(name="Whiterock Retail Ltd", registration_number="WR-12345", tax_id="VAT-999", category="Retail")
    BusinessEntity.objects.create(name="Global Logistics Pro", registration_number="GL-67890", tax_id="VAT-888", category="Logistics")

    # 2. Fleet
    Vehicle.objects.all().delete()
    Vehicle.objects.create(make="Mercedes", model="Sprinter", registration_plate="WN70 ABC", status="Active", type="Van")
    Vehicle.objects.create(make="Ford", model="Transit", registration_plate="FX22 XYZ", status="Maintenance", type="Van")

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
    Reminder.objects.create(title="MOT Renewal - WN70 ABC", description="Annual MOT due next week", due_date="2024-05-15", priority="High")

    print("✅ Seeding Complete! MongoDB is now populated.")

if __name__ == "__main__":
    seed_data()
