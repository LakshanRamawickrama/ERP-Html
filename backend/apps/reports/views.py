from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.business.models import BusinessEntity
from apps.fleet.models import Vehicle
from apps.inventory.models import Product
from apps.suppliers.models import Supplier
from apps.reminders.models import Reminder
from apps.accounting.models import Transaction, VATRecord, BankAccount, Invoice
from apps.property.models import MaintenanceRequest
from apps.users.models import StaffProfile

class ReportsDataView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile = StaffProfile.objects.filter(email=request.user.email).first()
        business_scope = profile.assigned_business if profile else 'All'

        if business_scope == 'All' or request.user.is_superuser:
            v_count = Vehicle.objects.count()
            s_count = Supplier.objects.count()
            p_count = Product.objects.count()
            e_count = BusinessEntity.objects.count()
        else:
            v_count = Vehicle.objects.filter(business=business_scope).count()
            s_count = Supplier.objects.count()
            p_count = Product.objects.count()
            e_count = BusinessEntity.objects.filter(name=business_scope).count()

        return Response({
            "stats": [
                {"title": "Total Entities", "value": str(e_count), "trend": "+2", "isUp": True},
                {"title": "Fleet Vehicles", "value": str(v_count), "trend": "Active", "isUp": True},
                {"title": "Active Providers", "value": str(s_count), "trend": "Stable", "isUp": True},
                {"title": "Stock SKUs", "value": str(p_count), "trend": "+12", "isUp": True}
            ],
            "templates": [
                {"label": "Annual Tax Summary", "format": "PDF"},
                {"label": "Supplier Performance", "format": "XLSX"},
                {"label": "Inventory Audit", "format": "CSV"}
            ]
        })

class DashboardDataView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Safely handle user email and username for both authenticated and anonymous users
        user_email = getattr(request.user, 'email', None)
        user_name = getattr(request.user, 'username', 'Guest')
        
        profile = StaffProfile.objects.filter(email=user_email).first() if user_email else None
        business_scope = profile.assigned_business if profile else 'All'
        
        is_scoped = business_scope != 'All' and not getattr(request.user, 'is_superuser', False)

        if not is_scoped:
            entities = BusinessEntity.objects.all()
            vehicles = Vehicle.objects.all()
            vat = VATRecord.objects.all()
            maintenance = MaintenanceRequest.objects.all()
            invoices = Invoice.objects.all()
        else:
            entities = BusinessEntity.objects.filter(name=business_scope)
            vehicles = Vehicle.objects.filter(business=business_scope)
            vat = VATRecord.objects.all() 
            maintenance = MaintenanceRequest.objects.all()
            invoices = Invoice.objects.all()

        reminders = Reminder.objects.all()
        low_stock = Product.objects.filter(quantity__lt=10)
        banks = BankAccount.objects.all()

        return Response({
            "businesses": [
                {
                    "id": str(e.id),
                    "name": e.name,
                    "slug": e.name.lower().replace(' ', '-'),
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
            "notes": [
                "Renew trade licence before May 20" if not is_scoped else f"Renew {business_scope} licence",
                "Insurance expiring this month for fleet",
                "Follow up with Global Logistics"
            ],
            "vat": [
                {
                    "type": r.type,
                    "period": r.period,
                    "amount": f"${r.amount:,.0f}" if r.amount is not None else "$0",
                    "status": r.status
                } for r in vat
            ],
            "todos": [
                {"t": "Renew TRK-007 insurance", "d": True},
                {"t": "File VAT Q2 2026", "d": False},
                {"t": "Review supplier PO-2026-503", "d": False}
            ],
            "passwords": [
                {"s": "HMRC Online", "u": "admin@businesscentral.com"},
                {"s": "Companies House", "u": "john.smith@bc.com"}
            ],
            "supplierPayments": [
                {"p": "PO-2026-501", "s": "Prime Office", "a": "$450", "st": "Pending"},
                {"p": "PO-2026-502", "s": "Global Logistics", "a": "$1,800", "st": "Paid"}
            ],
            "sales": [
                {
                    "i": inv.number,
                    "c": inv.client,
                    "a": f"${inv.amount:,.0f}" if inv.amount is not None else "$0",
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
                    "a": m.asset.name if m.asset else "Unknown Asset",
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
            "activity": [
                {"t": "2m", "a": f"{user_name} viewed dashboard."},
                {"t": "15m", "a": "System backup successful."},
            ],
            "renewals": [
                {"e": "Alpha Trading", "d": "3 Days", "u": True},
            ],
            "reminders": [
                {
                    "id": str(r.id),
                    "title": r.title,
                    "business": business_scope,
                    "priority": r.priority,
                    "type": "General"
                } for r in reminders
            ],
            "pl": {
                "income": "$482,800",
                "expenses": "$237,585",
                "grossProfit": "$245,215",
                "tax": "$49,043",
                "netProfit": "$196,172",
            },
            "emails": [
                {"email": user_email or "N/A", "label": "Primary Account", "status": "Connected", "type": "primary"}
            ]
        })
