from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Transaction, BankAccount, Invoice, Loan, InsurancePolicy, VATRecord, DojoSettlement
from .serializers import TransactionSerializer, BankAccountSerializer, InvoiceSerializer, LoanSerializer, InsurancePolicySerializer, VATRecordSerializer, DojoSettlementSerializer
from apps.users.utils import get_filtered_queryset

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
    permission_classes = [IsAuthenticated]
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
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(TransactionSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class InvoiceView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            record = Invoice.objects.create(
                number=data.get('number', ''),
                client=data.get('client', ''),
                amount=data.get('amount', 0),
                due_date=data.get('due_date'),
                status=data.get('status', 'Pending'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(InvoiceSerializer(record, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            record = Invoice.objects.get(pk=pk)
            # Check ownership/access
            if not request.user.is_superuser:
                if record.business != request.user.assigned_business:
                    return Response({"error": "Permission denied"}, status=403)
            
            data = request.data
            record.status = data.get('status', record.status)
            record.save()
            return Response(InvoiceSerializer(record, context={'request': request}).data)
        except Invoice.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
