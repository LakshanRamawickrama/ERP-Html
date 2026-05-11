from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Reminder
from .serializers import ReminderSerializer
from apps.users.models import StaffProfile
from apps.fleet.models import Vehicle
from apps.users.utils import get_filtered_queryset
from django.utils import timezone
from datetime import timedelta

class ReminderDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # 1. Fetch standard reminders from database
        if request.user.is_superuser:
            reminders_objs = Reminder.objects.all()
        else:
            user_email = request.user.email
            profile = StaffProfile.objects.filter(email=user_email).first()
            business_scope = profile.assigned_business if profile else 'All'
            
            if business_scope == 'All':
                reminders_objs = Reminder.objects.all()
            else:
                reminders_objs = Reminder.objects.filter(business=business_scope)
        
        # Serialize database reminders
        data = ReminderSerializer(reminders_objs, many=True).data
        
        # 2. Automatically generate Fleet reminders
        today = timezone.now().date()
        vehicles = get_filtered_queryset(request, Vehicle)
        
        for vehicle in vehicles:
            # Check all three dates
            tasks = [
                ('MOT Renewal', vehicle.mot_date),
                ('Insurance Renewal', vehicle.insurance_date),
                ('Road Tax Renewal', vehicle.road_tax_date)
            ]
            
            for label, date_val in tasks:
                if not date_val:
                    continue
                
                # Logic: Display if within 7 days OR if overdue
                days_until = (date_val - today).days
                
                # "Before 7 days" and "display the whole that week" and "overdue"
                # We show it if it's due in 7 days or less.
                if days_until <= 7:
                    is_overdue = days_until < 0
                    
                    # Automated fleet renewals are always High priority
                    priority = 'High'
                    
                    data.append({
                        'id': f"fleet-{vehicle.id}-{label.replace(' ', '-')}",
                        'title': f"{vehicle.name}: {label}",
                        'description': f"Registration: {vehicle.plate_number}. This renewal is {f'OVERDUE by {abs(days_until)} days' if is_overdue else f'due in {days_until} days'}.",
                        'date': date_val.strftime('%Y-%m-%d'),
                        'priority': priority,
                        'type': 'Fleet',
                        'business': vehicle.business,
                        'is_completed': False,
                        'is_overdue': is_overdue
                    })

        # 3. Automatically generate Inventory reminders
        from apps.inventory.models import Product
        products = get_filtered_queryset(request, Product)
        for product in products:
            if product.quantity <= product.min_stock:
                is_out = product.quantity == 0
                data.append({
                    'id': f"inventory-{product.id}",
                    'title': f"Inventory: {product.name}",
                    'description': f"STOCK ALERT: {product.name} is {f'OUT OF STOCK' if is_out else f'running low ({product.quantity} left)'}. Minimum level is {product.min_stock}.",
                    'date': timezone.now().date().strftime('%Y-%m-%d'),
                    'priority': 'High',
                    'type': 'Inventory',
                    'business': product.business,
                    'is_completed': False,
                    'is_overdue': is_out
                })


        # 4. Automatically generate Legal reminders
        from apps.legal.models import LegalDocument
        docs = get_filtered_queryset(request, LegalDocument)
        for doc in docs:
            days_until = (doc.expiry_date - today).days
            if days_until <= 7:
                is_overdue = days_until < 0
                data.append({
                    'id': f"legal-{doc.id}",
                    'title': f"Legal: {doc.title}",
                    'description': f"Document '{doc.title}' ({doc.type}) is {f'EXPIRED' if is_overdue else f'expiring in {days_until} days'}.",
                    'date': doc.expiry_date.strftime('%Y-%m-%d'),
                    'priority': 'High',
                    'type': 'Legal',
                    'business': doc.business,
                    'is_completed': False,
                    'is_overdue': is_overdue
                })

        # 5. Automatically generate Business reminders
        from apps.business.models import CompanyStructure
        structures = get_filtered_queryset(request, CompanyStructure)
        for struct in structures:
            days_until = (struct.filing_due - today).days
            if days_until <= 7:
                is_overdue = days_until < 0
                data.append({
                    'id': f"business-{struct.id}",
                    'title': f"Filing: {struct.name}",
                    'description': f"Companies House filing for '{struct.name}' is {f'OVERDUE' if is_overdue else f'due in {days_until} days'}.",
                    'date': struct.filing_due.strftime('%Y-%m-%d'),
                    'priority': 'High',
                    'type': 'Business',
                    'business': getattr(struct, 'business', ''),
                    'is_completed': False,
                    'is_overdue': is_overdue
                })

        # 6. Automatically generate Accounting reminders
        from apps.accounting.models import Invoice, InsurancePolicy, VATRecord
        invoices = get_filtered_queryset(request, Invoice)
        for inv in invoices:
            if inv.status != 'Paid' and inv.due_date:
                days_until = (inv.due_date - today).days
                if days_until <= 7:
                    is_overdue = days_until < 0
                    data.append({
                        'id': f"invoice-{inv.id}",
                        'title': f"Invoice: {inv.number}",
                        'description': f"Invoice {inv.number} for {inv.client} is {f'OVERDUE' if is_overdue else f'due in {days_until} days'}.",
                        'date': inv.due_date.strftime('%Y-%m-%d'),
                        'priority': 'High',
                        'type': 'Accounting',
                        'business': inv.business,
                        'is_completed': False,
                        'is_overdue': is_overdue
                    })

        policies = get_filtered_queryset(request, InsurancePolicy)
        for policy in policies:
            if policy.expiry_date:
                days_until = (policy.expiry_date - today).days
                if days_until <= 7:
                    is_overdue = days_until < 0
                    data.append({
                        'id': f"insurance-{policy.id}",
                        'title': f"Policy: {policy.type}",
                        'description': f"Insurance policy {policy.policy_number} ({policy.provider}) is {f'EXPIRED' if is_overdue else f'expiring in {days_until} days'}.",
                        'date': policy.expiry_date.strftime('%Y-%m-%d'),
                        'priority': 'High',
                        'type': 'Accounting',
                        'business': policy.business,
                        'is_completed': False,
                        'is_overdue': is_overdue
                    })

        # Sort by date (optional, but good for UX)
        data.sort(key=lambda x: x.get('date', ''), reverse=False)
        
        return Response(data)
