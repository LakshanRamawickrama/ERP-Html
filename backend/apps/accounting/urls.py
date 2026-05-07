from django.urls import path
from .views import (
    AccountingDataView, 
    TransactionView, 
    InvoiceView, 
    BankAccountView, 
    LoanView, 
    InsurancePolicyView, 
    VATRecordView, 
    DojoSettlementView
)

urlpatterns = [
    path('', AccountingDataView.as_view(), name='accounting-data'),
    
    path('transactions/', TransactionView.as_view(), name='transaction-create'),
    path('transactions/<str:pk>/', TransactionView.as_view(), name='transaction-detail'),
    
    path('invoices/', InvoiceView.as_view(), name='invoice-create'),
    path('invoices/<str:pk>/', InvoiceView.as_view(), name='invoice-detail'),
    
    path('banks/', BankAccountView.as_view(), name='bank-create'),
    path('banks/<str:pk>/', BankAccountView.as_view(), name='bank-detail'),
    
    path('loans/', LoanView.as_view(), name='loan-create'),
    path('loans/<str:pk>/', LoanView.as_view(), name='loan-detail'),
    
    path('insurance/', InsurancePolicyView.as_view(), name='insurance-create'),
    path('insurance/<str:pk>/', InsurancePolicyView.as_view(), name='insurance-detail'),
    
    path('tax/', VATRecordView.as_view(), name='tax-create'),
    path('tax/<str:pk>/', VATRecordView.as_view(), name='tax-detail'),
    
    path('dojo/', DojoSettlementView.as_view(), name='dojo-create'),
    path('dojo/<str:pk>/', DojoSettlementView.as_view(), name='dojo-detail'),
]
