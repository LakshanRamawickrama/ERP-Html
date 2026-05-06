from django.urls import path
from .views import BusinessDataView

urlpatterns = [
    path('', BusinessDataView.as_view(), name='business-data'),
]
