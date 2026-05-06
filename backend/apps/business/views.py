from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import BusinessEntity, CompanyStructure
from .serializers import BusinessEntitySerializer, CompanyStructureSerializer

class BusinessDataView(APIView):
    """View to fetch aggregated data for the frontend dashboard"""
    def get(self, request):
        entities = BusinessEntity.objects.all()
        structures = CompanyStructure.objects.all()
        
        return Response({
            "entities": BusinessEntitySerializer(entities, many=True).data,
            "structures": CompanyStructureSerializer(structures, many=True).data,
            "options": {
                "categories": ["Retail", "Logistics", "Finance", "Tech", "Healthcare"]
            }
        })

from core.permissions import IsSuperAdmin

class BusinessEntityListCreateView(generics.ListCreateAPIView):
    queryset = BusinessEntity.objects.all()
    serializer_class = BusinessEntitySerializer
    permission_classes = [IsSuperAdmin] # Only Super Admins can create entities

class BusinessEntityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BusinessEntity.objects.all()
    serializer_class = BusinessEntitySerializer
    permission_classes = [IsSuperAdmin] # Only Super Admins can edit/delete
