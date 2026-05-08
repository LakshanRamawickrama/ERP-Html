import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from pymongo import MongoClient

def cleanup_database():
    db_config = settings.DATABASES['default']
    host = db_config.get('HOST') or db_config.get('CLIENT', {}).get('host', 'mongodb://localhost:27017/')
    db_name = db_config.get('NAME', 'ERP_System_Pro')
    
    client = MongoClient(host)
    db = client[db_name]
    
    print(f"Starting HARD reset of database: {db_name} on {host.split('@')[-1] if '@' in host else host}")
    
    # Drop EVERYTHING to allow Django to recreate it cleanly
    collections = db.list_collection_names()
    for coll in collections:
        db.drop_collection(coll)
        print(f"Dropped: {coll}")
            
    print("\nDatabase is now EMPTY. You can now run 'python manage.py migrate' followed by 'python seed.py'.")
    client.close()

if __name__ == "__main__":
    cleanup_database()
