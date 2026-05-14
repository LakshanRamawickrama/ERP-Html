from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Asset, MaintenanceRequest, WasteCollection, PropertyLicence
from .serializers import AssetSerializer, MaintenanceRequestSerializer, WasteCollectionSerializer, PropertyLicenceSerializer
from apps.users.utils import get_filtered_queryset
from apps.business.models import BusinessEntity

class PropertyDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        assets = get_filtered_queryset(request, Asset)
        requests = get_filtered_queryset(request, MaintenanceRequest)
        waste = get_filtered_queryset(request, WasteCollection)
        licences = get_filtered_queryset(request, PropertyLicence)

        user_business = getattr(request.user, 'assigned_business', 'All')
        return Response({
            "assets": AssetSerializer(assets, many=True, context={'request': request}).data,
            "requests": MaintenanceRequestSerializer(requests, many=True, context={'request': request}).data,
            "waste": WasteCollectionSerializer(waste, many=True, context={'request': request}).data,
            "licences": PropertyLicenceSerializer(licences, many=True, context={'request': request}).data,
            "options": {
                "assetTypes": ["HVAC", "Elevator", "Electrical", "Plumbing", "Security", "Fire Safety"],
                "priorities": ["Urgent", "Standard", "Low"],
                "statuses": ["Active", "Expired", "Pending"],
                "businesses": [user_business] if user_business != 'All' else list(BusinessEntity.objects.values_list('name', flat=True).distinct())
            }
        })

class PropertyLicenceView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            licence = PropertyLicence.objects.create(
                type=data.get('type', ''),
                business=getattr(request.user, 'assigned_business', data.get('biz', '')),
                authority=data.get('auth', ''),
                issue_date=data.get('issue_date') or data.get('issue') or '2024-01-01',
                expiry_date=data.get('expiry_date') or data.get('expiry') or '2099-01-01',
                status=data.get('status', 'Active'),
                document=files.get('document'),
                created_by=request.user.email
            )
            return Response(PropertyLicenceSerializer(licence, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
