from django.urls import path
from .views import AccountingDataView, TransactionView, InvoiceView

urlpatterns = [
    path('', AccountingDataView.as_view(), name='accounting-data'),
    path('transactions/', TransactionView.as_view(), name='transaction-create'),
    path('transactions/<str:pk>/', TransactionView.as_view(), name='transaction-update'),
    path('invoices/', InvoiceView.as_view(), name='invoice-create'),
    path('invoices/<str:pk>/', InvoiceView.as_view(), name='invoice-update'),
]
