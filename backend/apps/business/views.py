from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BusinessEntity, CompanyStructure
from .serializers import BusinessEntitySerializer, CompanyStructureSerializer
from apps.users.models import StaffProfile

class BusinessDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Determine business scope
        profile = StaffProfile.objects.filter(email=request.user.email).first()
        business_scope = profile.assigned_business if profile else 'All'
        
        if business_scope == 'All' or request.user.is_superuser:
            entities = BusinessEntity.objects.all()
            structures = CompanyStructure.objects.all()
        else:
            entities = BusinessEntity.objects.filter(name=business_scope)
            structures = CompanyStructure.objects.filter(name=business_scope)
        
        return Response({
            "entities": BusinessEntitySerializer(entities, many=True).data,
            "structures": CompanyStructureSerializer(structures, many=True).data,
            "options": {
                "categories": ["Retail", "Logistics", "Finance", "Tech", "Healthcare"]
            }
        })
