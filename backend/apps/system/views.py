from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Credential
from .serializers import CredentialSerializer

class SystemDataView(APIView):
    def get(self, request):
        credentials = Credential.objects.all()
        
        return Response({
            "credentials": CredentialSerializer(credentials, many=True).data,
            "options": {
                "services": ["Till Terminal", "PayPoint", "Admin Dashboard", "Cloud Storage"],
                "statuses": ["Active", "Locked", "Maintenance"]
            }
        })
