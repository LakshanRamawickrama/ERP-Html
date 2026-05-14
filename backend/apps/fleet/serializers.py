from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Vehicle, Delivery, ParcelPartner, Parcel

class VehicleSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    plate = serializers.CharField(source='plate_number', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
    mot = serializers.DateField(source='mot_date', read_only=True)
    ins = serializers.DateField(source='insurance_date', read_only=True)
    tax = serializers.DateField(source='road_tax_date', read_only=True)
    ins_doc_url = serializers.SerializerMethodField()
    mot_doc_url = serializers.SerializerMethodField()
    tax_doc_url = serializers.SerializerMethodField()
    other_doc_url = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = '__all__'

    def _file_url(self, request, field):
        if field and hasattr(field, 'url'):
            return request.build_absolute_uri(field.url) if request else field.url
        return None

    def get_ins_doc_url(self, obj):
        return self._file_url(self.context.get('request'), obj.ins_doc)

    def get_mot_doc_url(self, obj):
        return self._file_url(self.context.get('request'), obj.mot_doc)

    def get_tax_doc_url(self, obj):
        return self._file_url(self.context.get('request'), obj.tax_doc)

    def get_other_doc_url(self, obj):
        return self._file_url(self.context.get('request'), obj.other_doc)

class DeliverySerializer(MongoSerializerMixin, serializers.ModelSerializer):
    date = serializers.DateField(source='delivery_date', read_only=True)
    pickupDate = serializers.DateField(source='pickup_date', read_only=True)
    v = serializers.SerializerMethodField()
    biz = serializers.CharField(source='business', read_only=True)
    vNum = serializers.CharField(source='vehicle.plate_number', read_only=True)
    addr = serializers.CharField(source='address', read_only=True)
    contact = serializers.CharField(source='contact_person', read_only=True)
    contactNum = serializers.CharField(source='contact_number', read_only=True)
    
    class Meta:
        model = Delivery
        fields = '__all__'

    def get_v(self, obj):
        if obj.vehicle:
            return f"{obj.vehicle.name} ({obj.vehicle.plate_number})"
        return ""

class ParcelPartnerSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    provider = serializers.CharField(read_only=True)
    v = serializers.CharField(source='vehicle.name', read_only=True)
    date = serializers.DateField(source='service_date', read_only=True)
    contact = serializers.CharField(source='contact_name', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
    contactNum = serializers.CharField(source='contact_number', read_only=True)
    
    class Meta:
        model = ParcelPartner
        fields = '__all__'

class ParcelSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Parcel
        fields = '__all__'
