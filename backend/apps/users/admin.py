from django.contrib import admin
from .models import StaffProfile

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'department', 'email', 'status')
    search_fields = ('name', 'email', 'department')
    list_filter = ('role', 'department', 'status')
