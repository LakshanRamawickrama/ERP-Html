from django.urls import path
from .views import BusinessDataView, BusinessDetailView, BusinessEntityView, CompanyStructureView

urlpatterns = [
    path('', BusinessDataView.as_view(), name='business-data'),
    path('entities/', BusinessEntityView.as_view(), name='entity-create'),
    path('entities/<str:pk>/', BusinessEntityView.as_view(), name='entity-detail'),
    path('structures/', CompanyStructureView.as_view(), name='structure-create'),
    path('structures/<str:pk>/', CompanyStructureView.as_view(), name='structure-detail'),
    path('<str:slug>/', BusinessDetailView.as_view(), name='business-detail'),
]
