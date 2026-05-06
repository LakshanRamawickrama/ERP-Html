from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import SystemLog, SystemCredential, SystemAlert

class SystemLogSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = '__all__'

class SystemCredentialSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = SystemCredential
        fields = '__all__'

class SystemAlertSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = SystemAlert
        fields = '__all__'
