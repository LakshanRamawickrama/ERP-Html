from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Transaction, BankAccount, Invoice, Loan, InsurancePolicy, VATRecord, DojoSettlement
from .serializers import TransactionSerializer, BankAccountSerializer, InvoiceSerializer, LoanSerializer, InsurancePolicySerializer, VATRecordSerializer, DojoSettlementSerializer
from apps.users.utils import get_filtered_queryset
from django.shortcuts import get_object_or_404
from decimal import Decimal

class AccountingDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        transactions = get_filtered_queryset(request, Transaction)
        banks = get_filtered_queryset(request, BankAccount)
        invoices = get_filtered_queryset(request, Invoice)
        loans = get_filtered_queryset(request, Loan)
        insurance = get_filtered_queryset(request, InsurancePolicy)
        vat = get_filtered_queryset(request, VATRecord)
        dojo = get_filtered_queryset(request, DojoSettlement)

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

        # 3. From Dojo Settlements (Income)
        for d in dojo:
            total_income += Decimal(str(d.net))

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
            "dojo": DojoSettlementSerializer(dojo, many=True, context={'request': request}).data,
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
                period=data.get('period', ''),
                reference_number=data.get('ref', ''),
                amount=data.get('amount', 0) if data.get('amount') else 0,
                date=data.get('date') or None,
                document=files.get('document'),
                status=data.get('status', 'Pending'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(VATRecordSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(VATRecord, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DojoSettlementView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            amount = Decimal(data.get('amount', '0'))
            fee = Decimal(data.get('fee', '0'))
            record = DojoSettlement.objects.create(
                date=data.get('date') or None,
                amount=amount,
                fee=fee,
                net=amount - fee,
                method=data.get('method', 'Card'),
                status=data.get('status', 'Settled'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(DojoSettlementSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(DojoSettlement, pk=pk)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
