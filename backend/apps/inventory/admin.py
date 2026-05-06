from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'quantity', 'price', 'min_stock')
    search_fields = ('name', 'sku')
    list_filter = ('category',)
