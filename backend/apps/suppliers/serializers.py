from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Supplier, PurchaseOrder

class SupplierSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    supId = serializers.CharField(source='supplier_id', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
    addr = serializers.CharField(source='address', read_only=True)
    notes = serializers.CharField(read_only=True)
    contact = serializers.CharField(source='contact_person', read_only=True)
    cat = serializers.CharField(source='category', read_only=True)
    
    class Meta:
        model = Supplier
        fields = '__all__'

class PurchaseOrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    num = serializers.CharField(source='number', read_only=True)
    supplier = serializers.CharField(source='supplier.name', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
    due = serializers.DateField(source='date', read_only=True)
    qty = serializers.IntegerField(source='quantity', read_only=True)
    
    class Meta:
        model = PurchaseOrder
        fields = '__all__'
