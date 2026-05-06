from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .db_connections import quiz_collection, progress_collection
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def add_quiz(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ["question", "options", "correct_answer", "difficulty"]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return JsonResponse({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=400)
            
            quiz = {
                "question": data["question"],
                "options": data["options"],
                "correct_answer": data["correct_answer"],
                "difficulty": data["difficulty"]
            }
            result = quiz_collection.insert_one(quiz)
            return JsonResponse({
                "message": "Quiz added successfully",
                "quiz_id": str(result.inserted_id)
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logger.error(f"Error adding quiz: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=405)

def get_quiz(request):
    try:
        difficulty = request.GET.get("difficulty", "easy")
        
        # Validate difficulty parameter
        valid_difficulties = ["easy", "medium", "hard"]
        if difficulty not in valid_difficulties:
            difficulty = "easy"
        
        quizzes = list(quiz_collection.find({"difficulty": difficulty}))
        
        # Convert ObjectId to string and hide correct answers
        for quiz in quizzes:
            quiz["_id"] = str(quiz["_id"])
            if "correct_answer" in quiz:
                del quiz["correct_answer"]  # Hide answer from student
        
        return JsonResponse(quizzes, safe=False)
    except Exception as e:
        logger.error(f"Error fetching quizzes: {str(e)}")
        return JsonResponse({"error": "Failed to fetch quizzes"}, status=500)

@csrf_exempt
def submit_quiz(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Validate required fields
            if "quiz_id" not in data or "selected_answer" not in data:
                return JsonResponse({"error": "Missing quiz_id or selected_answer"}, status=400)
            
            # Validate ObjectId format
            try:
                quiz_id = ObjectId(data["quiz_id"])
            except Exception:
                return JsonResponse({"error": "Invalid quiz_id format"}, status=400)
            
            quiz = quiz_collection.find_one({"_id": quiz_id})
            if not quiz:
                return JsonResponse({"error": "Quiz not found"}, status=404)
            
            is_correct = data["selected_answer"] == quiz.get("correct_answer")
            
            return JsonResponse({
                "correct": is_correct,
                "correct_answer": quiz.get("correct_answer") if is_correct else None
            })
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logger.error(f"Error submitting quiz: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid method"}, status=405)