from django.urls import path
from .views import SystemDataView

urlpatterns = [
    path('', SystemDataView.as_view(), name='system-data'),
]
