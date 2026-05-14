from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Transaction, BankAccount, Invoice, Loan, InsurancePolicy, VATRecord, PaymentServiceRecord
from .serializers import TransactionSerializer, BankAccountSerializer, InvoiceSerializer, LoanSerializer, InsurancePolicySerializer, VATRecordSerializer, PaymentServiceRecordSerializer
from apps.users.utils import get_filtered_queryset
from django.shortcuts import get_object_or_404
from decimal import Decimal
from apps.business.models import BusinessEntity

class AccountingDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        transactions = get_filtered_queryset(request, Transaction)
        banks = get_filtered_queryset(request, BankAccount)
        invoices = get_filtered_queryset(request, Invoice)
        loans = get_filtered_queryset(request, Loan)
        insurance = get_filtered_queryset(request, InsurancePolicy)
        vat = get_filtered_queryset(request, VATRecord)
        payments = get_filtered_queryset(request, PaymentServiceRecord)

        # Robust summary calculation
        total_income = Decimal('0.00')
        total_expenses = Decimal('0.00')

        # 1. From Transactions
        for t in transactions:
            if t.type == 'Income':
                total_income += Decimal(str(t.amount))
            else:
                total_expenses += Decimal(str(t.amount))

        # 2. From Invoices (Paid Invoices are Income)
        for inv in invoices:
            if inv.status == 'Paid':
                total_income += Decimal(str(inv.amount))

        # 3. From Payment Service Records (Income)
        for d in payments:
            total_income += Decimal(str(d.net_amount))

        # 4. From Recurring Expenses
        for ins in insurance:
            total_expenses += Decimal(str(ins.premium))
        
        for l in loans:
            total_expenses += Decimal(str(l.monthly_payment))

        return Response({
            "history": TransactionSerializer(transactions, many=True, context={'request': request}).data,
            "banks": BankAccountSerializer(banks, many=True, context={'request': request}).data,
            "invoices": InvoiceSerializer(invoices, many=True, context={'request': request}).data,
            "loans": LoanSerializer(loans, many=True, context={'request': request}).data,
            "insurance": InsurancePolicySerializer(insurance, many=True, context={'request': request}).data,
            "vat": VATRecordSerializer(vat, many=True, context={'request': request}).data,
            "dojo": PaymentServiceRecordSerializer(payments, many=True, context={'request': request}).data,
            "summary": {
                "income": f"${total_income:,.2f}",
                "expenses": f"${total_expenses:,.2f}"
            },
            "options": ["Rent", "Supplies", "Salary", "Income", "Tax", "Supplier Payments", "Mortgage"],
            "recordTypes": ["Income", "Expense", "Asset", "Equity", "Liability"],
            "paymentMethods": ["Bank Transfer", "Cash", "Card", "Cheque"],
            "paymentStatuses": ["Paid", "Pending", "Overdue", "Settled"],
            "invoiceStatuses": ["Draft", "Sent", "Partially Paid", "Paid", "Overdue", "Cancelled"],
            "invoiceTypes": ["Sales Invoice", "Purchase Invoice", "Proforma Invoice", "Credit Note"],
            "invoiceMethods": ["Bank Transfer", "Cash", "Card", "Cheque", "Online Payment"],
            "bankTypes": ["Business Current", "Savings", "Business Savings"],
            "bankStatuses": ["Active", "Inactive"],
            "loanStatuses": ["Active", "Pending", "Paid Off", "Defaulted"],
            "loanReminders": ["30 Days Before", "15 Days Before", "7 Days Before", "None"],
            "vatStatuses": ["Paid", "Pending", "Overdue", "Filed"],
            "renewalReminders": ["30 Days Before", "60 Days Before", "90 Days Before"],
            "dojoMethods": ["Card", "Contactless", "Online"],
            "paymentModes": ["Direct Debit", "Bank Transfer", "Standing Order"],
            "suppliers": ["Supplier A", "Supplier B", "Global Logistics", "Office Depot"],
        })

class TransactionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            record = Transaction.objects.create(
                title=data.get('title', ''),
                category=data.get('category', ''),
                type=data.get('type', 'Expense'),
                amount=data.get('amount', 0) if data.get('amount') else 0,
                date=data.get('date') or None,
                status=data.get('status', 'Pending'),
                notes=data.get('notes', ''),
                payment_method=data.get('payment_method', ''),
                reference_number=data.get('reference_number', ''),
                document=files.get('document'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(TransactionSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = get_object_or_404(Transaction, pk=pk)
        data = request.data
        try:
            record.title = data.get('title', record.title)
            record.category = data.get('category', record.category)
            record.type = data.get('type', record.type)
            record.amount = data.get('amount', record.amount)
            record.date = data.get('date') or record.date
            record.status = data.get('status', record.status)
            record.notes = data.get('notes', record.notes)
            record.payment_method = data.get('payment_method', record.payment_method)
            record.reference_number = data.get('reference_number', record.reference_number)
            if request.FILES.get('document'):
                record.document = request.FILES.get('document')
            record.save()
            return Response(TransactionSerializer(record, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(Transaction, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InvoiceView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            record = Invoice.objects.create(
                number=data.get('num', ''),
                client=data.get('client', ''),
                invoice_type=data.get('type', 'Sales Invoice'),
                amount=data.get('amount', 0) if data.get('amount') else 0,
                invoice_date=data.get('date') or None,
                due_date=data.get('due') or None,
                payment_method=data.get('method', 'Bank Transfer'),
                reference_number=data.get('ref', ''),
                status=data.get('status', 'Draft'),
                notes=data.get('notes', ''),
                pdf=files.get('pdf'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(InvoiceSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(Invoice, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BankAccountView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            record = BankAccount.objects.create(
                bank_name=data.get('bank', ''),
                account_name=data.get('acc', ''),
                account_number=data.get('num', ''),
                sort_code=data.get('sort', ''),
                iban=data.get('iban', ''),
                account_type=data.get('type', ''),
                status=data.get('status', 'Active'),
                document=request.FILES.get('document'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(BankAccountSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = get_object_or_404(BankAccount, pk=pk)
        data = request.data
        try:
            record.bank_name = data.get('bank', record.bank_name)
            record.account_name = data.get('acc', record.account_name)
            record.account_number = data.get('num', record.account_number)
            record.sort_code = data.get('sort', record.sort_code)
            record.iban = data.get('iban', record.iban)
            record.account_type = data.get('type', record.account_type)
            record.status = data.get('status', record.status)
            if request.FILES.get('document'):
                record.document = request.FILES.get('document')
            record.save()
            return Response(BankAccountSerializer(record, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(BankAccount, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LoanView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            record = Loan.objects.create(
                name=data.get('loan', ''),
                lender=data.get('lender', ''),
                total_amount=data.get('total', 0) if data.get('total') else 0,
                outstanding_amount=data.get('os', 0) if data.get('os') else 0,
                monthly_payment=data.get('monthly', 0) if data.get('monthly') else 0,
                interest_rate=data.get('rate', 0) if data.get('rate') else 0,
                purpose=data.get('purpose', ''),
                reminder=data.get('renewal', ''), # Reusing renewal field name from frontend
                start_date=data.get('start') or None,
                end_date=data.get('end') or None,
                next_payment_date=data.get('next') or None,
                document=request.FILES.get('document'),
                status=data.get('status', 'Active'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(LoanSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = get_object_or_404(Loan, pk=pk)
        data = request.data
        try:
            record.name = data.get('loan', record.name)
            record.lender = data.get('lender', record.lender)
            record.total_amount = data.get('total', record.total_amount)
            record.outstanding_amount = data.get('os', record.outstanding_amount)
            record.monthly_payment = data.get('monthly', record.monthly_payment)
            record.interest_rate = data.get('rate', record.interest_rate)
            record.purpose = data.get('purpose', record.purpose)
            record.reminder = data.get('renewal', record.reminder)
            record.start_date = data.get('start') or record.start_date
            record.end_date = data.get('end') or record.end_date
            record.next_payment_date = data.get('next') or record.next_payment_date
            record.status = data.get('status', record.status)
            if request.FILES.get('document'):
                record.document = request.FILES.get('document')
            record.save()
            return Response(LoanSerializer(record, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(Loan, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InsurancePolicyView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            record = InsurancePolicy.objects.create(
                type=data.get('type', ''),
                provider=data.get('provider', ''),
                policy_number=data.get('policy', ''),
                premium=data.get('premium', 0) if data.get('premium') else 0,
                coverage_amount=data.get('coverage', 0) if data.get('coverage') else 0,
                asset_details=data.get('asset', ''),
                contact_info=data.get('contact', ''),
                start_date=data.get('startDate') or None,
                expiry_date=data.get('expiry') or None,
                renewal_reminder=data.get('renewal', ''),
                document=files.get('document'),
                status=data.get('status', 'Active'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(InsurancePolicySerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = get_object_or_404(InsurancePolicy, pk=pk)
        data = request.data
        try:
            record.type = data.get('type', record.type)
            record.provider = data.get('provider', record.provider)
            record.policy_number = data.get('policy', record.policy_number)
            record.premium = data.get('premium', record.premium)
            record.coverage_amount = data.get('coverage', record.coverage_amount)
            record.asset_details = data.get('asset', record.asset_details)
            record.contact_info = data.get('contact', record.contact_info)
            record.start_date = data.get('startDate') or record.start_date
            record.expiry_date = data.get('expiry') or record.expiry_date
            record.renewal_reminder = data.get('renewal', record.renewal_reminder)
            record.status = data.get('status', record.status)
            if request.FILES.get('document'):
                record.document = request.FILES.get('document')
            record.save()
            return Response(InsurancePolicySerializer(record, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(InsurancePolicy, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class VATRecordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            record = VATRecord.objects.create(
                type=data.get('type', ''),
                reference_number=data.get('ref', ''),
                transaction_reference=data.get('txn_ref', ''),
                amount=data.get('amount', 0) if data.get('amount') else 0,
                period_start=data.get('start') or None,
                period_end=data.get('end') or None,
                filing_deadline=data.get('deadline') or None,
                payment_due=data.get('due') or None,
                document=files.get('document'),
                status=data.get('status', 'Draft'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(VATRecordSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = get_object_or_404(VATRecord, pk=pk)
        data = request.data
        files = request.FILES
        try:
            record.type = data.get('type', record.type)
            record.reference_number = data.get('ref', record.reference_number)
            record.transaction_reference = data.get('txn_ref', record.transaction_reference)
            record.amount = data.get('amount', record.amount)
            record.period_start = data.get('start') or record.period_start
            record.period_end = data.get('end') or record.period_end
            record.filing_deadline = data.get('deadline') or record.filing_deadline
            record.payment_due = data.get('due') or record.payment_due
            record.status = data.get('status', record.status)
            if files.get('document'):
                record.document = files.get('document')
            record.save()
            return Response(VATRecordSerializer(record, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = get_object_or_404(VATRecord, pk=pk)
        data = request.data
        try:
            record.type = data.get('type', record.type)
            record.reference_number = data.get('ref', record.reference_number)
            record.transaction_reference = data.get('txn_ref', record.transaction_reference)
            record.amount = data.get('amount', record.amount)
            record.period_start = data.get('start') or record.period_start
            record.period_end = data.get('end') or record.period_end
            record.filing_deadline = data.get('deadline') or record.filing_deadline
            record.payment_due = data.get('due') or record.payment_due
            record.status = data.get('status', record.status)
            if request.FILES.get('document'):
                record.document = request.FILES.get('document')
            record.save()
            return Response(VATRecordSerializer(record, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(VATRecord, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PaymentServiceRecordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        records = get_filtered_queryset(request, PaymentServiceRecord)
        return Response({
            "transactions": PaymentServiceRecordSerializer(records, many=True, context={'request': request}).data,
            "businesses": list(BusinessEntity.objects.values_list('name', flat=True))
        })

    def post(self, request):
        data = request.data
        try:
            record = PaymentServiceRecord.objects.create(
                provider=data.get('provider', 'Dojo'),
                biz=data.get('biz', ''),
                type=data.get('type', 'Card Payment'),
                date=data.get('transDate') or None,
                reference=data.get('transRef', ''),
                gross_amount=Decimal(str(data.get('gross', '0'))),
                fee_amount=Decimal(str(data.get('comm', '0'))),
                net_amount=Decimal(str(data.get('net', '0'))),
                method=data.get('method', 'Card'),
                status=data.get('status', 'Paid'),
                staff=data.get('staff', ''),
                notes=data.get('notes', ''),
                game_type=data.get('gameType'),
                draw_date=data.get('drawDate') or None,
                ticket_number=data.get('ticketNum'),
                bill_type=data.get('billType'),
                customer_reference=data.get('custRef'),
                provider_name=data.get('providerName'),
                prize=Decimal(str(data.get('prize', '0'))),
                claim_status=data.get('claimStatus'),
                voucher_code=data.get('voucherCode'),
                business=data.get('biz', ''), # Sync business field
                created_by=request.user.email
            )
            return Response(PaymentServiceRecordSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        record = get_object_or_404(PaymentServiceRecord, pk=pk)
        data = request.data
        try:
            record.provider = data.get('provider', record.provider)
            record.biz = data.get('biz', record.biz)
            record.type = data.get('type', record.type)
            record.date = data.get('transDate') or record.date
            record.reference = data.get('transRef', record.reference)
            record.gross_amount = Decimal(str(data.get('gross', record.gross_amount)))
            record.fee_amount = Decimal(str(data.get('comm', record.fee_amount)))
            record.net_amount = Decimal(str(data.get('net', record.net_amount)))
            record.method = data.get('method', record.method)
            record.status = data.get('status', record.status)
            record.staff = data.get('staff', record.staff)
            record.notes = data.get('notes', record.notes)
            record.game_type = data.get('gameType', record.game_type)
            record.draw_date = data.get('drawDate') or record.draw_date
            record.ticket_number = data.get('ticketNum', record.ticket_number)
            record.bill_type = data.get('billType', record.bill_type)
            record.customer_reference = data.get('custRef', record.customer_reference)
            record.provider_name = data.get('providerName', record.provider_name)
            record.prize = Decimal(str(data.get('prize', record.prize)))
            record.claim_status = data.get('claimStatus', record.claim_status)
            record.voucher_code = data.get('voucherCode', record.voucher_code)
            record.business = data.get('biz', record.business)
            record.save()
            return Response(PaymentServiceRecordSerializer(record, context={'request': request}).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(PaymentServiceRecord, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
