from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import StaffProfile
from .serializers import StaffProfileSerializer

class UserDataView(APIView):
    def get(self, request):
        staff = StaffProfile.objects.all()
        system_map = [
            {
                "name": "Core Management",
                "sub": ["Business Management", "User Management", "System Access", "Role Permissions"]
            },
            {
                "name": "Operations",
                "sub": ["Fleet Management", "Inventory Management", "Suppliers"]
            },
            {
                "name": "Financials",
                "sub": ["Accounting", "Reports"]
            },
            {
                "name": "Compliance & Assets",
                "sub": ["Legal & Compliance", "Property Management", "Reminders"]
            }
        ]
        
        return Response({
            "registry": StaffProfileSerializer(staff, many=True).data,
            "roles": ["super_admin", "admin"],
            "businesses": ["Whiterock Retail", "Global Logistics"],
            "systemMap": system_map
        })

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        
        if user:
            # Generate JWT Token
            refresh = RefreshToken.for_user(user)
            
            # Look up role and assigned business in StaffProfile
            try:
                profile = StaffProfile.objects.get(email=user.email)
                role = profile.role.lower().replace(' ', '_')
                business = profile.assigned_business
            except StaffProfile.DoesNotExist:
                role = 'super_admin' if user.is_superuser else 'admin'
                business = 'All'
                
            return Response({
                "status": "success",
                "token": str(refresh.access_token),
                "user_id": user.username,
                "username": user.username,
                "role": role,
                "business": business
            })
            
        return Response({"status": "error", "message": "Invalid credentials"}, status=401)
