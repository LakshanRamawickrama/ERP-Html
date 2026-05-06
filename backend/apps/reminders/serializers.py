from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import Reminder

class ReminderSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'
