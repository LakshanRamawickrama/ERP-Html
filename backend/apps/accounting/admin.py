from django.contrib import admin
from .models import Transaction, Invoice, BankAccount, Loan, InsurancePolicy

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'type', 'amount', 'date', 'status')
    search_fields = ('title', 'category')
    list_filter = ('type', 'status', 'category')

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('number', 'client', 'amount', 'due_date', 'status')
    search_fields = ('number', 'client')
    list_filter = ('status',)

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ('bank_name', 'account_name', 'account_number', 'account_type', 'status')
    search_fields = ('bank_name', 'account_name', 'account_number')
    list_filter = ('account_type', 'status')

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('name', 'lender', 'total_amount', 'outstanding_amount', 'status')
    search_fields = ('name', 'lender')
    list_filter = ('status',)

@admin.register(InsurancePolicy)
class InsurancePolicyAdmin(admin.ModelAdmin):
    list_display = ('type', 'provider', 'policy_number', 'expiry_date', 'status')
    search_fields = ('provider', 'policy_number')
    list_filter = ('status', 'type')
