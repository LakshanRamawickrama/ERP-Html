from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import SystemLog, SystemCredential, SystemAlert, ConnectedEmail, Note
from core.encryption import encrypt_password, decrypt_password

class SystemLogSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = '__all__'

class SystemCredentialSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = SystemCredential
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if 'password' in ret:
            ret['password'] = decrypt_password(ret['password'])
        return ret

    def to_internal_value(self, data):
        if 'password' in data:
            data['password'] = encrypt_password(data['password'])
        return super().to_internal_value(data)

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
