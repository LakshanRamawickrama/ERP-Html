from rest_framework import serializers
from .models import Vehicle, Delivery, ParcelPartner

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'

class ParcelPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParcelPartner
        fields = '__all__'
