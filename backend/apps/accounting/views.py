from rest_framework.views import APIView
from rest_framework.response import Response
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
            "history": TransactionSerializer(transactions, many=True).data,
            "banks": BankAccountSerializer(banks, many=True).data,
            "invoices": InvoiceSerializer(invoices, many=True).data,
            "loans": LoanSerializer(loans, many=True).data,
            "insurance": InsurancePolicySerializer(insurance, many=True).data,
            "vat": VATRecordSerializer(vat, many=True).data,
            "dojo": DojoSettlementSerializer(dojo, many=True).data,
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
            "renewalReminders": ["30 Days Before", "60 Days Before", "90 Days Before"]
        })
