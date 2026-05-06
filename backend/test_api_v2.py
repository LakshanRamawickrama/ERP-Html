import os
import django
import json
from django.conf import settings

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth.models import User
from apps.reports.views import DashboardDataView

def test_dashboard():
    factory = APIRequestFactory()
    view = DashboardDataView.as_view()
    
    # Create a user
    user, created = User.objects.get_or_create(username='superadmin')
    user.is_superuser = True
    user.save()
    
    request = factory.get('/api/reports/dashboard/')
    force_authenticate(request, user=user)
    
    try:
        response = view(request)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 500:
             print("500 Internal Server Error detected!")
             # In a real view, we'd want the traceback. 
             # Since we are calling it directly, it might raise the exception if not caught by middleware.
        else:
             print("Response Data (first 100 chars):")
             print(str(response.data)[:100])
    except Exception as e:
        print(f"EXCEPTION RAISED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_dashboard()
