from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import LegalDocument

class LegalDocumentSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    auth = serializers.SerializerMethodField()
    file = serializers.SerializerMethodField()
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = LegalDocument
        fields = '__all__'

    def get_auth(self, obj):
        # Authority is not stored, return a placeholder based on type
        authority_map = {
            'License': 'City Council',
            'Permit': 'Regulatory Authority',
            'Contract': 'Internal HR',
            'Agreement': 'Legal Department',
            'NDA': 'Legal Department',
        }
        return authority_map.get(obj.type, 'Issuing Authority')

    def get_file(self, obj):
        if obj.document_file and hasattr(obj.document_file, 'name') and obj.document_file.name:
            return obj.document_file.name.split('/')[-1]
        return f"{obj.title[:20]}.pdf"

    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document_file and hasattr(obj.document_file, 'url'):
            return request.build_absolute_uri(obj.document_file.url) if request else obj.document_file.url
        return None
