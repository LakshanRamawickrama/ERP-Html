from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Supplier
from .serializers import SupplierSerializer

class SupplierDataView(APIView):
    def get(self, request):
        suppliers = Supplier.objects.all()
        
        return Response({
            "suppliers": SupplierSerializer(suppliers, many=True).data,
            "options": {
                "categories": ["Office Supplies", "Hardware", "Logistics", "Food & Beverage"],
                "statuses": ["Active", "Inactive"]
            }
        })
