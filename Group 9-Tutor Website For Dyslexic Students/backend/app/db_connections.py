import pymongo
import logging
from pymongo.errors import ConnectionFailure

logger = logging.getLogger(__name__)

try:
    client = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    # Verify connection
    client.admin.command('ping')
    logger.info("Connected to MongoDB successfully")
except ConnectionFailure as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    logger.warning("MongoDB connection failed. Make sure MongoDB is running on localhost:27017")
    client = None
except Exception as e:
    logger.error(f"Unexpected error connecting to MongoDB: {e}")
    client = None

if client:
    db = client["tutor_dyslexia"]
    users_collection = db["users"]
    interaction_collection = db["interaction_logs"]
    lessons_collection = db["lessons"]
    quiz_collection = db["quiz"]
    progress_collection = db["progress"]
    print("🚀 MongoDB Collections are ready to use!")
else:
    # Create dummy collections for development
    logger.warning("Using dummy collections - MongoDB is not available")
    users_collection = None
    interaction_collection = None
    lessons_collection = None
    quiz_collection = None
    progress_collection = None
