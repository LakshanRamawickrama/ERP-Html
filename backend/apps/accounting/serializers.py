from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Transaction, BankAccount, Invoice, Loan, InsurancePolicy, VATRecord, DojoSettlement

class TransactionSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    cat = serializers.CharField(source='category', read_only=True)
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = '__all__'

    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document and hasattr(obj.document, 'url'):
            return request.build_absolute_uri(obj.document.url) if request else obj.document.url
        return None

class BankAccountSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    bank = serializers.CharField(source='bank_name', read_only=True)
    acc = serializers.CharField(source='account_name', read_only=True)
    num = serializers.CharField(source='account_number', read_only=True)
    sort = serializers.CharField(source='sort_code', read_only=True)
    type = serializers.CharField(source='account_type', read_only=True)

    class Meta:
        model = BankAccount
        fields = '__all__'

class InvoiceSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    num = serializers.CharField(source='number', read_only=True)
    due = serializers.DateField(source='due_date', read_only=True)
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = '__all__'

    def get_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.pdf and hasattr(obj.pdf, 'url'):
            return request.build_absolute_uri(obj.pdf.url) if request else obj.pdf.url
        return None

class LoanSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    loan = serializers.CharField(source='name', read_only=True)
    total = serializers.DecimalField(source='total_amount', max_digits=15, decimal_places=2, read_only=True)
    os = serializers.DecimalField(source='outstanding_amount', max_digits=15, decimal_places=2, read_only=True)
    monthly = serializers.DecimalField(source='monthly_payment', max_digits=15, decimal_places=2, read_only=True)
    rate = serializers.DecimalField(source='interest_rate', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Loan
        fields = '__all__'

class InsurancePolicySerializer(MongoSerializerMixin, serializers.ModelSerializer):
    policy = serializers.CharField(source='policy_number', read_only=True)
    expiry = serializers.DateField(source='expiry_date', read_only=True)

    class Meta:
        model = InsurancePolicy
        fields = '__all__'

class VATRecordSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = VATRecord
        fields = '__all__'

class DojoSettlementSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = DojoSettlement
        fields = '__all__'
