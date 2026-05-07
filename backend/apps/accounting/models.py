from django.db import models

class Transaction(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    type = models.CharField(max_length=50) # Income/Expense
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField()
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)
    document = models.FileField(upload_to='accounting/documents/', blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class Invoice(models.Model):
    number = models.CharField(max_length=100, unique=True)
    client = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=50)
    pdf = models.FileField(upload_to='accounting/invoices/', blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class BankAccount(models.Model):
    bank_name = models.CharField(max_length=255)
    account_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    sort_code = models.CharField(max_length=20)
    account_type = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class Loan(models.Model):
    name = models.CharField(max_length=255)
    lender = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    outstanding_amount = models.DecimalField(max_digits=15, decimal_places=2)
    monthly_payment = models.DecimalField(max_digits=15, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=50)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class InsurancePolicy(models.Model):
    type = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    policy_number = models.CharField(max_length=100)
    premium = models.DecimalField(max_digits=15, decimal_places=2)
    expiry_date = models.DateField()
    status = models.CharField(max_length=50)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class VATRecord(models.Model):
    type = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField()
    status = models.CharField(max_length=50)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class DojoSettlement(models.Model):
    date = models.DateField()
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net = models.DecimalField(max_digits=15, decimal_places=2)
    method = models.CharField(max_length=100, default='Card')  # Card, Contactless, Online
    status = models.CharField(max_length=50, default='Settled')
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)
