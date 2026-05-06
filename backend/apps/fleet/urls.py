from django.urls import path
from .views import FleetDataView

urlpatterns = [
    path('', FleetDataView.as_view(), name='fleet-data'),
]
