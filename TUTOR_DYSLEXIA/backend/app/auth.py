from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .db_connections import users_collection
from django.contrib.auth.hashers import make_password, check_password


@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)

        if users_collection.find_one({"username": data["username"]}):
            return JsonResponse({"error": "User already exists"}, status=400)

        users_collection.insert_one({
            "username": data["username"],
            "password": make_password(data["password"]),
            "role": "student"
        })

        return JsonResponse({"message": "User created successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)

        user = users_collection.find_one({"username": data["username"]})

        if user and check_password(data["password"], user["password"]):
            return JsonResponse({"message": "Login successful"})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
