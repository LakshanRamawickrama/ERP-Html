from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SystemCredential, SystemAlert
from .serializers import SystemCredentialSerializer, SystemAlertSerializer

class SystemDataView(APIView):
    def get(self, request):
        credentials = SystemCredential.objects.all()
        alerts = SystemAlert.objects.all()
        
        return Response({
            "credentials": SystemCredentialSerializer(credentials, many=True).data,
            "alerts": SystemAlertSerializer(alerts, many=True).data,
            "options": {
                "services": ["Till Terminal", "PayPoint", "Admin Dashboard", "Cloud Storage"],
                "statuses": ["Active", "Locked", "Maintenance"]
            }
        })
