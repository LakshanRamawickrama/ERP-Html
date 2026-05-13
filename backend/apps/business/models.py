from django.db import models

class BusinessEntity(models.Model):
    name = models.CharField(max_length=255)
    company_number = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)
    tax_id = models.CharField(max_length=100, blank=True, null=True)
    hq_location = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default='Active')
    currency = models.CharField(max_length=10, default='GBP')
    timezone = models.CharField(max_length=100, default='UTC')
    fiscal_year = models.CharField(max_length=100, blank=True, null=True)
    business_logo = models.ImageField(upload_to='business/logos/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class CompanyStructure(models.Model):
    name = models.CharField(max_length=255)
    crn = models.CharField(max_length=8, unique=True)
    manager = models.CharField(max_length=255)
    sic_code = models.CharField(max_length=20, blank=True, null=True)
    filing_due = models.DateField()
    address = models.TextField(blank=True, null=True)
    balance_sheet = models.FileField(upload_to='business/balance_sheets/', blank=True, null=True)
    pl_statement = models.FileField(upload_to='business/pl_statements/', blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name
