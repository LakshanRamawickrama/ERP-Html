from django.contrib import admin
from .models import LegalDocument

@admin.register(LegalDocument)
class LegalDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'status', 'expiry_date')
    search_fields = ('title',)
    list_filter = ('type', 'status')
