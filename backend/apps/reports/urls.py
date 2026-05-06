from django.urls import path
from .views import ReportsDataView

urlpatterns = [
    path('', ReportsDataView.as_view(), name='reports-data'),
]
