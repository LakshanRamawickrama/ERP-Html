from django.urls import path
from .views import SystemDataView, SystemCredentialView, SystemCredentialDetailView, ConnectedEmailView, ConnectedEmailDetailView, NoteView, NoteDetailView

urlpatterns = [
    path('', SystemDataView.as_view(), name='system-data'),
    path('credentials/', SystemCredentialView.as_view(), name='credentials'),
    path('credentials/<str:pk>/', SystemCredentialDetailView.as_view(), name='credential-detail'),
    path('emails/', ConnectedEmailView.as_view(), name='emails'),
    path('emails/<str:pk>/', ConnectedEmailDetailView.as_view(), name='email-detail'),
    path('notes/', NoteView.as_view(), name='notes'),
    path('notes/<str:pk>/', NoteDetailView.as_view(), name='note-detail'),
]
