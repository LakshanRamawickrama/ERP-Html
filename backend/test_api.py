import os
import django
import json
from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth.models import User

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.reports.views import DashboardDataView

def test_dashboard():
    factory = APIRequestFactory()
    view = DashboardDataView.as_view()
    
    # Create a user
    user, created = User.objects.get_or_create(username='testadmin', is_superuser=True)
    
    request = factory.get('/api/reports/dashboard/')
    force_authenticate(request, user=user)
    
    response = view(request)
    print(f"Status Code: {response.status_code}")
    print("Response Data:")
    print(json.dumps(response.data, indent=2))

if __name__ == "__main__":
    test_dashboard()
