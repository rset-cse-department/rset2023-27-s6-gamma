import pymongo
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['tutor_dyslexia']
users = db['users']

print("User Struggling Status:")
for u in users.find():
    print(f"User: {u.get('username')}, Struggling: {u.get('isStruggling')}")
