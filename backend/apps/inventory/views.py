from .models import Product
from .serializers import ProductSerializer

class InventoryDataView(APIView):
    def get(self, request):
        products = Product.objects.all()
        
        return Response({
            "stock": ProductSerializer(products, many=True).data,
            "categories": ["Furniture", "Electronics", "Office Supplies"]
        })
