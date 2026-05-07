from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Supplier, PurchaseOrder
from .serializers import SupplierSerializer, PurchaseOrderSerializer
from apps.users.utils import get_filtered_queryset

class SupplierDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        suppliers = get_filtered_queryset(request, Supplier)
        orders = get_filtered_queryset(request, PurchaseOrder)
        
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

class SupplierView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            user_business = getattr(request.user, 'assigned_business', 'All')
            record = Supplier.objects.create(
                name=data.get('name', ''),
                contact_person=data.get('contact', ''),
                phone=data.get('phone', ''),
                email=data.get('email', ''),
                category=data.get('category', ''),
                status=data.get('status', 'Active'),
                business=user_business if user_business != 'All' else data.get('biz', ''),
                created_by=request.user.email
            )
            return Response(SupplierSerializer(record).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
