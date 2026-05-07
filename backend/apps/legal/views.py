from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import LegalDocument
from .serializers import LegalDocumentSerializer

class LegalDataView(APIView):
    def get(self, request):
        documents = LegalDocument.objects.all()
        expired_count = documents.filter(status='Expired').count()

        return Response({
            "docs": LegalDocumentSerializer(documents, many=True, context={'request': request}).data,
            "summary": {
                "expiredDocs": expired_count
            },
            "options": ["License", "Permit", "Contract", "Agreement", "NDA", "Insurance", "Other"]
        })


class LegalDocumentView(APIView):
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
            )
            return Response(LegalDocumentSerializer(doc, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            doc = LegalDocument.objects.get(pk=pk)
        except LegalDocument.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data
        files = request.FILES
        doc.title = data.get('title', doc.title)
        doc.type = data.get('type', doc.type)
        doc.status = data.get('status', doc.status)
        if data.get('expiry_date') or data.get('expiry'):
            doc.expiry_date = data.get('expiry_date') or data.get('expiry')
        if files.get('document_file'):
            doc.document_file = files.get('document_file')
        doc.save()
        return Response(LegalDocumentSerializer(doc, context={'request': request}).data)

    def delete(self, request, pk):
        try:
            doc = LegalDocument.objects.get(pk=pk)
            doc.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except LegalDocument.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
