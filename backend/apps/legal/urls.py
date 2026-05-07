from django.urls import path
from .views import LegalDataView, LegalDocumentView

urlpatterns = [
    path('', LegalDataView.as_view(), name='legal-data'),
    path('documents/', LegalDocumentView.as_view(), name='legal-document-create'),
    path('documents/<str:pk>/', LegalDocumentView.as_view(), name='legal-document-detail'),
]
