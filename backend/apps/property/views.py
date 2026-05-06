from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Asset, MaintenanceRequest, WasteCollection, PropertyLicence
from .serializers import AssetSerializer, MaintenanceRequestSerializer, WasteCollectionSerializer, PropertyLicenceSerializer

class PropertyDataView(APIView):
    def get(self, request):
        assets = Asset.objects.all()
        requests = MaintenanceRequest.objects.all()
        waste = WasteCollection.objects.all()
        licences = PropertyLicence.objects.all()

        return Response({
            "assets": AssetSerializer(assets, many=True).data,
            "requests": MaintenanceRequestSerializer(requests, many=True).data,
            "waste": WasteCollectionSerializer(waste, many=True).data,
            "licences": PropertyLicenceSerializer(licences, many=True).data,
            "assetTypes": ["HVAC", "Elevator", "Electrical", "Plumbing", "Security", "Fire Safety"],
            "priorities": ["Urgent", "Standard", "Low"],
            "statuses": ["Active", "Expired", "Pending"]
        })

    def post(self, request):
        if "issue" in request.data:
            serializer = MaintenanceRequestSerializer(data=request.data)
        else:
            serializer = AssetSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
