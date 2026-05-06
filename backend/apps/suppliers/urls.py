from django.urls import path
from .views import SupplierDataView

urlpatterns = [
    path('', SupplierDataView.as_view(), name='supplier-data'),
]
