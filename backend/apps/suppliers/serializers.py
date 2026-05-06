from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Supplier, PurchaseOrder

class SupplierSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    contact = serializers.CharField(source='contact_person', read_only=True)
    cat = serializers.CharField(source='category', read_only=True)
    
    class Meta:
        model = Supplier
        fields = '__all__'

class PurchaseOrderSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = '__all__'
