import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tutor_project.settings")
django.setup()

from app.models import Lesson, Quiz

def populate():
    print("🧹 Cleaning old database entries...")
    Quiz.objects.all().delete()
    Lesson.objects.all().delete()

    lessons_data = [
        {
            "level": 1, "subject": "English", "chapter": "Alphabet Basics",
            "text": ["A is for Apple.", "B is for Ball."],
            "quiz": [{"q": "What starts with A?", "opts": ["Apple", "Dog", "Cat"], "a": "Apple"}]
        },
        {
            "level": 2, "subject": "English", "chapter": "Simple Words",
            "text": ["C-A-T spells Cat.", "The cat sat on the mat."],
            "quiz": [{"q": "Rhymes with Cat?", "opts": ["Mat", "Sun", "Pin"], "a": "Mat"}]
        },
        {
            "level": 3, "subject": "Maths", "chapter": "Basic Addition",
            "text": ["1 + 1 = 2.", "2 + 2 = 4."],
            "quiz": [{"q": "What is 2 + 2?", "opts": ["3", "4", "5"], "a": "4"}]
        },
        {
            "level": 4, "subject": "Science", "chapter": "The Plants",
            "text": ["Plants need water to grow.", "Leaves are usually green."],
            "quiz": [{"q": "What do plants need?", "opts": ["Water", "Soda", "Milk"], "a": "Water"}]
        },
        {
            "level": 5, "subject": "Science", "chapter": "Solar System",
            "text": ["The Sun is a star.", "Earth is the third planet."],
            "quiz": [{"q": "What is the Sun?", "opts": ["Star", "Planet", "Moon"], "a": "Star"}]
        }
    ]

    for data in lessons_data:
        # ✅ Using correct fields: level, subject, chapter, text_content
        lesson_obj = Lesson.objects.create(
            level=data['level'],
            subject=data['subject'],
            chapter=data['chapter'],
            text_content=data['text'],
            audio_path="" 
        )
        
        for q in data['quiz']:
            # ✅ Using correct fields: question_text, options, answer
            Quiz.objects.create(
                lesson=lesson_obj,
                question_text=q['q'],
                options=q['opts'],
                answer=q['a'],
                difficulty_level="Easy"
            )
        print(f"✅ Created: Level {data['level']} - {data['chapter']}")

if __name__ == "__main__":
    populate()
    print("\n🚀 All 5 Levels successfully loaded into the database!")