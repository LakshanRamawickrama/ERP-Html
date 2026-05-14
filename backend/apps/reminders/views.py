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
    
    def get(self, request, pk=None):
        if pk:
            reminder = Reminder.objects.filter(id=pk).first()
            if not reminder:
                return Response({'error': 'Not found'}, status=404)
            return Response(ReminderSerializer(reminder).data)

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
        try:
            today = timezone.now().date()
            vehicles = get_filtered_queryset(request, Vehicle)
            
            for vehicle in vehicles:
                tasks = [
                    ('MOT Renewal', vehicle.mot_date),
                    ('Insurance Renewal', vehicle.insurance_date),
                    ('Road Tax Renewal', vehicle.road_tax_date)
                ]
                
                for label, date_val in tasks:
                    if not date_val:
                        continue
                    days_until = (date_val - today).days
                    if days_until <= 7:
                        is_overdue = days_until < 0
                        data.append({
                            'id': f"fleet-{vehicle.id}-{label.replace(' ', '-')}",
                            'title': f"{vehicle.name}: {label}",
                            'description': f"Registration: {vehicle.plate_number}. This renewal is {f'OVERDUE by {abs(days_until)} days' if is_overdue else f'due in {days_until} days'}.",
                            'date': date_val.strftime('%Y-%m-%d'),
                            'priority': 'High',
                            'type': 'Fleet',
                            'business': vehicle.business,
                            'is_completed': False,
                            'is_overdue': is_overdue
                        })
        except Exception:
            pass

        # 3. Automatically generate Inventory reminders
        try:
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
        except Exception:
            pass

        # 4. Automatically generate Legal reminders
        try:
            from apps.legal.models import LegalDocument
            docs = get_filtered_queryset(request, LegalDocument)
            for doc in docs:
                days_until = (doc.expiry_date - today).days
                threshold = getattr(doc, 'reminder_days', 7)
                if days_until <= threshold:
                    is_overdue = days_until < 0
                    data.append({
                        'id': f"legal-{doc.id}",
                        'title': f"Legal: {doc.title}",
                        'description': f"Document '{doc.title}' ({doc.type}) is {f'EXPIRED' if is_overdue else f'expiring in {days_until} days'}.",
                        'date': doc.expiry_date.strftime('%Y-%m-%d'),
                        'priority': 'High' if days_until <= 3 else 'Medium',
                        'type': 'Legal',
                        'business': doc.business,
                        'is_completed': False,
                        'is_overdue': is_overdue
                    })
        except Exception:
            pass

        # 5. Automatically generate Business reminders
        try:
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
        except Exception:
            pass

        # 6. Automatically generate Accounting reminders
        try:
            from apps.accounting.models import Invoice, InsurancePolicy, VATRecord, Loan
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
                    threshold = getattr(policy, 'reminder_days', 30)
                    if days_until <= threshold:
                        is_overdue = days_until < 0
                        data.append({
                            'id': f"insurance-{policy.id}",
                            'title': f"Insurance: {policy.type}",
                            'description': f"Policy {policy.policy_number} ({policy.provider}) is {f'EXPIRED' if is_overdue else f'expiring in {days_until} days'}.",
                            'date': policy.expiry_date.strftime('%Y-%m-%d'),
                            'priority': 'High' if days_until <= 7 else 'Medium',
                            'type': 'Accounting',
                            'business': policy.business,
                            'is_completed': False,
                            'is_overdue': is_overdue
                        })

            loans = get_filtered_queryset(request, Loan)
            for loan in loans:
                if loan.next_payment_date:
                    days_until = (loan.next_payment_date - today).days
                    threshold = getattr(loan, 'reminder_days', 7)
                    if days_until <= threshold:
                        is_overdue = days_until < 0
                        data.append({
                            'id': f"loan-{loan.id}",
                            'title': f"Loan: {loan.name}",
                            'description': f"Payment of £{loan.monthly_payment} to {loan.lender} is {f'OVERDUE' if is_overdue else f'due in {days_until} days'}.",
                            'date': loan.next_payment_date.strftime('%Y-%m-%d'),
                            'priority': 'High',
                            'type': 'Accounting',
                            'business': loan.business,
                            'is_completed': False,
                            'is_overdue': is_overdue
                        })

            vat_records = get_filtered_queryset(request, VATRecord)
            for vat in vat_records:
                if vat.status != 'Paid':
                    threshold = getattr(vat, 'reminder_days', 14)
                    # Filing Reminder
                    if vat.filing_deadline:
                        days_until = (vat.filing_deadline - today).days
                        if days_until <= threshold:
                            is_overdue = days_until < 0
                            data.append({
                                'id': f"tax-file-{vat.id}",
                                'title': f"Tax Filing: {vat.type}",
                                'description': f"Filing for {vat.type} is {f'OVERDUE' if is_overdue else f'due in {days_until} days'}.",
                                'date': vat.filing_deadline.strftime('%Y-%m-%d'),
                                'priority': 'High' if days_until <= 3 else 'Medium',
                                'type': 'Accounting',
                                'business': vat.business,
                                'is_completed': False,
                                'is_overdue': is_overdue
                            })
                    # Payment Reminder
                    if vat.payment_due:
                        days_until = (vat.payment_due - today).days
                        if days_until <= threshold:
                            is_overdue = days_until < 0
                            data.append({
                                'id': f"tax-pay-{vat.id}",
                                'title': f"Tax Payment: {vat.type}",
                                'description': f"Payment of £{vat.amount} for {vat.type} is {f'OVERDUE' if is_overdue else f'due in {days_until} days'}.",
                                'date': vat.payment_due.strftime('%Y-%m-%d'),
                                'priority': 'High' if days_until <= 5 else 'Medium',
                                'type': 'Accounting',
                                'business': vat.business,
                                'is_completed': False,
                                'is_overdue': is_overdue
                            })
        except Exception:
            pass

        # 7. Automatically generate Property reminders
        try:
            from apps.property.models import PropertyLicence
            licences = get_filtered_queryset(request, PropertyLicence)
            for lic in licences:
                days_until = (lic.expiry_date - today).days
                threshold = getattr(lic, 'reminder_days', 30)
                if days_until <= threshold:
                    is_overdue = days_until < 0
                    data.append({
                        'id': f"property-{lic.id}",
                        'title': f"Licence: {lic.type}",
                        'description': f"{lic.authority} licence for {lic.business} is {f'EXPIRED' if is_overdue else f'expiring in {days_until} days'}.",
                        'date': lic.expiry_date.strftime('%Y-%m-%d'),
                        'priority': 'High' if days_until <= 7 else 'Medium',
                        'type': 'Property',
                        'business': lic.business,
                        'is_completed': False,
                        'is_overdue': is_overdue
                    })
        except Exception:
            pass

        # 8. Automatically generate System alerts
        try:
            from apps.system.models import SystemAlert
            sys_alerts = SystemAlert.objects.all()
            for alert in sys_alerts:
                data.append({
                    'id': f"system-{alert.id}",
                    'title': f"System: {alert.label}",
                    'description': alert.message,
                    'date': timezone.now().date().strftime('%Y-%m-%d'),
                    'priority': 'High' if alert.type in ['warning', 'soon'] else 'Medium',
                    'type': 'System',
                    'business': 'All',
                    'is_completed': False,
                    'is_overdue': alert.type == 'warning'
                })
        except Exception:
            pass  # SystemAlert collection may not exist yet

        # Sort by date (optional, but good for UX)
        data.sort(key=lambda x: x.get('date', ''), reverse=False)
        
        # Fetch all businesses for the form
        try:
            from apps.business.models import BusinessEntity
            businesses = list(BusinessEntity.objects.values_list('name', flat=True))
        except:
            businesses = []

        return Response({
            'reminders': data,
            'options': {
                'businesses': businesses
            }
        })

    def post(self, request):
        serializer = ReminderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user.username)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if not pk:
            return Response({'error': 'PK required'}, status=400)
        
        try:
            reminder = Reminder.objects.get(pk=pk)
            # Only allow deleting manual reminders for now
            reminder.delete()
            return Response(status=204)
        except Reminder.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
