from django.urls import path
from .views import ReportsDataView, DashboardDataView

urlpatterns = [
    path('dashboard/', DashboardDataView.as_view(), name='dashboard-data'),
    path('', ReportsDataView.as_view(), name='reports-data'),
]
