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
        try:
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
                },
                "metadata": {
                    "nextId": f"SUP-{suppliers.count() + 1:04d}"
                }
            })
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SupplierView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            user_business = getattr(request.user, 'assigned_business', 'All')
            next_num = Supplier.objects.count() + 1
            record = Supplier.objects.create(
                supplier_id=data.get('supplier_id') or f"SUP-{next_num:04d}",
                name=data.get('name', ''),
                contact_person=data.get('contact', ''),
                phone=data.get('phone', ''),
                email=data.get('email', ''),
                category=data.get('category', ''),
                status=data.get('status', 'Active'),
                address=data.get('address', ''),
                notes=data.get('notes', ''),
                business=user_business if user_business != 'All' else data.get('biz', ''),
                created_by=request.user.email
            )
            return Response(SupplierSerializer(record).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = Supplier.objects.get(pk=pk)
        data = request.data
        try:
            record.name = data.get('name', record.name)
            record.contact_person = data.get('contact', record.contact_person)
            record.phone = data.get('phone', record.phone)
            record.email = data.get('email', record.email)
            record.category = data.get('category', record.category)
            record.status = data.get('status', record.status)
            record.address = data.get('address', record.address)
            record.notes = data.get('notes', record.notes)
            record.business = data.get('biz', record.business)
            record.save()
            return Response(SupplierSerializer(record).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = Supplier.objects.get(pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PurchaseOrderView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            user_business = getattr(request.user, 'assigned_business', 'All')
            supplier = Supplier.objects.filter(name=data.get('supplier')).first()
            record = PurchaseOrder.objects.create(
                number=data.get('num', ''),
                supplier=supplier,
                product=data.get('product', 'General Supplies'),
                quantity=int(data.get('qty', 1)),
                amount=float(data.get('amount', 0.00)),
                date=data.get('due', ''),
                status=data.get('status', 'Pending'),
                business=user_business if user_business != 'All' else data.get('biz', ''),
                created_by=request.user.email
            )
            return Response(PurchaseOrderSerializer(record).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = PurchaseOrder.objects.get(pk=pk)
        data = request.data
        try:
            if data.get('supplier'):
                record.supplier = Supplier.objects.filter(name=data.get('supplier')).first()
            record.number = data.get('num', record.number)
            record.product = data.get('product', record.product)
            record.quantity = int(data.get('qty', record.quantity))
            record.amount = float(data.get('amount', record.amount))
            record.date = data.get('due', record.date)
            record.status = data.get('status', record.status)
            record.business = data.get('biz', record.business)
            record.save()
            return Response(PurchaseOrderSerializer(record).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = PurchaseOrder.objects.get(pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
