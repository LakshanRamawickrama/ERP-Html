from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Reminder

class ReminderSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    description = serializers.CharField(read_only=True)

    class Meta:
        model = Reminder
        fields = '__all__'

    def get_date(self, obj):
        # Return formatted date string for frontend display
        if obj.due_date:
            return obj.due_date.strftime('%Y-%m-%d')
        return ''
