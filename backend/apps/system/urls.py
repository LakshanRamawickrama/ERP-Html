from django.urls import path
from .views import SystemDataView, ConnectedEmailView, ConnectedEmailDetailView, NoteView, NoteDetailView

urlpatterns = [
    path('', SystemDataView.as_view(), name='system-data'),
    path('emails/', ConnectedEmailView.as_view(), name='emails'),
    path('emails/<str:pk>/', ConnectedEmailDetailView.as_view(), name='email-detail'),
    path('notes/', NoteView.as_view(), name='notes'),
    path('notes/<str:pk>/', NoteDetailView.as_view(), name='note-detail'),
]
