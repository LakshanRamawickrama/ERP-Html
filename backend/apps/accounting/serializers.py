from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Transaction, BankAccount, Invoice, Loan, InsurancePolicy, VATRecord, PaymentServiceRecord

class TransactionSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    ref = serializers.CharField(source='reference_number', read_only=True)
    method = serializers.CharField(source='payment_method', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
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
    biz = serializers.CharField(source='business', read_only=True)
    document_url = serializers.SerializerMethodField()
    class Meta:
        model = BankAccount
        fields = '__all__'
    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document and hasattr(obj.document, 'url'):
            return request.build_absolute_uri(obj.document.url) if request else obj.document.url
        return None

class InvoiceSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    num = serializers.CharField(source='number', read_only=True)
    due = serializers.DateField(source='due_date', read_only=True)
    date = serializers.DateField(source='invoice_date', read_only=True)
    method = serializers.CharField(source='payment_method', read_only=True)
    ref = serializers.CharField(source='reference_number', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
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
    start = serializers.DateField(source='start_date', read_only=True)
    end = serializers.DateField(source='end_date', read_only=True)
    next = serializers.DateField(source='next_payment_date', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
    document_url = serializers.SerializerMethodField()
    class Meta:
        model = Loan
        fields = '__all__'
    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document and hasattr(obj.document, 'url'):
            return request.build_absolute_uri(obj.document.url) if request else obj.document.url
        return None

class InsurancePolicySerializer(MongoSerializerMixin, serializers.ModelSerializer):
    policy = serializers.CharField(source='policy_number', read_only=True)
    expiry = serializers.DateField(source='expiry_date', read_only=True)
    coverage = serializers.DecimalField(source='coverage_amount', max_digits=15, decimal_places=2, read_only=True)
    asset = serializers.CharField(source='asset_details', read_only=True)
    contact = serializers.CharField(source='contact_info', read_only=True)
    biz = serializers.CharField(source='business', read_only=True)
    start = serializers.DateField(source='start_date', read_only=True)
    document_url = serializers.SerializerMethodField()
    class Meta:
        model = InsurancePolicy
        fields = '__all__'
    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document and hasattr(obj.document, 'url'):
            return request.build_absolute_uri(obj.document.url) if request else obj.document.url
        return None

class VATRecordSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    ref = serializers.CharField(source='reference_number', required=False, allow_null=True)
    txn_ref = serializers.CharField(source='transaction_reference', required=False, allow_null=True)
    start = serializers.DateField(source='period_start', required=False, allow_null=True)
    end = serializers.DateField(source='period_end', required=False, allow_null=True)
    deadline = serializers.DateField(source='filing_deadline', required=False, allow_null=True)
    due = serializers.DateField(source='payment_due', required=False, allow_null=True)
    biz = serializers.CharField(source='business', read_only=True)
    document_url = serializers.SerializerMethodField()
    class Meta:
        model = VATRecord
        fields = '__all__'
    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document and hasattr(obj.document, 'url'):
            return request.build_absolute_uri(obj.document.url) if request else obj.document.url
        return None

class PaymentServiceRecordSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    gross = serializers.DecimalField(source='gross_amount', max_digits=15, decimal_places=2, required=False)
    comm = serializers.DecimalField(source='fee_amount', max_digits=15, decimal_places=2, required=False)
    net = serializers.DecimalField(source='net_amount', max_digits=15, decimal_places=2, required=False)
    transRef = serializers.CharField(source='reference', required=False, allow_blank=True)
    transDate = serializers.DateField(source='date', required=False)
    
    # Provider specific aliases
    gameType = serializers.CharField(source='game_type', required=False, allow_blank=True)
    drawDate = serializers.DateField(source='draw_date', required=False, allow_null=True)
    ticketNum = serializers.CharField(source='ticket_number', required=False, allow_blank=True)
    billType = serializers.CharField(source='bill_type', required=False, allow_blank=True)
    custRef = serializers.CharField(source='customer_reference', required=False, allow_blank=True)
    providerName = serializers.CharField(source='provider_name', required=False, allow_blank=True)
    claimStatus = serializers.CharField(source='claim_status', required=False, allow_blank=True)
    voucherCode = serializers.CharField(source='voucher_code', required=False, allow_blank=True)
    reminderDays = serializers.IntegerField(source='reminder_days', required=False)

    class Meta:
        model = PaymentServiceRecord
        fields = '__all__'
