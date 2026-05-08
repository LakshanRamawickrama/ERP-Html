import os
import django
import sys

# Set up Django environment
backend_dir = r"C:\Users\thind\OneDrive\Documents\GitHub\ERP-Html\backend"
sys.path.append(backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings

print(f"MONGO_URL from env (MONGO_URL): {os.environ.get('MONGO_URL')}")
print(f"MONGO_URL from env (MONGODB_URL): {os.environ.get('MONGODB_URL')}")
print(f"Settings MONGO_URL: {getattr(settings, 'MONGO_URL', 'Not Found')}")
print(f"Default DB Settings: {settings.DATABASES['default']}")
