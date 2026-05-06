from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Reminder
from .serializers import ReminderSerializer

class ReminderDataView(APIView):
    def get(self, request):
        reminders = Reminder.objects.all()
        
        return Response(ReminderSerializer(reminders, many=True).data)
