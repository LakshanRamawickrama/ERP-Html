from django.urls import path
from .views import AccountingDataView

urlpatterns = [
    path('', AccountingDataView.as_view(), name='accounting-data'),
]
