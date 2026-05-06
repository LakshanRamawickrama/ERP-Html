from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Vehicle, Delivery, ParcelPartner
from .serializers import VehicleSerializer, DeliverySerializer, ParcelPartnerSerializer

class FleetDataView(APIView):
    def get(self, request):
        vehicles = Vehicle.objects.all()
        deliveries = Delivery.objects.all()
        partners = ParcelPartner.objects.all()
        
        return Response({
            "vehicles": VehicleSerializer(vehicles, many=True).data,
            "deliveries": DeliverySerializer(deliveries, many=True).data,
            "parcels": ParcelPartnerSerializer(partners, many=True).data,
            "options": {
                "businesses": ["Main Corp", "Logistics Ltd", "Retail Plus"],
                "vehicles": ["CAR 1 (ABC-1234)", "VAN 2 (XYZ-9876)"],
                "deliveryStatuses": ["Pending", "In Transit", "Delivered", "Failed"],
                "agreementStatuses": ["Active", "Pending Review", "Terminated"]
            }
        })
