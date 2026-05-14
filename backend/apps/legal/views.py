from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import LegalDocument
from .serializers import LegalDocumentSerializer
from apps.users.utils import get_filtered_queryset
from apps.business.models import BusinessEntity

class LegalDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        documents = get_filtered_queryset(request, LegalDocument)
        user_business = getattr(request.user, 'assigned_business', 'All')
        return Response({
            "docs": LegalDocumentSerializer(documents, many=True, context={'request': request}).data,
            "summary": {}, # Centralized in Reminders module
            "options": {
                "types": ["License", "Permit", "Contract", "Agreement", "NDA", "Insurance", "Other"],
                "businesses": [user_business] if user_business != 'All' else list(BusinessEntity.objects.values_list('name', flat=True).distinct())
            }
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
                authority=data.get('authority', ''),
                document_file=files.get('document_file'),
                business=getattr(request.user, 'assigned_business', ''),
                created_by=request.user.email
            )
            return Response(LegalDocumentSerializer(doc, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            doc = LegalDocument.objects.get(pk=pk)
            data = request.data
            files = request.FILES
            if 'title' in data: doc.title = data['title']
            if 'type' in data: doc.type = data['type']
            if 'status' in data: doc.status = data['status']
            if 'authority' in data: doc.authority = data['authority']
            if data.get('expiry_date'): doc.expiry_date = data.get('expiry_date')
            if 'document_file' in files: doc.document_file = files['document_file']
            doc.save()
            return Response(LegalDocumentSerializer(doc, context={'request': request}).data)
        except LegalDocument.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk=None):
        try:
            doc = LegalDocument.objects.get(pk=pk)
            doc.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except LegalDocument.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
