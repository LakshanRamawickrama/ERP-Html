from django.urls import path
from .views import PropertyDataView, PropertyLicenceView

urlpatterns = [
    path('', PropertyDataView.as_view(), name='property-data'),
    path('licences/', PropertyLicenceView.as_view(), name='licence-create'),
    path('licences/<str:pk>/', PropertyLicenceView.as_view(), name='licence-update'),
]
