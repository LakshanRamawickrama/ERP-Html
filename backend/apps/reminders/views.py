from .models import Reminder
from .serializers import ReminderSerializer

class ReminderDataView(APIView):
    def get(self, request):
        reminders = Reminder.objects.all()
        
        return Response(ReminderSerializer(reminders, many=True).data)
