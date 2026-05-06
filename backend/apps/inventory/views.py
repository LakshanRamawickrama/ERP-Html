from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product, StockMovement
from .serializers import ProductSerializer, StockMovementSerializer

class InventoryDataView(APIView):
    def get(self, request):
        products = Product.objects.all()
        movements = StockMovement.objects.all()
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
