from django.urls import path
from .views import UserDataView, LoginView, StaffView, ChangePasswordView

urlpatterns = [
    path('', UserDataView.as_view(), name='user-data'),
    path('login/', LoginView.as_view(), name='login'),
    path('staff/', StaffView.as_view(), name='staff-create'),
    path('staff/<str:pk>/', StaffView.as_view(), name='staff-update'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
