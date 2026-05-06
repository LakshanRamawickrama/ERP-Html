from django.urls import path
from .views import BusinessDataView, BusinessDetailView

urlpatterns = [
    path('', BusinessDataView.as_view(), name='business-data'),
    path('<str:slug>/', BusinessDetailView.as_view(), name='business-detail'),
]
