from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Asset, MaintenanceRequest, WasteCollection, PropertyLicence

class AssetSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    person = serializers.CharField(source='assigned_person', read_only=True)
    type = serializers.CharField(source='asset_type', read_only=True)

    class Meta:
        model = Asset
        fields = '__all__'

class MaintenanceRequestSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    issue = serializers.CharField(read_only=True)
    prio = serializers.CharField(source='priority', read_only=True)
    tech = serializers.CharField(source='technician', read_only=True)
    asset = serializers.CharField(source='asset.name', read_only=True)

    class Meta:
        model = MaintenanceRequest
        fields = '__all__'

class WasteCollectionSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    contact = serializers.CharField(source='contact_person', read_only=True)
    addr = serializers.CharField(source='address', read_only=True)
    phone = serializers.CharField(read_only=True)

    class Meta:
        model = WasteCollection
        fields = '__all__'

class PropertyLicenceSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    biz = serializers.CharField(source='business', read_only=True)
    auth = serializers.CharField(source='authority', read_only=True)
    issue = serializers.DateField(source='issue_date', read_only=True)
    expiry = serializers.DateField(source='expiry_date', read_only=True)

    class Meta:
        model = PropertyLicence
        fields = '__all__'
