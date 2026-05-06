from .models import Transaction, BankAccount, Invoice
from .serializers import TransactionSerializer, BankAccountSerializer, InvoiceSerializer

class AccountingDataView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        banks = BankAccount.objects.all()
        invoices = Invoice.objects.all()
        
        return Response({
            "history": TransactionSerializer(transactions, many=True).data,
            "banks": BankAccountSerializer(banks, many=True).data,
            "invoices": InvoiceSerializer(invoices, many=True).data,
            "options": ["Rent", "Supplies", "Salary", "Income", "Tax"],
            "recordTypes": ["Income", "Expense"],
            "paymentStatuses": ["Paid", "Pending", "Overdue"]
        })
