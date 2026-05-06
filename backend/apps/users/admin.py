from django.contrib import admin
from .models import StaffProfile

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'assigned_business', 'email', 'status')
    search_fields = ('name', 'email', 'assigned_business')
    list_filter = ('role', 'assigned_business', 'status')
