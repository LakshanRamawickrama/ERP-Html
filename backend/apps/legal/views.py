from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import LegalDocument
from .serializers import LegalDocumentSerializer
from apps.users.utils import get_filtered_queryset

class LegalDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        documents = get_filtered_queryset(request, LegalDocument)
        return Response({
            "docs": LegalDocumentSerializer(documents, many=True, context={'request': request}).data,
            "summary": {}, # Centralized in Reminders module
            "options": ["License", "Permit", "Contract", "Agreement", "NDA", "Insurance", "Other"]
        })

class LegalDocumentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            doc = LegalDocument.objects.create(
                title=data.get('title', ''),
                type=data.get('type', ''),
                status=data.get('status', 'Active'),
                expiry_date=data.get('expiry_date') or data.get('expiry') or '2099-01-01',
                document_file=files.get('document_file'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(LegalDocumentSerializer(doc, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
