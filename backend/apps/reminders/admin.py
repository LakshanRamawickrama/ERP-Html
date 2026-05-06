from django.contrib import admin
from .models import Reminder

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('title', 'due_date', 'priority', 'is_completed')
    search_fields = ('title',)
    list_filter = ('priority', 'is_completed')
