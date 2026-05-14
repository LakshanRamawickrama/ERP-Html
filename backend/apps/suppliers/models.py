from django.db import models

class Supplier(models.Model):
    supplier_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Active')
    address = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class PurchaseOrder(models.Model):
    number = models.CharField(max_length=100, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    product = models.CharField(max_length=255, default='General Supplies')
    quantity = models.IntegerField(default=1)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField()
    delivery_due_date = models.DateField(blank=True, null=True)
    reminder_days = models.IntegerField(default=3)
    status = models.CharField(max_length=50)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)
