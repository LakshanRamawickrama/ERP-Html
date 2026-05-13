from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Product, StockMovement

class ProductSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    biz = serializers.CharField(source='business', read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

class StockMovementSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    date = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
    
    class Meta:
        model = StockMovement
        fields = '__all__'
