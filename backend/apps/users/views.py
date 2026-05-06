from rest_framework.views import APIView
from rest_framework.response import Response
from .models import StaffProfile
from .serializers import StaffProfileSerializer

class UserDataView(APIView):
    def get(self, request):
        staff = StaffProfile.objects.all()
        
        return Response({
            "registry": StaffProfileSerializer(staff, many=True).data,
            "roles": ["Super Admin", "Manager", "Staff"],
            "businesses": ["Whiterock Retail", "Global Logistics"]
        })
