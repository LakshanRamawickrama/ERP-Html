from pymongo import MongoClient

def cleanup_database():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['ERP_System_Pro']
    
    print(f"Starting HARD reset of database: {db.name}")
    
    # Drop EVERYTHING to allow Django to recreate it cleanly
    collections = db.list_collection_names()
    for coll in collections:
        db.drop_collection(coll)
        print(f"Dropped: {coll}")
            
    print("\nDatabase is now EMPTY. You can now run 'python manage.py migrate' followed by 'python seed.py'.")
    client.close()

if __name__ == "__main__":
    cleanup_database()
