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
    
    class Meta:
        model = CompanyStructure
        fields = '__all__'
