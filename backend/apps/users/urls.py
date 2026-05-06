from django.urls import path
from .views import UserDataView, LoginView

urlpatterns = [
    path('', UserDataView.as_view(), name='user-data'),
    path('login/', LoginView.as_view(), name='login'),
]
