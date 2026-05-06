from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
# Ensure these match your db_connections.py file exactly
from .db_connections import interaction_collection, lessons_collection, users_collection 

# --- 1. GET ALL LESSONS ---
@csrf_exempt
def get_lessons(request):
    try:
        lessons = list(lessons_collection.find({}, {"_id": 0}))
        return JsonResponse(lessons, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# --- 2. GET A SINGLE LESSON ---
@csrf_exempt
def get_lesson(request, lesson_id=None):
    try:
        target_id = lesson_id or request.GET.get('id')
        lesson = lessons_collection.find_one({"id": target_id}, {"_id": 0})
        if lesson:
            return JsonResponse(lesson)
        return JsonResponse({"error": "Lesson not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# --- 3. ADAPTIVE LOGIC: STRUGGLE HANDLER ---
@csrf_exempt
def handle_struggle(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            user = users_collection.find_one({"username": username})
            
            if not user:
                return JsonResponse({"error": "User not found"}, status=404)

            # Logic: Move down one level if possible (e.g., Level 4 -> Level 3)
            current_lvl = int(user.get("level", "Level 1").split(" ")[1])
            new_lvl = max(1, current_lvl - 1)
            new_lvl_str = f"Level {new_lvl}"

            users_collection.update_one({"username": username}, {"$set": {"level": new_lvl_str}})
            
            # Fetch simpler content for the student
            easier_lesson = lessons_collection.find_one({"level": new_lvl}, {"_id": 0})
            
            return JsonResponse({
                "status": "adapted",
                "new_level": new_lvl_str,
                "lesson": easier_lesson
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

# --- 4. LOG INTERACTIONS (Behavioral Tracker) ---
@csrf_exempt
def log_interaction(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username", "student_user")
            value = data.get("value", 0)
            metric = data.get("metric") # e.g., 'cursorDwellTime' or 'userInteraction'
            
            # 🕵️ Adaptive AI Logic: 
            # We detect if the student is struggling based on timing metrics
            is_struggling = False
            if metric in ['cursorDwellTime', 'userInteraction'] and value > 4000:
                is_struggling = True
            elif metric == 'clickLatency' and value > 8000: # Taking more than 8 seconds to answer a quiz question
                is_struggling = True
            
            log_entry = {
                "username": username,
                "metric": metric,
                "value": value,
                "is_struggling": is_struggling,
                "timestamp": datetime.now()
            }
            interaction_collection.insert_one(log_entry)

            # 🛠️ EXTRA POLISH: Update the main USER document too!
            # This makes sure the "isStruggling" status sticks to the user profile
            users_collection.update_one(
                {"username": username},
                {"$set": {"isStruggling": is_struggling}}
            )

            return JsonResponse({"status": "success", "struggling": is_struggling}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

# --- 5. LOGIN USER ---
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            user = users_collection.find_one({"username": username}, {"_id": 0})

            if user:
                # Check password
                if "password" in user:
                    if str(user["password"]) == str(password):
                        return JsonResponse(user, status=200)
                    else:
                        return JsonResponse({"error": "Incorrect password pin"}, status=401)
                else:
                    # Legacy user with no password, set it now
                    users_collection.update_one({"username": username}, {"$set": {"password": password}})
                    user["password"] = password
                    return JsonResponse(user, status=200)
            else:
                new_user = {
                    "username": username,
                    "password": password,
                    "level": "Level 1", 
                    "stars": 0,
                    "state": {
                        "page": "dashboard",
                        "currentLevel": 1,
                        "subject": None,
                        "chapterData": None,
                        "progress": {"Science": {}, "Math": {}, "English": {}, "GK": {}}
                    }
                }
                users_collection.insert_one(new_user.copy())
                return JsonResponse(new_user, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

# --- 6. SAVE USER STATE ---
@csrf_exempt
def save_user_state(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            state = data.get("state")

            if not username or not state:
                return JsonResponse({"error": "Missing username or state data"}, status=400)

            # Update the user's document with the provided state
            # We also update top-level 'level' and 'stars' if provided in the state payload
            update_data = {"state": state}
            
            if "levelString" in state:
                update_data["level"] = state["levelString"]
            if "totalStars" in state:
                update_data["stars"] = state["totalStars"]

            result = users_collection.update_one(
                {"username": username},
                {"$set": update_data}
            )

            if result.matched_count > 0:
                return JsonResponse({"status": "success", "message": "Progress and state saved"}, status=200)
            else:
                return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=405)