import json
import logging
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
from .models import StaffProfile
from .serializers import StaffProfileSerializer
from apps.business.models import BusinessEntity

logger = logging.getLogger(__name__)

class UserDataView(APIView):
    def get(self, request):
        users = StaffProfile.objects.all()
        businesses = list(BusinessEntity.objects.values_list('name', flat=True))
        
        return Response({
            "registry": StaffProfileSerializer(users, many=True).data,
            "businesses": businesses
        })

class StaffView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', '')
        name = data.get('name', '')
        role = data.get('role', 'admin')
        assigned_business = data.get('assigned_business', '')
        password = data.get('password', '')

        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        if StaffProfile.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile = StaffProfile.objects.create(
                name=name,
                username=email,
                role=role,
                assigned_business=assigned_business,
                email=email,
                password=make_password(password),
                access='',
                permissions='{}',
                status='Active',
            )
            return Response(StaffProfileSerializer(profile).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            profile = StaffProfile.objects.get(pk=pk)
        except Exception:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if 'name' in data:
            profile.name = data['name']
        if 'assigned_business' in data:
            profile.assigned_business = data['assigned_business']
        if 'status' in data:
            profile.status = data['status']

        if 'permissions' in data:
            perms = data['permissions']
            if isinstance(perms, str):
                perms = json.loads(perms)
            profile.permissions = json.dumps(perms)
            access_list = [mod for mod, actions in perms.items() if 'view' in actions]
            profile.access = ', '.join(access_list)

        profile.save()
        return Response(StaffProfileSerializer(profile).data)


from rest_framework.permissions import AllowAny

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        try:
            identifier = request.data.get("username", "")
            password = request.data.get("password", "")
            print(f"DEBUG: Login attempt for identifier: {identifier}")

            # === Unified Auth: Check StaffProfile by email, name or username ===
            profile = (
                StaffProfile.objects.filter(email__iexact=identifier).first() or
                StaffProfile.objects.filter(username__iexact=identifier).first() or
                StaffProfile.objects.filter(name__iexact=identifier).first()
            )

            if profile:
                print(f"DEBUG: Found profile: {profile.name} (ID: {profile.pk})")
                # Check password (hashed in StaffProfile.password)
                if profile.password and check_password(password, profile.password):
                    print("DEBUG: Password check successful")
                    if profile.status != 'Active':
                        return Response({"status": "error", "message": "Account is not active"}, status=status.HTTP_401_UNAUTHORIZED)

                    refresh = RefreshToken.for_user(profile)
                    return Response({
                        "status": "success",
                        "token": str(refresh.access_token),
                        "user_id": str(profile.pk),
                        "username": profile.name,
                        "email": profile.email,
                        "username_field": profile.username,
                        "role": profile.role.lower().replace(' ', '_'),
                        "business": profile.assigned_business,
                        "access": profile.access,
                        "permissions": profile.permissions,
                    })
                else:
                    print("DEBUG: Password check FAILED")
            else:
                print("DEBUG: No profile found for this identifier")

            return Response({"status": "error", "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
        except Exception as e:
            logger.exception("Login error occurred")
            return Response({"status": "error", "message": f"Server error: {str(e)}"}, status=500)
