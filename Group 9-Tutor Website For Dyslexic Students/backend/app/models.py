

from django.db import models
from django.contrib.auth.models import User

# --- 1. LESSON MODEL ---
class Lesson(models.Model):
    level = models.IntegerField()
    subject = models.CharField(max_length=100)
    chapter = models.CharField(max_length=100)
    text_content = models.JSONField()  # Store list of text strings
    audio_path = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Level {self.level}: {self.subject} - {self.chapter}"

# --- 2. QUIZ MODEL ---
class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    question_text = models.TextField()
    options = models.JSONField()  # Store list of options
    answer = models.CharField(max_length=255)
    # Categorized for adaptive difficulty adjustment
    difficulty_level = models.CharField(max_length=20, default='Easy') # Easy, Medium, Hard

# --- 3. INTERACTION LOG (Behavioral Tracking) ---
class InteractionLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_id = models.IntegerField()
    cursor_dwell_time = models.FloatField() # Captured from frontend in ms
    click_latency = models.FloatField()     # Time taken to answer
    timestamp = models.DateTimeField(auto_now_add=True)
    # State detected by your logic (Efficient, Struggling, Fatigued)
    engagement_state = models.CharField(max_length=50) 

# --- 4. STUDENT PROGRESS (Profile) ---
class StudentProgress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_difficulty_level = models.IntegerField(default=1) # 1 to 5
    mastery_score = models.FloatField(default=0.0)
    struggle_time_total = models.FloatField(default=0.0)