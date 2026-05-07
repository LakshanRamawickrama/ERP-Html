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
                "v": v.name,
                "p": v.plate_number,
                "i": str(v.insurance_date) if v.insurance_date else "—",
                "s": v.status,
            }
            for v in vehicles[:8]
        ]

        # ── VAT / Tax ──────────────────────────────────────────────────
        vat_data = [
            {
                "type":   v.type,
                "period": v.period,
                "amount": _fmt(v.amount),
                "status": v.status,
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
                "b":  b.bank_name,
                "n":  b.account_name,
                "bl": b.account_type,
            }
            for b in banks_qs[:6]
        ]

        # ── Maintenance Requests ───────────────────────────────────────
        maintenance_data = []
        for m in maintenance[:6]:
            try:
                asset_name = m.asset.name if m.asset_id else "—"
            except Exception:
                asset_name = "—"
            maintenance_data.append({"a": asset_name, "p": m.priority, "s": m.status})

        # ── Low Stock Alerts ───────────────────────────────────────────
        low_stock_data = [
            {
                "i": p.name,
                "c": p.quantity,
                "s": "Out of Stock" if p.quantity == 0 else "Low Stock",
            }
            for p in products if p.quantity <= p.min_stock
        ][:6]

        # ── Supplier Payments ──────────────────────────────────────────
        supplier_payments_data = []
        for o in orders.order_by('-id')[:6]:
            try:
                sup_name = o.supplier.name if o.supplier_id else "—"
            except Exception:
                sup_name = "—"
            supplier_payments_data.append({"p": o.number, "s": sup_name, "a": _fmt(o.amount), "st": o.status})

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

        # ── Upcoming Renewals ──────────────────────────────────────────
        renewals_data = []
        legal_docs = get_filtered_queryset(request, LegalDocument)
        try:
            for ins in insurances.filter(expiry_date__gte=today).order_by('expiry_date')[:4]:
                renewals_data.append({
                    "e": f"{ins.type} — {ins.provider}",
                    "d": str(ins.expiry_date),
                    "u": ins.expiry_date <= today + timedelta(days=30),
                })
        except Exception:
            pass
        try:
            for lic in licences.filter(expiry_date__gte=today).order_by('expiry_date')[:3]:
                renewals_data.append({
                    "e": f"{lic.type} ({lic.business})",
                    "d": str(lic.expiry_date),
                    "u": lic.expiry_date <= today + timedelta(days=30),
                })
        except Exception:
            pass
        try:
            for doc in legal_docs.filter(expiry_date__gte=today).order_by('expiry_date')[:4]:
                renewals_data.append({
                    "e": f"{doc.title} ({doc.type})",
                    "d": str(doc.expiry_date),
                    "u": doc.expiry_date <= today + timedelta(days=30),
                })
        except Exception:
            pass

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
                passwords_data.append({"s": cred.service, "u": cred.account})

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
        notes_data = [{"id": str(n.id), "text": n.text} for n in notes_qs]

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
            "renewals":         renewals_data,
            "reminders":        reminders_data,
            "passwords":        passwords_data,
            "emails":           emails_data,
            "notes":            notes_data,
            "todos":            [],
        })


class ReportsDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        invoices     = get_filtered_queryset(request, Invoice)
        transactions = get_filtered_queryset(request, Transaction)

        total_income  = sum(t.amount for t in transactions if t.type == 'Income')
        total_expense = sum(t.amount for t in transactions if t.type == 'Expense')

        return Response({
            "summary": {
                "income":  float(total_income),
                "expense": float(total_expense),
                "profit":  float(total_income - total_expense),
            }
        })
