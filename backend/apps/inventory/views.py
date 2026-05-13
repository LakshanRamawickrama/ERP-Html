from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Product, StockMovement
from .serializers import ProductSerializer, StockMovementSerializer
from apps.users.utils import get_filtered_queryset
from django.shortcuts import get_object_or_404
import uuid

class InventoryDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        products = get_filtered_queryset(request, Product)
        movements = get_filtered_queryset(request, StockMovement)
        return Response({
            "stock": ProductSerializer(products, many=True).data,
            "moves": StockMovementSerializer(movements, many=True).data,
            "alerts": [], # Centralized in Reminders module
            "inventoryCategories": ["Food & Beverages", "Groceries", "Stationery", "Electronics", "Cleaning"],
            "inventoryItems": [p.name for p in products],
        })

class ProductView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        data = request.data
        try:
            user_business = getattr(request.user, 'assigned_business', 'All')
            product = Product.objects.create(
                name=data.get('name', ''),
                sku=data.get('sku') or f"SKU-{uuid.uuid4().hex[:8].upper()}",
                category=data.get('category', ''),
                quantity=int(data.get('quantity', 0)),
                min_stock=int(data.get('min_stock', 10)),
                price=float(data.get('price', 0.00)),
                supplier_ref=data.get('supplier_ref', ''),
                status=data.get('status', 'Active'),
                notes=data.get('notes', ''),
                business=user_business if user_business != 'All' else data.get('biz', ''),
                created_by=request.user.email
            )
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        data = request.data
        try:
            product.name = data.get('name', product.name)
            product.category = data.get('category', product.category)
            product.quantity = int(data.get('quantity', product.quantity))
            product.min_stock = int(data.get('min_stock', product.min_stock))
            product.price = float(data.get('price', product.price))
            product.supplier_ref = data.get('supplier_ref', product.supplier_ref)
            product.status = data.get('status', product.status)
            product.notes = data.get('notes', product.notes)
            product.business = data.get('biz', product.business)
            product.save()
            return Response(ProductSerializer(product).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StockMovementView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        data = request.data
        try:
            product_name = data.get('product_name', '')
            product = Product.objects.filter(name=product_name).first()
            user_business = getattr(request.user, 'assigned_business', 'All')
            
            movement = StockMovement.objects.create(
                product=product,
                movement_date=data.get('movement_date') or None,
                type=data.get('type', 'IN'),
                quantity=int(data.get('quantity', 0)),
                reason=data.get('reason', ''),
                reference=data.get('reference', ''),
                handled_by=data.get('handled_by', ''),
                notes=data.get('notes', ''),
                business=user_business if user_business != 'All' else (data.get('biz') or (product.business if product else '')),
                created_by=request.user.email
            )
            
            # Update product quantity
            if product:
                if movement.type == 'IN':
                    product.quantity += movement.quantity
                else:
                    product.quantity -= movement.quantity
                product.save()

            return Response(StockMovementSerializer(movement).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
    def put(self, request, pk):
        movement = get_object_or_404(StockMovement, pk=pk)
        product = movement.product
        data = request.data
        try:
            old_qty = movement.quantity
            old_type = movement.type
            
            # Reverse old movement effect on product
            if product:
                if old_type == 'IN':
                    product.quantity -= old_qty
                else:
                    product.quantity += old_qty
            
            # Update movement fields
            movement.movement_date = data.get('movement_date', movement.movement_date)
            movement.type = data.get('type', movement.type)
            movement.quantity = int(data.get('quantity', movement.quantity))
            movement.reason = data.get('reason', movement.reason)
            movement.reference = data.get('reference', movement.reference)
            movement.handled_by = data.get('handled_by', movement.handled_by)
            movement.notes = data.get('notes', movement.notes)
            movement.business = data.get('biz', movement.business)
            movement.save()
            
            # Apply new movement effect on product
            if product:
                if movement.type == 'IN':
                    product.quantity += movement.quantity
                else:
                    product.quantity -= movement.quantity
                product.save()
                
            return Response(StockMovementSerializer(movement).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        movement = get_object_or_404(StockMovement, pk=pk)
        movement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
