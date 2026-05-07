from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction, BankAccount, Invoice, Loan, InsurancePolicy, VATRecord, DojoSettlement
from .serializers import TransactionSerializer, BankAccountSerializer, InvoiceSerializer, LoanSerializer, InsurancePolicySerializer, VATRecordSerializer, DojoSettlementSerializer

class AccountingDataView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        banks = BankAccount.objects.all()
        invoices = Invoice.objects.all()
        loans = Loan.objects.all()
        insurance = InsurancePolicy.objects.all()
        vat = VATRecord.objects.all()
        dojo = DojoSettlement.objects.all()

        total_income = sum(t.amount for t in transactions if t.type == 'Income')
        total_expenses = sum(t.amount for t in transactions if t.type == 'Expense')

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
            "recordTypes": ["Income", "Expense"],
            "paymentStatuses": ["Paid", "Pending", "Overdue"],
            "invoiceStatuses": ["Paid", "Pending", "Overdue", "Sent"],
            "bankTypes": ["Business Current", "Savings", "Business Savings"],
            "bankStatuses": ["Active", "Inactive"],
            "loanStatuses": ["Active", "Settled", "Defaulted"],
            "vatStatuses": ["Paid", "Pending", "Filed"],
            "renewalReminders": ["30 Days Before", "60 Days Before", "90 Days Before"],
            "dojoMethods": ["Card", "Contactless", "Online"],
            "paymentModes": ["Direct Debit", "Bank Transfer", "Standing Order"],
        })


class TransactionView(APIView):
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            record = Transaction.objects.create(
                title=data.get('title', ''),
                category=data.get('category', ''),
                type=data.get('type', 'Expense'),
                amount=data.get('amount', 0),
                date=data.get('date'),
                status=data.get('status', 'Pending'),
                notes=data.get('notes', ''),
                document=files.get('document'),
            )
            return Response(TransactionSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            record = Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data
        files = request.FILES
        record.title = data.get('title', record.title)
        record.category = data.get('category', record.category)
        record.type = data.get('type', record.type)
        record.amount = data.get('amount', record.amount)
        if data.get('date'):
            record.date = data.get('date')
        record.status = data.get('status', record.status)
        record.notes = data.get('notes', record.notes)
        if files.get('document'):
            record.document = files.get('document')
        record.save()
        return Response(TransactionSerializer(record, context={'request': request}).data)


class InvoiceView(APIView):
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            invoice = Invoice.objects.create(
                number=data.get('num', ''),
                client=data.get('client', ''),
                amount=data.get('amount', 0),
                due_date=data.get('due'),
                status=data.get('status', 'Pending'),
                pdf=files.get('pdf'),
            )
            return Response(InvoiceSerializer(invoice, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data
        files = request.FILES
        invoice.number = data.get('num', invoice.number)
        invoice.client = data.get('client', invoice.client)
        invoice.amount = data.get('amount', invoice.amount)
        if data.get('due'):
            invoice.due_date = data.get('due')
        invoice.status = data.get('status', invoice.status)
        if files.get('pdf'):
            invoice.pdf = files.get('pdf')
        invoice.save()
        return Response(InvoiceSerializer(invoice, context={'request': request}).data)
