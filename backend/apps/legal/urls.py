from django.urls import path
from .views import LegalDataView

urlpatterns = [
    path('', LegalDataView.as_view(), name='legal-data'),
]
