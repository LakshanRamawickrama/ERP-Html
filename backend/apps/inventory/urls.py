from django.urls import path
from .views import InventoryDataView, ProductView, StockMovementView

urlpatterns = [
    path('', InventoryDataView.as_view(), name='inventory-data'),
    path('products/', ProductView.as_view(), name='product-create'),
    path('products/<str:pk>/', ProductView.as_view(), name='product-detail'),
    path('movements/', StockMovementView.as_view(), name='movement-create'),
    path('movements/<str:pk>/', StockMovementView.as_view(), name='movement-detail'),
]
