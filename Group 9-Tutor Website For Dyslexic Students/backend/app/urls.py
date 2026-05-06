from django.urls import path
from .views import get_lessons, get_lesson, log_interaction, login_user, handle_struggle, save_user_state
from .quiz import add_quiz, get_quiz, submit_quiz

urlpatterns = [
    # Auth
    path('login/', login_user, name='login_user'), 
    path('save-state/', save_user_state, name='save_user_state'),

    # Content
    path("lessons/", get_lessons, name="get_lessons"),
    path('lessons/<str:lesson_id>/', get_lesson, name='get_lesson'),

    # Adaptive Intelligence Endpoints
    path("log/", log_interaction, name="log_interaction"),
    path("struggle/", handle_struggle, name="handle_struggle"),

    # Quizzes
    path("add-quiz/", add_quiz, name="add_quiz"),
    path("quiz/", get_quiz, name="get_quiz"),
    path("submit-quiz/", submit_quiz, name="submit_quiz"),
]