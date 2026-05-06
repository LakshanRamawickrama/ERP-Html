from django.db import models

class Transaction(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    type = models.CharField(max_length=50) # Income/Expense
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField()
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)

class Invoice(models.Model):
    number = models.CharField(max_length=100, unique=True)
    client = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=50)

class BankAccount(models.Model):
    bank_name = models.CharField(max_length=255)
    account_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    sort_code = models.CharField(max_length=20)
    account_type = models.CharField(max_length=50)
    status = models.CharField(max_length=50)

class Loan(models.Model):
    name = models.CharField(max_length=255)
    lender = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    outstanding_amount = models.DecimalField(max_digits=15, decimal_places=2)
    monthly_payment = models.DecimalField(max_digits=15, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=50)

class InsurancePolicy(models.Model):
    type = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    policy_number = models.CharField(max_length=100)
    premium = models.DecimalField(max_digits=15, decimal_places=2)
    expiry_date = models.DateField()
    status = models.CharField(max_length=50)
