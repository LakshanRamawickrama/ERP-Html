from django.urls import path
from .views import ReminderDataView

urlpatterns = [
    path('', ReminderDataView.as_view(), name='reminders-data'),
    path('<int:pk>/', ReminderDataView.as_view(), name='reminders-detail'),
]
