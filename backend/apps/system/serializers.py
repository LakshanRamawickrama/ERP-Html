from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import SystemLog, SystemCredential, SystemAlert, ConnectedEmail, Note

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

class ConnectedEmailSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = ConnectedEmail
        fields = '__all__'

class NoteSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
