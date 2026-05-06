from .models import Asset, MaintenanceRequest
from .serializers import AssetSerializer, MaintenanceRequestSerializer

class PropertyDataView(APIView):
    def get(self, request):
        assets = Asset.objects.all()
        requests = MaintenanceRequest.objects.all()
        
        return Response({
            "assets": AssetSerializer(assets, many=True).data,
            "requests": MaintenanceRequestSerializer(requests, many=True).data,
            "assetTypes": ["HVAC", "Elevator", "Electrical", "Plumbing"],
            "priorities": ["Urgent", "Standard", "Low"]
        })
