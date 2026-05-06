from rest_framework import serializers
from .models import BusinessEntity, CompanyStructure

class BusinessEntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessEntity
        fields = '__all__'

class CompanyStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyStructure
        fields = '__all__'
