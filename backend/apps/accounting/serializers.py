from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Transaction, BankAccount, Invoice, Loan, InsurancePolicy, VATRecord

class TransactionSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    cat = serializers.CharField(source='category', read_only=True)
    amt = serializers.DecimalField(source='amount', max_digits=15, decimal_places=2, read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'

class BankAccountSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    name = serializers.CharField(source='bank_name', read_only=True)
    acc = serializers.CharField(source='account_number', read_only=True)
    type = serializers.CharField(source='account_type', read_only=True)
    bal = serializers.CharField(default='$0.00', read_only=True) # Placeholder balance
    
    class Meta:
        model = BankAccount
        fields = '__all__'

class InvoiceSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    date = serializers.DateField(source='due_date', read_only=True)
    
    class Meta:
        model = Invoice
        fields = '__all__'

class LoanSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    total = serializers.DecimalField(source='total_amount', max_digits=15, decimal_places=2, read_only=True)
    paid = serializers.SerializerMethodField()
    monthly = serializers.DecimalField(source='monthly_payment', max_digits=15, decimal_places=2, read_only=True)
    rate = serializers.DecimalField(source='interest_rate', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Loan
        fields = '__all__'

    def get_paid(self, obj):
        return obj.total_amount - obj.outstanding_amount

class InsurancePolicySerializer(MongoSerializerMixin, serializers.ModelSerializer):
    expiry = serializers.DateField(source='expiry_date', read_only=True)
    
    class Meta:
        model = InsurancePolicy
        fields = '__all__'

class VATRecordSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = VATRecord
        fields = '__all__'
