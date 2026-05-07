from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    min_stock = models.IntegerField(default=10)
    status = models.CharField(max_length=50, default='Active')
    supplier_ref = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class StockMovement(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    movement_date = models.DateField(blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(max_length=10) # IN/OUT
    quantity = models.IntegerField()
    reason = models.CharField(max_length=100, blank=True, null=True)
    reference = models.CharField(max_length=255, blank=True, null=True)
    handled_by = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)
