from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import SystemCredential, SystemAlert, ConnectedEmail, Note
from .serializers import SystemCredentialSerializer, SystemAlertSerializer, ConnectedEmailSerializer, NoteSerializer
from apps.users.utils import get_filtered_queryset, apply_ownership

class SystemDataView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        credentials = SystemCredential.objects.all()

        return Response({
            "credentials": SystemCredentialSerializer(credentials, many=True).data,
            "options": {
                "services": ["Till Terminal", "PayPoint", "Admin Dashboard", "Cloud Storage", "AWS Portal", "Google Cloud", "Office 365"],
                "statuses": ["Active", "Locked", "Maintenance"]
            }
        })


class SystemCredentialView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SystemCredentialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SystemCredentialDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            credential = SystemCredential.objects.get(pk=pk)
            serializer = SystemCredentialSerializer(credential, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SystemCredential.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            credential = SystemCredential.objects.get(pk=pk)
            credential.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SystemCredential.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ConnectedEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        emails = ConnectedEmail.objects.all()
        return Response(ConnectedEmailSerializer(emails, many=True).data)

    def post(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.email
        data.setdefault('status', 'Connected')
        serializer = ConnectedEmailSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConnectedEmailDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            email = ConnectedEmail.objects.get(pk=pk)
            email.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ConnectedEmail.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class NoteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notes = get_filtered_queryset(request, Note)
        return Response(NoteSerializer(notes, many=True).data)

    def post(self, request):
        data = request.data.copy()
        data = apply_ownership(request, data)
        serializer = NoteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NoteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notes = get_filtered_queryset(request, Note)
        try:
            note = notes.get(pk=pk)
            serializer = NoteSerializer(note, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Note.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        notes = get_filtered_queryset(request, Note)
        try:
            note = notes.get(pk=pk)
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Note.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
