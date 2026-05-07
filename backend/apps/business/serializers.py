from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import BusinessEntity, CompanyStructure

class BusinessEntitySerializer(MongoSerializerMixin, serializers.ModelSerializer):
    num = serializers.CharField(source='company_number', read_only=True)
    cat = serializers.CharField(source='category', read_only=True)
    hq = serializers.CharField(source='hq_location', read_only=True)
    
    class Meta:
        model = BusinessEntity
        fields = '__all__'

class CompanyStructureSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    sic = serializers.CharField(source='sic_code', read_only=True)
    due = serializers.DateField(source='filing_due', read_only=True)
    addr = serializers.CharField(source='address', read_only=True)
    balance_sheet_url = serializers.SerializerMethodField()
    pl_url = serializers.SerializerMethodField()

    class Meta:
        model = CompanyStructure
        fields = '__all__'

    def _url(self, request, field):
        if field and hasattr(field, 'url'):
            return request.build_absolute_uri(field.url) if request else field.url
        return None

    def get_balance_sheet_url(self, obj):
        return self._url(self.context.get('request'), obj.balance_sheet)

    def get_pl_url(self, obj):
        return self._url(self.context.get('request'), obj.pl_statement)
