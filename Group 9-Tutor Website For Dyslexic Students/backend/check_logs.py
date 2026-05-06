import pymongo
from datetime import datetime

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['tutor_dyslexia']
logs = db['interaction_logs']

print(f"Total interaction logs: {logs.count_documents({})}")

latest_logs = logs.find().sort('timestamp', -1).limit(10)
print("\nLatest 10 logs:")
for log in latest_logs:
    print(f"User: {log.get('username')}, Metric: {log.get('metric')}, Value: {log.get('value')}, Struggling: {log.get('is_struggling')}, Time: {log.get('timestamp')}")

user_struggles = logs.count_documents({'is_struggling': True})
print(f"\nTotal 'struggling' logs: {user_struggles}")
