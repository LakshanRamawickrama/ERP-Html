from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.business.models import BusinessEntity
from apps.fleet.models import Vehicle
from apps.accounting.models import VATRecord, Invoice, Transaction
from apps.property.models import MaintenanceRequest
from apps.reminders.models import Reminder
from apps.users.utils import get_filtered_queryset

class DashboardDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        entities = get_filtered_queryset(request, BusinessEntity, 'name')
        vehicles = get_filtered_queryset(request, Vehicle)
        vat = get_filtered_queryset(request, VATRecord)
        maintenance = get_filtered_queryset(request, MaintenanceRequest)
        invoices = get_filtered_queryset(request, Invoice)
        reminders = get_filtered_queryset(request, Reminder)

        total_revenue = sum(inv.amount for inv in invoices if inv.status == 'Paid')
        active_vehicles = vehicles.filter(status='Active').count()
        pending_maintenance = maintenance.filter(status='Pending').count()
        urgent_reminders = reminders.filter(priority='High').count()

        return Response({
            "kpis": [
                {"label": "Total Revenue", "value": f"${total_revenue:,.2f}", "trend": "+12.5%", "color": "emerald"},
                {"label": "Active Fleet", "value": str(active_vehicles), "trend": "Stable", "color": "blue"},
                {"label": "Pending Maintenance", "value": str(pending_maintenance), "trend": "-2", "color": "amber"},
                {"label": "Urgent Reminders", "value": str(urgent_reminders), "trend": "Critical", "color": "rose"},
            ],
            "activity": [
                {"id": r.id, "type": r.priority.lower(), "title": r.title, "time": "Due Soon", "status": r.priority}
                for r in reminders[:5]
            ],
            "fleetStatus": [
                {"label": "Active", "value": active_vehicles, "color": "#10b981"},
                {"label": "In Maintenance", "value": vehicles.filter(status='Maintenance').count(), "color": "#f59e0b"},
                {"label": "Idle", "value": vehicles.filter(status='Idle').count(), "color": "#64748b"},
            ]
        })

class ReportsDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        invoices = get_filtered_queryset(request, Invoice)
        transactions = get_filtered_queryset(request, Transaction)
        
        # Simple report metrics
        total_income = sum(t.amount for t in transactions if t.type == 'Income')
        total_expense = sum(t.amount for t in transactions if t.type == 'Expense')
        
        return Response({
            "summary": {
                "income": total_income,
                "expense": total_expense,
                "profit": total_income - total_expense
            }
        })
