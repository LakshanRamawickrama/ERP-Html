from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Reminder

class ReminderSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    date = serializers.CharField(source='due_date', required=False)

    class Meta:
        model = Reminder
        fields = ['id', 'title', 'description', 'due_date', 'date', 'priority', 'is_completed', 'business', 'created_by']
        extra_kwargs = {
            'due_date': {'required': False},
            'description': {'required': False}
        }
