from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Vehicle, Delivery, ParcelPartner

class VehicleSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    plate = serializers.CharField(source='plate_number', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
    mot = serializers.DateField(source='mot_date', read_only=True)
    ins = serializers.DateField(source='insurance_date', read_only=True)
    tax = serializers.DateField(source='road_tax_date', read_only=True)
    
    class Meta:
        model = Vehicle
        fields = '__all__'

class DeliverySerializer(MongoSerializerMixin, serializers.ModelSerializer):
    date = serializers.DateField(source='delivery_date', read_only=True)
    v = serializers.CharField(source='vehicle.name', read_only=True)
    vNum = serializers.CharField(source='vehicle.plate_number', read_only=True)
    addr = serializers.CharField(source='address', read_only=True)
    contact = serializers.CharField(source='contact_person', read_only=True)
    
    class Meta:
        model = Delivery
        fields = '__all__'

class ParcelPartnerSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    provider = serializers.CharField(read_only=True)
    v = serializers.CharField(source='vehicle.name', read_only=True)
    date = serializers.DateField(source='service_date', read_only=True)
    contact = serializers.CharField(source='contact_name', read_only=True)
    
    class Meta:
        model = ParcelPartner
        fields = '__all__'
