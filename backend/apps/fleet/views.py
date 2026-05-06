from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Vehicle, Delivery, ParcelPartner
from .serializers import VehicleSerializer, DeliverySerializer, ParcelPartnerSerializer

from datetime import datetime

class FleetDataView(APIView):
    def get(self, request):
        vehicles = Vehicle.objects.all()
        deliveries = Delivery.objects.all()
        partners = ParcelPartner.objects.all()
        
        reminders = []
        today = datetime.now().date()
        for v in vehicles:
            if v.mot_date:
                days_left = (v.mot_date - today).days
                if days_left <= 30:
                    reminders.append({"v": v.name, "task": "MOT Renewal", "date": str(v.mot_date), "urgent": days_left < 15})
            if v.insurance_date:
                days_left = (v.insurance_date - today).days
                if days_left <= 30:
                    reminders.append({"v": v.name, "task": "Insurance Renewal", "date": str(v.insurance_date), "urgent": days_left < 15})

        return Response({
            "vehicles": VehicleSerializer(vehicles, many=True).data,
            "deliveries": DeliverySerializer(deliveries, many=True).data,
            "parcels": ParcelPartnerSerializer(partners, many=True).data,
            "reminders": reminders,
            "options": {
                "businesses": ["Main Retail Store", "Logistics Hub", "Whiterock Retail Ltd"],
                "vehicles": [f"{v.name} ({v.plate_number})" for v in vehicles],
                "vehicleShort": [v.name for v in vehicles],
                "deliveryStatuses": ["Pending", "In Transit", "Delivered", "Failed"],
                "agreementStatuses": ["Active", "Pending Review", "Terminated"]
            }
        })
