from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Supplier, PurchaseOrder
from .serializers import SupplierSerializer, PurchaseOrderSerializer

class SupplierDataView(APIView):
    def get(self, request):
        suppliers = Supplier.objects.all()
        orders = PurchaseOrder.objects.all()
        
        return Response({
            "suppliers": SupplierSerializer(suppliers, many=True).data,
            "orders": PurchaseOrderSerializer(orders, many=True).data,
            "options": {
                "categories": ["Office Supplies", "Hardware", "Logistics", "Food & Beverage"],
                "statuses": ["Active", "Inactive"],
                "names": [s.name for s in suppliers],
                "productCategories": ["Electronics", "Furniture", "Stationery", "Raw Materials"],
                "orderStatuses": ["Pending", "Paid", "Cancelled"]
            }
        })
