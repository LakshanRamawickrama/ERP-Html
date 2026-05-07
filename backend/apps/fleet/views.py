from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
            "vehicles": VehicleSerializer(vehicles, many=True, context={'request': request}).data,
            "deliveries": DeliverySerializer(deliveries, many=True, context={'request': request}).data,
            "parcels": ParcelPartnerSerializer(partners, many=True, context={'request': request}).data,
            "reminders": reminders,
            "options": {
                "businesses": ["Main Retail Store", "Logistics Hub", "Whiterock Retail Ltd"],
                "vehicles": [f"{v.name} ({v.plate_number})" for v in vehicles],
                "vehicleShort": [v.name for v in vehicles],
                "deliveryStatuses": ["Pending", "In Transit", "Delivered", "Failed"],
                "agreementStatuses": ["Active", "Pending Review", "Terminated"]
            }
        })


class VehicleView(APIView):
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            vehicle = Vehicle.objects.create(
                name=data.get('name', ''),
                plate_number=data.get('plate', ''),
                business=data.get('biz', ''),
                mot_date=data.get('mot') or None,
                insurance_date=data.get('ins') or None,
                road_tax_date=data.get('tax') or None,
                status=data.get('status', 'Active'),
                notes=data.get('notes', ''),
                ins_doc=files.get('insDoc'),
                mot_doc=files.get('motDoc'),
                tax_doc=files.get('taxDoc'),
            )
            return Response(VehicleSerializer(vehicle, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            vehicle = Vehicle.objects.get(pk=pk)
        except Vehicle.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        files = request.FILES
        vehicle.name = data.get('name', vehicle.name)
        vehicle.plate_number = data.get('plate', vehicle.plate_number)
        vehicle.business = data.get('biz', vehicle.business)
        if data.get('mot'):
            vehicle.mot_date = data.get('mot')
        if data.get('ins'):
            vehicle.insurance_date = data.get('ins')
        if data.get('tax'):
            vehicle.road_tax_date = data.get('tax')
        vehicle.status = data.get('status', vehicle.status)
        vehicle.notes = data.get('notes', vehicle.notes)
        if files.get('insDoc'):
            vehicle.ins_doc = files.get('insDoc')
        if files.get('motDoc'):
            vehicle.mot_doc = files.get('motDoc')
        if files.get('taxDoc'):
            vehicle.tax_doc = files.get('taxDoc')
        vehicle.save()
        return Response(VehicleSerializer(vehicle, context={'request': request}).data)
