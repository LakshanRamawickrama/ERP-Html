from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import LegalDocument

class LegalDocumentSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = LegalDocument
        fields = '__all__'
