from django.contrib import admin
from .models import Asset, MaintenanceRequest

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'asset_type', 'assigned_person', 'status')
    search_fields = ('name', 'location', 'assigned_person')
    list_filter = ('asset_type', 'status')

@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ('issue', 'date', 'asset', 'priority', 'status')
    search_fields = ('issue', 'asset__name', 'technician')
    list_filter = ('priority', 'status')
