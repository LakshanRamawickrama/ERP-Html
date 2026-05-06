from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LegalDocument
from .serializers import LegalDocumentSerializer

class LegalDataView(APIView):
    def get(self, request):
        documents = LegalDocument.objects.all()
        
        return Response({
            "documents": LegalDocumentSerializer(documents, many=True).data
        })
