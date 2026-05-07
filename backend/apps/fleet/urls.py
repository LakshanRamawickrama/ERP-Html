from django.urls import path
from .views import FleetDataView, VehicleView

urlpatterns = [
    path('', FleetDataView.as_view(), name='fleet-data'),
    path('vehicles/', VehicleView.as_view(), name='vehicle-create'),
    path('vehicles/<str:pk>/', VehicleView.as_view(), name='vehicle-update'),
]
