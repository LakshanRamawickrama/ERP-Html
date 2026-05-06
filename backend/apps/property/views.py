from rest_framework.views import APIView
from rest_framework.response import Response
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

    def post(self, request):
        # Handle both Asset and MaintenanceRequest based on the data provided
        if "issue" in request.data:
            serializer = MaintenanceRequestSerializer(data=request.data)
        else:
            serializer = AssetSerializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
