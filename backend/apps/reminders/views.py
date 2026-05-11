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
        
        # Sort by date (optional, but good for UX)
        data.sort(key=lambda x: x.get('date', ''), reverse=False)
        
        return Response(data)
