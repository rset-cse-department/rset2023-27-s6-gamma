import pymongo
from datetime import datetime

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['tutor_dyslexia']
logs = db['interaction_logs']
users = db['users']

print(f"--- DATABASE STATUS ---")
print(f"Total interaction logs: {logs.count_documents({})}")
print(f"Struggling interaction logs: {logs.count_documents({'is_struggling': True})}")

print("\n--- LATEST INTERACTION LOGS ---")
latest_logs = logs.find().sort('timestamp', -1).limit(5)
for log in latest_logs:
    print(f"User: {log.get('username'):10} | Metric: {log.get('metric'):15} | Value: {log.get('value'):6} | Struggling: {str(log.get('is_struggling')):5} | Time: {log.get('timestamp')}")

print("\n--- USER STATUS ---")
for u in users.find():
    print(f"User: {u.get('username'):10} | Level: {u.get('level'):10} | Struggling: {u.get('isStruggling')}")
