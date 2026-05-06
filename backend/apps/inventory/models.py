from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    min_stock = models.IntegerField(default=10)

    def __str__(self):
        return self.name

class StockMovement(models.Model):
    date = models.DateField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    type = models.CharField(max_length=10) # IN/OUT
    quantity = models.IntegerField()
    notes = models.TextField(blank=True, null=True)
