import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from pymongo import MongoClient

db_config = settings.DATABASES['default']
host = db_config.get('HOST') or db_config.get('CLIENT', {}).get('host', 'mongodb://localhost:27017/')
db_name = db_config.get('NAME', 'ERP_System_Pro')

client = MongoClient(host)
db = client[db_name]
collections = db.list_collection_names()
print(f"Collections in '{db_name}':")
for coll in sorted(collections):
    print(coll)
client.close()
