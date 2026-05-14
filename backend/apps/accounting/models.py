from django.db import models

class Transaction(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    type = models.CharField(max_length=50) # Income/Expense
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, default='Pending')
    notes = models.TextField(blank=True, null=True)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    reference_number = models.CharField(max_length=255, blank=True, null=True)
    document = models.FileField(upload_to='accounting/documents/', blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class Invoice(models.Model):
    number = models.CharField(max_length=100, unique=True)
    client = models.CharField(max_length=255)
    invoice_type = models.CharField(max_length=100, blank=True, null=True) # Sales/Purchase etc.
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    invoice_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    reference_number = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default='Pending')
    notes = models.TextField(blank=True, null=True)
    pdf = models.FileField(upload_to='accounting/invoices/', blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class BankAccount(models.Model):
    bank_name = models.CharField(max_length=255)
    account_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    sort_code = models.CharField(max_length=20)
    iban = models.CharField(max_length=50, blank=True, null=True)
    account_type = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='Active')
    document = models.FileField(upload_to='accounting/banks/', blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class Loan(models.Model):
    name = models.CharField(max_length=255)
    lender = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    outstanding_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    monthly_payment = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    purpose = models.CharField(max_length=255, blank=True, null=True)
    document = models.FileField(upload_to='accounting/loans/', blank=True, null=True)
    reminder = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    next_payment_date = models.DateField(blank=True, null=True)
    reminder_days = models.IntegerField(default=7)
    status = models.CharField(max_length=50, default='Active')
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class InsurancePolicy(models.Model):
    type = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    policy_number = models.CharField(max_length=100)
    premium = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    coverage_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    asset_details = models.CharField(max_length=255, blank=True, null=True)
    contact_info = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    renewal_reminder = models.CharField(max_length=100, blank=True, null=True)
    reminder_days = models.IntegerField(default=30)
    document = models.FileField(upload_to='accounting/insurance/', blank=True, null=True)
    status = models.CharField(max_length=50, default='Active')
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class VATRecord(models.Model):
    type = models.CharField(max_length=255)
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    transaction_reference = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    period_start = models.DateField(blank=True, null=True)
    period_end = models.DateField(blank=True, null=True)
    filing_deadline = models.DateField(blank=True, null=True)
    payment_due = models.DateField(blank=True, null=True)
    reminder_days = models.IntegerField(default=14)
    document = models.FileField(upload_to='accounting/tax/', blank=True, null=True)
    status = models.CharField(max_length=50, default='Pending')
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class PaymentServiceRecord(models.Model):
    provider = models.CharField(max_length=100) # Dojo, Lottery, PayPoint, PayZone
    biz = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=100)
    date = models.DateField(blank=True, null=True)
    reference = models.CharField(max_length=100, blank=True, null=True)
    gross_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    fee_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    status = models.CharField(max_length=50, default='Paid')
    method = models.CharField(max_length=100, blank=True, null=True)
    staff = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    # Provider specific fields
    game_type = models.CharField(max_length=100, blank=True, null=True) # Lottery
    draw_date = models.DateField(blank=True, null=True) # Lottery
    ticket_number = models.CharField(max_length=100, blank=True, null=True) # Lottery
    
    bill_type = models.CharField(max_length=100, blank=True, null=True) # PayPoint/PayZone
    customer_reference = models.CharField(max_length=100, blank=True, null=True) # PayPoint/PayZone
    provider_name = models.CharField(max_length=255, blank=True, null=True) # PayPoint/PayZone (e.g. British Gas, EE)
    
    prize = models.DecimalField(max_digits=15, decimal_places=2, default=0.00) # Lottery
    claim_status = models.CharField(max_length=50, blank=True, null=True) # Lottery
    voucher_code = models.CharField(max_length=100, blank=True, null=True) # PayPoint/PayZone

    business = models.CharField(max_length=255, blank=True, null=True) # For consistency with other models
    created_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.provider} - {self.type} - {self.date}"
