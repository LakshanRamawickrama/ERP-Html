from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from datetime import date, timedelta
import re

from apps.business.models import BusinessEntity
from apps.fleet.models import Vehicle
from apps.accounting.models import VATRecord, Invoice, Transaction, BankAccount, InsurancePolicy
from apps.property.models import MaintenanceRequest, PropertyLicence
from apps.legal.models import LegalDocument
from apps.inventory.models import Product
from apps.suppliers.models import PurchaseOrder
from apps.reminders.models import Reminder
from apps.system.models import SystemCredential, ConnectedEmail, Note
from apps.users.utils import get_filtered_queryset


def _fmt(amount):
    try:
        return f"${float(amount):,.2f}"
    except Exception:
        return "$0.00"


def _slugify(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


class DashboardDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        is_super = request.user.is_superuser
        today = date.today()

        # ── Role-filtered querysets ────────────────────────────────────
        vehicles      = get_filtered_queryset(request, Vehicle)
        vat_qs        = get_filtered_queryset(request, VATRecord)
        invoices      = get_filtered_queryset(request, Invoice)
        transactions  = get_filtered_queryset(request, Transaction)
        banks_qs      = get_filtered_queryset(request, BankAccount)
        maintenance   = get_filtered_queryset(request, MaintenanceRequest)
        products      = list(get_filtered_queryset(request, Product))
        orders        = get_filtered_queryset(request, PurchaseOrder)
        reminders_qs  = get_filtered_queryset(request, Reminder)
        insurances    = get_filtered_queryset(request, InsurancePolicy)
        licences      = get_filtered_queryset(request, PropertyLicence)

        # ── Business Details (super admin only) ────────────────────────
        businesses_data = []
        if is_super:
            all_invoices     = list(Invoice.objects.all())
            all_transactions = list(Transaction.objects.all())
            for e in BusinessEntity.objects.all():
                inc = sum(
                    inv.amount for inv in all_invoices
                    if inv.business == e.name and inv.status == 'Paid'
                )
                exp = sum(
                    t.amount for t in all_transactions
                    if t.business == e.name and t.type == 'Expense'
                )
                businesses_data.append({
                    "id":   str(e.id),
                    "slug": _slugify(e.name),
                    "name": e.name,
                    "inc":  _fmt(inc),
                    "exp":  _fmt(exp),
                    "st":   e.status,
                })

        # ── Fleet ──────────────────────────────────────────────────────
        fleet_data = [
            {
                "id": str(v.id),
                "v": v.name,
                "p": v.plate_number,
                "i": str(v.insurance_date) if v.insurance_date else "—",
                "mot": str(v.mot_date) if v.mot_date else "—",
                "tax": str(v.road_tax_date) if v.road_tax_date else "—",
                "notes": v.notes or "",
                "biz": v.business,
                "s": v.status,
                "docs": {
                    "ins": request.build_absolute_uri(v.ins_doc.url) if v.ins_doc else None,
                    "mot": request.build_absolute_uri(v.mot_doc.url) if v.mot_doc else None,
                    "tax": request.build_absolute_uri(v.tax_doc.url) if v.tax_doc else None,
                }
            }
            for v in vehicles[:8]
        ]

        # ── VAT / Tax ──────────────────────────────────────────────────
        vat_data = [
            {
                "id": str(v.id),
                "type":   v.type,
                "period": v.period,
                "ref": v.reference_number or "—",
                "date": str(v.date) if v.date else "—",
                "amount": _fmt(v.amount),
                "doc": request.build_absolute_uri(v.document.url) if v.document else None,
                "status": v.status,
                "biz": v.business,
            }
            for v in vat_qs[:6]
        ]

        # ── Sales (latest invoices) ────────────────────────────────────
        sales_data = [
            {
                "i": inv.number,
                "c": inv.client,
                "a": _fmt(inv.amount),
                "s": inv.status,
            }
            for inv in invoices.order_by('-id')[:6]
        ]

        # ── Bank Accounts ──────────────────────────────────────────────
        banks_data = [
            {
                "id": str(b.id),
                "b":  b.bank_name,
                "n":  b.account_name,
                "num": b.account_number,
                "sort": b.sort_code,
                "iban": b.iban or "—",
                "bl": b.account_type,
                "st": b.status,
                "biz": b.business,
            }
            for b in banks_qs[:6]
        ]

        # ── Maintenance Requests ───────────────────────────────────────
        maintenance_data = []
        for m in maintenance[:6]:
            try:
                asset_name = m.asset.name if m.asset_id else "—"
                asset_loc = m.asset.location if m.asset_id else "—"
            except Exception:
                asset_name = "—"
                asset_loc = "—"
            maintenance_data.append({
                "id": str(m.id),
                "a": asset_name, 
                "loc": asset_loc,
                "p": m.priority, 
                "s": m.status,
                "issue": m.issue,
                "tech": m.technician or "Unassigned",
                "date": str(m.date_requested) if hasattr(m, 'date_requested') else "—",
                "biz": m.business,
            })

        # ── Low Stock Alerts ───────────────────────────────────────────
        low_stock_data = [
            {
                "id": str(p.id),
                "i": p.name,
                "sku": p.sku,
                "cat": p.category,
                "c": p.quantity,
                "min": p.min_stock,
                "pr": _fmt(p.price),
                "s": "Out of Stock" if p.quantity == 0 else "Low Stock",
                "biz": p.business,
            }
            for p in products if p.quantity <= p.min_stock
        ][:6]

        # ── Supplier Payments ──────────────────────────────────────────
        supplier_payments_data = []
        for o in orders.order_by('-id')[:6]:
            try:
                sup_name = o.supplier.name if o.supplier_id else "—"
                sup_email = o.supplier.email if o.supplier_id else "—"
            except Exception:
                sup_name = "—"
                sup_email = "—"
            supplier_payments_data.append({
                "id": str(o.id),
                "p": o.number, 
                "s": sup_name, 
                "email": sup_email,
                "a": _fmt(o.amount), 
                "st": o.status,
                "prod": o.product,
                "qty": o.quantity,
                "date": str(o.date),
                "biz": o.business,
            })

        # ── Profit & Loss ──────────────────────────────────────────────
        tx_list       = list(transactions)
        total_income  = Decimal(str(sum(t.amount for t in tx_list if t.type == 'Income')))
        total_expense = Decimal(str(sum(t.amount for t in tx_list if t.type == 'Expense')))
        gross_profit  = total_income - total_expense
        tax_amount    = (gross_profit * Decimal('0.20')) if gross_profit > 0 else Decimal('0')
        net_profit    = gross_profit - tax_amount

        pl_data = {
            "income":      _fmt(total_income),
            "expenses":    _fmt(total_expense),
            "grossProfit": _fmt(gross_profit),
            "tax":         _fmt(tax_amount),
            "netProfit":   _fmt(net_profit),
        }

        # ── Recent Activity (super admin only) ─────────────────────────
        activity_data = []
        if is_super:
            for inv in Invoice.objects.order_by('-id')[:3]:
                activity_data.append({
                    "t": str(inv.due_date or ""),
                    "a": f"Invoice {inv.number} — {inv.client} ({inv.status})",
                })
            for o in PurchaseOrder.objects.order_by('-id')[:2]:
                try:
                    sup_name = o.supplier.name if o.supplier_id else "?"
                except Exception:
                    sup_name = "?"
                activity_data.append({
                    "t": str(o.date),
                    "a": f"PO {o.number} — {sup_name} ({o.status})",
                })

        # ── QuickBooks Integration ─────────────────────────────────────
        quickbooks_data = {
            "status": "Connected",
            "lastSync": "10 minutes ago",
            "bankFeed": "Active",
            "balance": "$42,850.12",
            "pending": 5
        }

        # ── Reminders ──────────────────────────────────────────────────
        reminders_data = []
        for r in reminders_qs.exclude(is_completed=True).order_by('due_date')[:6]:
            try:
                due_str = r.due_date.strftime('%Y-%m-%d') if r.due_date else ""
            except Exception:
                due_str = str(r.due_date)
            reminders_data.append({
                "id":          str(r.id),
                "title":       r.title,
                "priority":    r.priority,
                "type":        "Manual",
                "business":    r.business or "",
                "date":        due_str,
                "description": r.description,
            })

        # ── Password Vault (super admin only) ─────────────────────────
        passwords_data = []
        if is_super:
            for cred in SystemCredential.objects.all():
                passwords_data.append({
                    "id": str(cred.id),
                    "s": cred.service, 
                    "u": cred.account,
                    "p": cred.password,
                    "sup": cred.support or "N/A",
                    "st": cred.status
                })

        # ── Connected Emails (super admin only) ────────────────────────
        emails_data = []
        if is_super:
            for em in ConnectedEmail.objects.all():
                emails_data.append({
                    "id":       str(em.id),
                    "email":    em.email,
                    "label":    em.label,
                    "type":     em.type,
                    "status":   em.status,
                    "password": em.password,
                })

        # ── Notes (role-scoped) ────────────────────────────────────────
        notes_qs = get_filtered_queryset(request, Note)
        notes_data = [
            {
                "id": str(n.id), 
                "text": n.text,
                "is_pinned": n.is_pinned,
                "color": n.color,
                "created_at": str(n.created_at) if n.created_at else None
            } for n in notes_qs
        ]

        return Response({
            "businesses":       businesses_data,
            "fleet":            fleet_data,
            "vat":              vat_data,
            "sales":            sales_data,
            "banks":            banks_data,
            "maintenance":      maintenance_data,
            "lowStock":         low_stock_data,
            "supplierPayments": supplier_payments_data,
            "pl":               pl_data,
            "activity":         activity_data,
            "quickbooks":       quickbooks_data,
            "reminders":        reminders_data,
            "passwords":        passwords_data,
            "emails":           emails_data,
            "notes":            notes_data,
            "todos":            [],
        })


class ReportsDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        is_super = request.user.is_superuser
        
        # 1. Fetch all role-scoped data
        invoices      = get_filtered_queryset(request, Invoice)
        transactions  = get_filtered_queryset(request, Transaction)
        banks_qs      = get_filtered_queryset(request, BankAccount)
        vat_qs        = get_filtered_queryset(request, VATRecord)
        inventory     = get_filtered_queryset(request, Product)
        entities      = BusinessEntity.objects.all()

        # 2. Calculate Global Stats (KPIs)
        total_income = sum(t.amount for t in transactions if t.type == 'Income')
        total_income += sum(inv.amount for inv in invoices if inv.status == 'Paid')
        
        total_expense = sum(t.amount for t in transactions if t.type == 'Expense')
        total_expense += sum(VATRecord.objects.all().values_list('amount', flat=True)) # Simplified tax total
        
        inventory_count = inventory.count()

        stats = [
            {"title": "Total Revenue", "value": _fmt(total_income)},
            {"title": "Op. Costs", "value": _fmt(total_expense)},
            {"title": "Net Profit", "value": _fmt(total_income - total_expense)},
            {"title": "Inventory", "value": str(inventory_count)}
        ]

        # 3. Entity Performance Ledger (Consolidated)
        businesses_data = []
        for e in entities:
            # Skip if user is admin and not assigned to this business
            if not is_super and getattr(request.user, 'assigned_business', 'All') != 'All':
                if getattr(request.user, 'assigned_business', '') != e.name:
                    continue

            inc = sum(inv.amount for inv in invoices if inv.business == e.name and inv.status == 'Paid')
            exp = sum(t.amount for t in transactions if t.business == e.name and t.type == 'Expense')
            
            businesses_data.append({
                "id": str(e.id),
                "slug": _slugify(e.name),
                "name": e.name,
                "admin": e.manager if hasattr(e, 'manager') else "Admin",
                "inc": _fmt(inc),
                "exp": _fmt(exp),
                "st": e.status or "Active",
                "skus": Product.objects.filter(business=e.name).count(),
                "flt": Vehicle.objects.filter(business=e.name).count()
            })

        # 4. Cash & Tax Overview
        banks_data = [{"b": b.bank_name, "n": b.account_name, "bl": _fmt(BankAccount.objects.get(pk=b.pk).account_number[-4:])} for b in banks_qs[:6]] # Mocking balance with last 4 of account for now
        # Better bank handling if you have a balance field, using $10k+ for dummy look:
        banks_data = [{"b": b.bank_name, "n": b.account_name, "bl": "$12,450.00"} for b in banks_qs[:6]]

        tax_data = [{"type": v.type, "amount": _fmt(v.amount)} for v in vat_qs[:2]]

        # 5. Templates
        templates = [
            {"label": "Q1 Performance Summary", "format": "PDF"},
            {"label": "Annual Tax Projection", "format": "XLSX"},
            {"label": "Inventory Valuation", "format": "PDF"},
            {"label": "Fleet Maintenance Ledger", "format": "XLSX"}
        ]

        return Response({
            "stats": stats,
            "templates": templates,
            "businesses": businesses_data,
            "banks": banks_data,
            "tax": tax_data
        })
