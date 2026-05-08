from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['ERP_System_Pro']
collections = db.list_collection_names()
print(f"Collections in 'ERP_System_Pro':")
for coll in sorted(collections):
    print(coll)
client.close()
