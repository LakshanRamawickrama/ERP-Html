from django.urls import path
from .views import InventoryDataView

urlpatterns = [
    path('', InventoryDataView.as_view(), name='inventory-data'),
]
