from django.urls import path
from .views import SupplierDataView, SupplierView, PurchaseOrderView

urlpatterns = [
    path('', SupplierDataView.as_view(), name='supplier-data'),
    path('suppliers/', SupplierView.as_view(), name='supplier-create'),
    path('suppliers/<str:pk>/', SupplierView.as_view(), name='supplier-detail'),
    path('orders/', PurchaseOrderView.as_view(), name='order-create'),
    path('orders/<str:pk>/', PurchaseOrderView.as_view(), name='order-detail'),
]
