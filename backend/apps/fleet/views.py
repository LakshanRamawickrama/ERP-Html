from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Vehicle, Delivery, ParcelPartner
from .serializers import VehicleSerializer, DeliverySerializer, ParcelPartnerSerializer
from apps.users.utils import get_filtered_queryset
from django.utils import timezone
from django.shortcuts import get_object_or_404

class FleetDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        vehicles = get_filtered_queryset(request, Vehicle)
        deliveries = get_filtered_queryset(request, Delivery)
        partners = get_filtered_queryset(request, ParcelPartner)

        user_business = getattr(request.user, 'assigned_business', 'All')
        
        return Response({
            "vehicles": VehicleSerializer(vehicles, many=True, context={'request': request}).data,
            "deliveries": DeliverySerializer(deliveries, many=True, context={'request': request}).data,
            "parcels": ParcelPartnerSerializer(partners, many=True, context={'request': request}).data,
            "reminders": [], # Centralized in Reminders module
            "options": {
                "businesses": [user_business] if user_business != 'All' else ["Main Retail Store", "Logistics Hub", "Whiterock Retail Ltd"],
                "vehicles": [f"{v.name} ({v.plate_number})" for v in vehicles],
                "vehicleShort": [v.name for v in vehicles],
                "deliveryStatuses": ["Pending", "In Transit", "Delivered", "Failed"],
                "agreementStatuses": ["Active", "Pending Review", "Terminated"],
                "remindOptions": ["15 Days", "30 Days", "60 Days", "90 Days"]
            }
        })

class VehicleView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            user_business = getattr(request.user, 'assigned_business', 'All')
            target_business = user_business if user_business != 'All' else data.get('biz', '')
            remind_val = 30
            raw_remind = data.get('reminderBefore', '30')
            if ' ' in str(raw_remind): remind_val = int(str(raw_remind).split(' ')[0])
            elif str(raw_remind).isdigit(): remind_val = int(raw_remind)

            vehicle = Vehicle.objects.create(
                name=data.get('name', ''),
                plate_number=data.get('plate', ''),
                business=target_business,
                mot_date=data.get('mot') or None,
                insurance_date=data.get('ins') or None,
                road_tax_date=data.get('tax') or None,
                reminder_before=remind_val,
                fuel_type=data.get('fuelType', ''),
                status=data.get('status', 'Active'),
                notes=data.get('notes', ''),
                ins_doc=files.get('insDoc'),
                mot_doc=files.get('motDoc'),
                tax_doc=files.get('taxDoc'),
                other_doc=files.get('otherDoc'),
                created_by=request.user.email
            )
            return Response(VehicleSerializer(vehicle, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        # Handle mock IDs from frontend gracefully for demo purposes
        if pk.startswith('vehicle-'):
            return Response({'message': 'Mock record updated'}, status=status.HTTP_200_OK)
            
        vehicle = get_object_or_404(Vehicle, pk=pk)
        data = request.data
        files = request.FILES
        try:
            vehicle.name = data.get('name', vehicle.name)
            vehicle.plate_number = data.get('plate', vehicle.plate_number)
            vehicle.mot_date = data.get('mot', vehicle.mot_date)
            vehicle.insurance_date = data.get('ins', vehicle.insurance_date)
            vehicle.road_tax_date = data.get('tax', vehicle.road_tax_date)
            vehicle.status = data.get('status', vehicle.status)
            vehicle.fuel_type = data.get('fuelType', vehicle.fuel_type)
            vehicle.notes = data.get('notes', vehicle.notes)
            
            if 'insDoc' in files: vehicle.ins_doc = files['insDoc']
            if 'motDoc' in files: vehicle.mot_doc = files['motDoc']
            if 'taxDoc' in files: vehicle.tax_doc = files['taxDoc']
            if 'otherDoc' in files: vehicle.other_doc = files['otherDoc']
            
            vehicle.save()
            return Response(VehicleSerializer(vehicle, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if pk.startswith('vehicle-'): return Response(status=status.HTTP_204_NO_CONTENT)
        vehicle = get_object_or_404(Vehicle, pk=pk)
        vehicle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DeliveryView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            v_name = data.get('v', '').split(' (')[0]
            vehicle = Vehicle.objects.filter(name=v_name).first()
            user_business = getattr(request.user, 'assigned_business', 'All')
            delivery = Delivery.objects.create(
                vehicle=vehicle,
                pickup_date=data.get('pickupDate') or None,
                delivery_date=data.get('date') or None,
                address=data.get('addr', ''),
                contact_person=data.get('contact', ''),
                contact_number=data.get('contactNum', ''),
                status=data.get('status', 'Pending'),
                notes=data.get('notes', ''),
                business=user_business if user_business != 'All' else (vehicle.business if vehicle else ''),
                created_by=request.user.email
            )
            return Response(DeliverySerializer(delivery, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        if pk.startswith('delivery-'): return Response({'message': 'Mock record updated'}, status=status.HTTP_200_OK)
        delivery = get_object_or_404(Delivery, pk=pk)
        data = request.data
        try:
            v_name = data.get('v', '').split(' (')[0]
            vehicle = Vehicle.objects.filter(name=v_name).first()
            delivery.vehicle = vehicle if vehicle else delivery.vehicle
            delivery.pickup_date = data.get('pickupDate', delivery.pickup_date)
            delivery.delivery_date = data.get('date', delivery.delivery_date)
            delivery.address = data.get('addr', delivery.address)
            delivery.contact_person = data.get('contact', delivery.contact_person)
            delivery.contact_number = data.get('contactNum', delivery.contact_number)
            delivery.status = data.get('status', delivery.status)
            delivery.notes = data.get('notes', delivery.notes)
            delivery.save()
            return Response(DeliverySerializer(delivery, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if pk.startswith('delivery-'): return Response(status=status.HTTP_204_NO_CONTENT)
        delivery = get_object_or_404(Delivery, pk=pk)
        delivery.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ParcelPartnerView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            v_name = data.get('v', '')
            vehicle = Vehicle.objects.filter(name=v_name).first()
            user_business = getattr(request.user, 'assigned_business', 'All')
            partner = ParcelPartner.objects.create(
                provider=data.get('provider', ''),
                vehicle=vehicle,
                service_date=data.get('date') or None,
                area=data.get('area', ''),
                contact_name=data.get('contact', ''),
                contact_number=data.get('contactNum', ''),
                status=data.get('status', 'Active'),
                notes=data.get('notes', ''),
                business=user_business if user_business != 'All' else (vehicle.business if vehicle else ''),
                created_by=request.user.email
            )
            return Response(ParcelPartnerSerializer(partner, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        if pk.startswith('parcel-'): return Response({'message': 'Mock record updated'}, status=status.HTTP_200_OK)
        partner = get_object_or_404(ParcelPartner, pk=pk)
        data = request.data
        try:
            v_name = data.get('v', '')
            vehicle = Vehicle.objects.filter(name=v_name).first()
            partner.provider = data.get('provider', partner.provider)
            partner.vehicle = vehicle if vehicle else partner.vehicle
            partner.service_date = data.get('date', partner.service_date)
            partner.area = data.get('area', partner.area)
            partner.contact_name = data.get('contact', partner.contact_name)
            partner.contact_number = data.get('contactNum', partner.contact_number)
            partner.status = data.get('status', partner.status)
            partner.notes = data.get('notes', partner.notes)
            partner.save()
            return Response(ParcelPartnerSerializer(partner, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if pk.startswith('parcel-'): return Response(status=status.HTTP_204_NO_CONTENT)
        partner = get_object_or_404(ParcelPartner, pk=pk)
        partner.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
