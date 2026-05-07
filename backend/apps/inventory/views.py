from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product, StockMovement
from .serializers import ProductSerializer, StockMovementSerializer
from apps.users.utils import get_filtered_queryset

class InventoryDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        products = get_filtered_queryset(request, Product)
        movements = get_filtered_queryset(request, StockMovement)
        low_stock = [p for p in products if p.quantity <= p.min_stock]

        alerts = [
            {
                "id": str(p.id),
                "name": p.name,
                "status": "Out of Stock" if p.quantity == 0 else "Low Stock",
                "level": "out" if p.quantity == 0 else "low"
            }
            for p in low_stock
        ]

        return Response({
            "stock": ProductSerializer(products, many=True).data,
            "moves": StockMovementSerializer(movements, many=True).data,
            "alerts": alerts,
            "inventoryCategories": ["Food & Beverages", "Groceries", "Stationery", "Electronics", "Cleaning"],
            "inventoryItems": [p.name for p in products],
        })
