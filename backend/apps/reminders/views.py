from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Reminder
from .serializers import ReminderSerializer
from apps.users.models import StaffProfile

class ReminderDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_email = request.user.email
        profile = StaffProfile.objects.filter(email=user_email).first()
        business_scope = profile.assigned_business if profile else 'All'
        
        if request.user.is_superuser:
            # Super admin: show reminders they added
            reminders = Reminder.objects.filter(created_by=user_email)
        else:
            # Admin: show reminders for assigned business
            if business_scope == 'All':
                reminders = Reminder.objects.all()
            else:
                reminders = Reminder.objects.filter(business=business_scope)
        
        return Response(ReminderSerializer(reminders, many=True).data)
