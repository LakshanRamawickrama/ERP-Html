from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Asset, MaintenanceRequest, WasteCollection, PropertyLicence

class AssetSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'

class MaintenanceRequestSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRequest
        fields = '__all__'

class WasteCollectionSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = WasteCollection
        fields = '__all__'

class PropertyLicenceSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = PropertyLicence
        fields = '__all__'
