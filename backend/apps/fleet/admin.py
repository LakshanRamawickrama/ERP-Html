from django.contrib import admin
from .models import Vehicle, Delivery, ParcelPartner

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('name', 'plate_number', 'business', 'mot_date', 'status')
    search_fields = ('name', 'plate_number', 'business')
    list_filter = ('status', 'business')

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'pickup_date', 'delivery_date', 'status')
    search_fields = ('vehicle__name', 'address', 'contact_person')
    list_filter = ('status',)

@admin.register(ParcelPartner)
class ParcelPartnerAdmin(admin.ModelAdmin):
    list_display = ('provider', 'vehicle', 'service_date', 'status')
    search_fields = ('provider', 'area', 'contact_name')
    list_filter = ('status',)
