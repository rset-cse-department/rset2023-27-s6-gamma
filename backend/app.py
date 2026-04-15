import joblib
import numpy as np
import pandas as pd
import requests

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from typing import Optional
from config import CONFIG


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load(
    r"C:\Users\HP\Desktop\React\wlb-ai-analyzer-main-ollama-revised\wlb-ai-analyzer-main-ollama--master\wlb-ai-analyzer-main\wlb-ai-analyzer-main\backend\model.pkl")
columns = joblib.load(
    r"C:\Users\HP\Desktop\React\wlb-ai-analyzer-main-ollama-revised\wlb-ai-analyzer-main-ollama--master\wlb-ai-analyzer-main\wlb-ai-analyzer-main\backend\columns.pkl")

columns = [col for col in columns if col != "Timestamp"]


OLLAMA_URL = CONFIG["OLLAMA_URL"]
OLLAMA_MODEL = CONFIG["OLLAMA_MODEL"]




class UserInput(BaseModel):
    features: list


class AIRequest(BaseModel):
    latest: dict
    history: Optional[list] = []



@app.get("/")
def home():
    return {"message": "Work Life Balance API Runn111ing 🚀"}


@app.get("/columns")
def get_columns():
    return {"columns": columns}


@app.post("/predict")
def predict(data: UserInput):

    values = []
    priorities = []

    for f in data.features:
        if isinstance(f, dict):
            values.append(f.get("value", 0))
            priorities.append(f.get("priority", 1))
        else:
            values.append(f)
            priorities.append(1)

    raw_score = sum(v * p for v, p in zip(values, priorities))

    min_score = sum(2 * p for p in priorities)
    max_score = sum(10 * p for p in priorities)

    normalized = (raw_score - min_score) / (max_score - min_score)
    percentage = normalized * 100

    input_df = pd.DataFrame([values], columns=columns)

    prediction = int(model.predict(input_df)[0])


    proba = model.predict_proba(input_df)[0]
    confidence = round(max(proba) * 100, 2)

    labels = {
        0: "Bad",
        1: "Average",
        2: "Good",
        3: "Excellent"
    }

    return {
        "prediction": prediction,
        "label": labels[prediction],
        "confidence": confidence,
        "score": round(percentage, 2),   # UI score
        "raw_score": round(raw_score, 2)
    }



@app.post("/ai-report")
def ai_report(data: AIRequest):

    latest = data.latest
    history = data.history[-5:] if data.history else []  # limit last 5

    # ================= BUILD HISTORY TEXT =================
    history_text = ""

    for i, h in enumerate(history):
        history_text += f"""
Previous Entry {i+1}:
Score: {h.get("score")}
Inputs: {h.get("inputs")}
"""

    # ================= PROMPT =================
    prompt = f"""


You are a thoughtful, emotionally intelligent wellness coach speaking to a college student.

Respond using bullet points only.
Each bullet point should contain 2–3 sentences (detailed, but not too long).
Do not write full paragraphs outside bullet points.

IMPORTANT:
- Do NOT use raw column names like FRUITS_VEGGIES or DAILY_STRESS.
- Convert all inputs into natural human-friendly terms.
  For example:
  FRUITS_VEGGIES → nutrition or eating habits
  DAILY_STRESS → stress levels
  SLEEP_HOURS → sleep quality 
  TIME_FOR_PASSION → hobbies or personal interests
- Always speak naturally like a human, not like a dataset.

Structure your response exactly like this:

• Overall Summary:
- Provide 2–3 detailed bullet points explaining the user’s current lifestyle balance.

• Trend Analysis (VERY IMPORTANT):
- Compare the latest score with previous scores and clearly describe the trend.
- Mention actual score changes (e.g., from 72 to 64).
- Explain what this trend suggests.

• Improvements:
- Mention areas that improved using natural language (NOT column names).
- Explain why those improvements matter.

• Declines:
- Mention areas that declined using natural language (NOT column names).
- Explain impact clearly.

• Advice:
- Give practical, realistic suggestions based on trends and weak areas.

• Encouragement:
- End with motivating bullet points referencing their journey.

Avoid generic advice.
STRICTLY use bullet points.
Do NOT use technical or dataset-style words.

Latest Score: {latest.get("score")}

Latest Inputs:
{latest.get("inputs")}

Previous History:
{history_text if history_text else "No previous data"}

"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            }
        )

        result = response.json()

        return {"report": result["response"]}

    except Exception as e:
        print("AI ERROR:", e)
        return {"report": str(e)}