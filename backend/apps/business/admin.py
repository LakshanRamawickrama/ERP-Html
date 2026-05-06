from django.contrib import admin
from .models import BusinessEntity, CompanyStructure

@admin.register(BusinessEntity)
class BusinessEntityAdmin(admin.ModelAdmin):
    list_display = ('name', 'company_number', 'category', 'status')
    search_fields = ('name', 'company_number')
    list_filter = ('category', 'status')

@admin.register(CompanyStructure)
class CompanyStructureAdmin(admin.ModelAdmin):
    list_display = ('name', 'crn', 'manager', 'filing_due')
    search_fields = ('name', 'crn', 'manager')
