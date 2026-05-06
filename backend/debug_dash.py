import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.business.models import BusinessEntity
from apps.fleet.models import Vehicle
from apps.inventory.models import Product
from apps.suppliers.models import Supplier
from apps.reminders.models import Reminder
from apps.accounting.models import VATRecord, BankAccount, Invoice
from apps.property.models import MaintenanceRequest
from django.contrib.auth.models import User

def debug_dashboard():
    try:
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            print("No superuser found")
            return

        entities = BusinessEntity.objects.all()
        vehicles = Vehicle.objects.all()
        vat = VATRecord.objects.all()
        maintenance = MaintenanceRequest.objects.all()
        invoices = Invoice.objects.all()
        reminders = Reminder.objects.all()
        low_stock = Product.objects.filter(quantity__lt=10)
        banks = BankAccount.objects.all()

        print(f"Entities: {entities.count()}")
        print(f"Vehicles: {vehicles.count()}")
        print(f"VAT Records: {vat.count()}")
        print(f"Maintenance: {maintenance.count()}")
        print(f"Invoices: {invoices.count()}")
        
        # Test serialization
        data = {
            "businesses": [
                {
                    "id": str(e.id),
                    "name": e.name,
                    "inc": "$125,400",
                    "exp": "$42,100",
                    "skus": "1,240",
                    "flt": 12,
                    "st": e.status
                } for e in entities
            ],
            "fleet": [
                {
                    "v": v.name,
                    "p": v.plate_number,
                    "i": str(v.insurance_date) if v.insurance_date else None,
                    "s": v.status
                } for v in vehicles
            ],
            "vat": [
                {
                    "type": r.type,
                    "period": r.period,
                    "amount": f"${r.amount:,.0f}",
                    "status": r.status
                } for r in vat
            ],
            "sales": [
                {
                    "i": inv.number,
                    "c": inv.client,
                    "a": f"${inv.amount:,.0f}",
                    "s": inv.status
                } for inv in invoices
            ],
            "banks": [
                {
                    "b": b.bank_name,
                    "n": b.account_name,
                    "bl": "$142,350"
                } for b in banks
            ],
            "maintenance": [
                {
                    "a": m.asset.name,
                    "p": m.priority,
                    "s": m.status
                } for m in maintenance
            ],
            "lowStock": [
                {
                    "i": p.name,
                    "c": p.quantity,
                    "s": "Low Stock"
                } for p in low_stock
            ],
            "reminders": [
                {
                    "id": str(r.id),
                    "title": r.title,
                    "priority": r.priority,
                    "type": "General"
                } for r in reminders
            ],
        }
        print("Serialization successful")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_dashboard()
