from django.urls import path
from .views import PropertyDataView

urlpatterns = [
    path('', PropertyDataView.as_view(), name='property-data'),
]
