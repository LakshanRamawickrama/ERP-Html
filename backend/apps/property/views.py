from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Asset, MaintenanceRequest, WasteCollection, PropertyLicence
from .serializers import AssetSerializer, MaintenanceRequestSerializer, WasteCollectionSerializer, PropertyLicenceSerializer

class PropertyDataView(APIView):
    def get(self, request):
        assets = Asset.objects.all()
        requests = MaintenanceRequest.objects.all()
        waste = WasteCollection.objects.all()
        licences = PropertyLicence.objects.all()

        return Response({
            "assets": AssetSerializer(assets, many=True, context={'request': request}).data,
            "requests": MaintenanceRequestSerializer(requests, many=True, context={'request': request}).data,
            "waste": WasteCollectionSerializer(waste, many=True, context={'request': request}).data,
            "licences": PropertyLicenceSerializer(licences, many=True, context={'request': request}).data,
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


class PropertyLicenceView(APIView):
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            licence = PropertyLicence.objects.create(
                type=data.get('type', ''),
                business=data.get('biz', ''),
                authority=data.get('auth', ''),
                issue_date=data.get('issue_date') or data.get('issue') or '2024-01-01',
                expiry_date=data.get('expiry_date') or data.get('expiry') or '2099-01-01',
                status=data.get('status', 'Active'),
                document=files.get('document'),
            )
            return Response(PropertyLicenceSerializer(licence, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            licence = PropertyLicence.objects.get(pk=pk)
        except PropertyLicence.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data
        files = request.FILES
        licence.type = data.get('type', licence.type)
        licence.business = data.get('biz', licence.business)
        licence.authority = data.get('auth', licence.authority)
        if data.get('issue_date') or data.get('issue'):
            licence.issue_date = data.get('issue_date') or data.get('issue')
        if data.get('expiry_date') or data.get('expiry'):
            licence.expiry_date = data.get('expiry_date') or data.get('expiry')
        licence.status = data.get('status', licence.status)
        if files.get('document'):
            licence.document = files.get('document')
        licence.save()
        return Response(PropertyLicenceSerializer(licence, context={'request': request}).data)
