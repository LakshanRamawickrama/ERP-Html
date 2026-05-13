from django.urls import path
from .views import FleetDataView, VehicleView, DeliveryView, ParcelPartnerView

urlpatterns = [
    path('', FleetDataView.as_view(), name='fleet-data'),
    path('vehicles/', VehicleView.as_view(), name='vehicle-create'),
    path('vehicles/<str:pk>/', VehicleView.as_view(), name='vehicle-update'),
    path('deliveries/', DeliveryView.as_view(), name='delivery-create'),
    path('deliveries/<str:pk>/', DeliveryView.as_view(), name='delivery-update'),
    path('parcels/', ParcelPartnerView.as_view(), name='parcel-create'),
    path('parcels/<str:pk>/', ParcelPartnerView.as_view(), name='parcel-update'),
]
