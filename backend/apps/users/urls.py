from django.urls import path
from .views import UserDataView

urlpatterns = [
    path('', UserDataView.as_view(), name='user-data'),
]
