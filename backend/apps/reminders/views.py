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
            from apps.fleet.models import Vehicle, Delivery, ParcelPartner
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
            
            # Deliveries
            deliveries = get_filtered_queryset(request, Delivery)
            for d in deliveries:
                if d.delivery_date:
                    days_until = (d.delivery_date - today).days
                    threshold = getattr(d, 'reminder_days', 1)
                    if days_until <= threshold:
                        is_overdue = days_until < 0
                        data.append({
                            'id': f"fleet-delivery-{d.id}",
                            'title': f"Delivery: {d.address[:20]}...",
                            'description': f"Delivery to {d.address} is {f'OVERDUE' if is_overdue else f'due in {days_until} days'}.",
                            'date': d.delivery_date.strftime('%Y-%m-%d'),
                            'priority': 'High' if days_until <= 0 else 'Medium',
                            'type': 'Fleet',
                            'business': d.business,
                            'is_completed': False,
                            'is_overdue': is_overdue
                        })
            
            # Parcel Partners
            partners = get_filtered_queryset(request, ParcelPartner)
            for p in partners:
                if p.service_date:
                    days_until = (p.service_date - today).days
                    threshold = getattr(p, 'reminder_days', 7)
                    if days_until <= threshold:
                        is_overdue = days_until < 0
                        data.append({
                            'id': f"fleet-service-{p.id}",
                            'title': f"Service: {p.provider}",
                            'description': f"Service with {p.provider} is {f'EXPIRED' if is_overdue else f'due in {days_until} days'}.",
                            'date': p.service_date.strftime('%Y-%m-%d'),
                            'priority': 'High' if days_until <= 2 else 'Medium',
                            'type': 'Fleet',
                            'business': p.business,
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
                threshold = getattr(struct, 'reminder_days', 30)
                
                # Filing Due
                days_until_filing = (struct.filing_due - today).days
                if days_until_filing <= threshold:
                    is_overdue = days_until_filing < 0
                    data.append({
                        'id': f"business-file-{struct.id}",
                        'title': f"Filing: {struct.name}",
                        'description': f"Companies House filing for '{struct.name}' is {f'OVERDUE' if is_overdue else f'due in {days_until_filing} days'}.",
                        'date': struct.filing_due.strftime('%Y-%m-%d'),
                        'priority': 'High' if days_until_filing <= 7 else 'Medium',
                        'type': 'Business',
                        'business': getattr(struct, 'business', ''),
                        'is_completed': False,
                        'is_overdue': is_overdue
                    })
                
                # Confirmation Statement
                if getattr(struct, 'confirmation_statement_due', None):
                    days_until_cs = (struct.confirmation_statement_due - today).days
                    if days_until_cs <= threshold:
                        is_overdue = days_until_cs < 0
                        data.append({
                            'id': f"business-cs-{struct.id}",
                            'title': f"CS Due: {struct.name}",
                            'description': f"Confirmation Statement for '{struct.name}' is {f'OVERDUE' if is_overdue else f'due in {days_until_cs} days'}.",
                            'date': struct.confirmation_statement_due.strftime('%Y-%m-%d'),
                            'priority': 'High' if days_until_cs <= 7 else 'Medium',
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

        # 6.5 Automatically generate Payment Service (Lottery) reminders
        try:
            from apps.accounting.models import PaymentServiceRecord
            # For Lottery, we scan all records and filter by provider
            if request.user.is_superuser:
                services = PaymentServiceRecord.objects.all()
            else:
                services = get_filtered_queryset(request, PaymentServiceRecord, business_field='business')
            
            for s in services:
                # Case-insensitive provider check
                is_lottery = s.provider and s.provider.lower() == 'lottery'
                if is_lottery and s.draw_date:
                    days_until = (s.draw_date - today).days
                    # Use a default threshold of 2 days if not set
                    threshold = getattr(s, 'reminder_days', 2)
                    if threshold is None: threshold = 2
                    
                    if days_until <= threshold:
                        is_overdue = days_until < 0
                        game_name = s.game_type or "Lottery"
                        biz_name = s.business or s.biz or "Unknown Business"
                        
                        data.append({
                            'id': f"lottery-auto-{s.id}",
                            'title': f"Lottery Draw: {game_name}",
                            'description': f"Draw for {game_name} is {f'OVERDUE' if is_overdue else f'due in {days_until} days'}.",
                            'date': s.draw_date.strftime('%Y-%m-%d'),
                            'priority': 'High' if days_until <= 0 else 'Medium',
                            'type': 'Accounting',
                            'business': biz_name,
                            'is_completed': False,
                            'is_overdue': is_overdue
                        })
        except Exception as e:
            # Add a debug reminder if this block fails (only visible in dev)
            pass

        # 7. Automatically generate Property reminders
        try:
            from apps.property.models import PropertyLicence, WasteCollection
            licences = get_filtered_queryset(request, PropertyLicence)
            for lic in licences:
                days_until = (lic.expiry_date - today).days
                threshold = getattr(lic, 'reminder_days', 30)
                if days_until <= threshold:
                    is_overdue = days_until < 0
                    data.append({
                        'id': f"property-lic-{lic.id}",
                        'title': f"Licence: {lic.type}",
                        'description': f"{lic.authority} licence for {lic.business} is {f'EXPIRED' if is_overdue else f'expiring in {days_until} days'}.",
                        'date': lic.expiry_date.strftime('%Y-%m-%d'),
                        'priority': 'High' if days_until <= 7 else 'Medium',
                        'type': 'Property',
                        'business': lic.business,
                        'is_completed': False,
                        'is_overdue': is_overdue
                    })
            
            # Waste Collection (Pick-up Date)
            waste = get_filtered_queryset(request, WasteCollection)
            for w in waste:
                if w.date:
                    days_until = (w.date - today).days
                    threshold = getattr(w, 'reminder_days', 7)
                    if days_until <= threshold:
                        is_overdue = days_until < 0
                        data.append({
                            'id': f"property-waste-{w.id}",
                            'title': f"Waste Pick-up: {w.business}",
                            'description': f"Waste collection at {w.address} is {f'OVERDUE' if is_overdue else f'scheduled in {days_until} days'}.",
                            'date': w.date.strftime('%Y-%m-%d'),
                            'priority': 'High' if days_until <= 1 else 'Medium',
                            'type': 'Property',
                            'business': w.business,
                            'is_completed': False,
                            'is_overdue': is_overdue
                        })
        except Exception:
            pass

        # 8. Automatically generate Supplier reminders
        try:
            from apps.suppliers.models import PurchaseOrder
            orders = get_filtered_queryset(request, PurchaseOrder)
            for order in orders:
                due_date = order.delivery_due_date or order.date
                if due_date:
                    days_until = (due_date - today).days
                    threshold = getattr(order, 'reminder_days', 3)
                    if days_until <= threshold:
                        is_overdue = days_until < 0
                        data.append({
                            'id': f"supplier-po-{order.id}",
                            'title': f"Order Delivery: {order.number}",
                            'description': f"Order {order.number} from {order.supplier.name} is {f'OVERDUE' if is_overdue else f'due in {days_until} days'}.",
                            'date': due_date.strftime('%Y-%m-%d'),
                            'priority': 'High' if days_until <= 1 else 'Medium',
                            'type': 'Suppliers',
                            'business': order.business,
                            'is_completed': False,
                            'is_overdue': is_overdue
                        })
        except Exception:
            pass

        # 9. Automatically generate System alerts (Super Admin only)
        try:
            from apps.system.models import SystemAlert
            if request.user.is_superuser:
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
        # 10. Add business entities list for dropdowns (aggregated from all modules for Superadmins)
        try:
            from apps.business.models import BusinessEntity
            from apps.fleet.models import Vehicle
            from apps.inventory.models import Product
            from apps.accounting.models import Invoice, VATRecord, PaymentServiceRecord
            from apps.property.models import PropertyLicence
            
            # Start with official business entities
            all_biz = set(BusinessEntity.objects.values_list('name', flat=True))
            
            # Add businesses found in other modules to ensure Superadmin sees everything
            all_biz.update(Vehicle.objects.values_list('business', flat=True))
            all_biz.update(Product.objects.values_list('business', flat=True))
            all_biz.update(Invoice.objects.values_list('business', flat=True))
            all_biz.update(VATRecord.objects.values_list('business', flat=True))
            all_biz.update(PropertyLicence.objects.values_list('business', flat=True))
            all_biz.update(PaymentServiceRecord.objects.values_list('biz', flat=True))
            all_biz.update(PaymentServiceRecord.objects.values_list('business', flat=True))
            
            # Clean up: remove None/Empty and sort
            businesses = sorted([b for b in all_biz if b])
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
