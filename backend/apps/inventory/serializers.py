from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Product, StockMovement

class ProductSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    cat = serializers.CharField(source='category', read_only=True)
    stock = serializers.IntegerField(source='quantity', read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_status(self, obj):
        if obj.quantity == 0:
            return "Out of Stock"
        if obj.quantity <= obj.min_stock:
            return "Low Stock"
        return "In Stock"

class StockMovementSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    item = serializers.CharField(source='product.name', read_only=True)
    qty = serializers.IntegerField(source='quantity', read_only=True)

    class Meta:
        model = StockMovement
        fields = '__all__'
