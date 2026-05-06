from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LegalDocument
from .serializers import LegalDocumentSerializer

class LegalDataView(APIView):
    def get(self, request):
        documents = LegalDocument.objects.all()
        expired_count = documents.filter(status='Expired').count()

        return Response({
            "docs": LegalDocumentSerializer(documents, many=True).data,
            "summary": {
                "expiredDocs": expired_count
            },
            "options": ["License", "Permit", "Contract", "Agreement", "NDA", "Insurance", "Other"]
        })
