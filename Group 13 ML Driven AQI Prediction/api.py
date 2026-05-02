from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import json
import joblib
from tensorflow.keras.models import load_model

app = FastAPI(title="AQI Prediction API")

# Enable CORS for the frontend React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# LOAD DATA
# =========================
df = pd.read_csv("dataset_clean1.csv")
df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values("Date")

FEATURES = ["AQI", "PM2.5", "PM10", "NO2", "SO2", "CO", "O3", "NH3"]
WINDOW = 7

# Identify unique cities for one-hot encoding consistency globally
unique_cities = sorted(df["city"].unique().tolist())

# Impute missing values exactly like app.py does (over the entire dataset globally)
df = df[["city", "Date"] + FEATURES]
df = df.fillna(df.mean(numeric_only=True))

# =========================
# LOAD MODELS
# =========================
scaler = joblib.load("aqi_scaler.pkl")
rf_model = joblib.load("models/rf_model.pkl")
xgb_model = joblib.load("models/xgb_model.pkl")
feature_columns = joblib.load("feature_columns.pkl")

lin_model = joblib.load("models/linear_model.pkl")
svm_model = joblib.load("models/svm_model.pkl")
tree_scaler = joblib.load("tree_scaler.pkl")

lstm_model = load_model("models/lstm_model.keras", compile=False)
gru_model = load_model("models/gru_model.keras", compile=False)

# =========================
# LOAD PRE-COMPUTED METRICS
# =========================
with open("models/metrics.json", "r") as f:
    model_metrics = json.load(f)

# =========================
# HELPERS
# =========================
def categorize_aqi(aqi: float) -> str:
    if aqi <= 50: return "Good"
    elif aqi <= 100: return "Moderate"
    elif aqi <= 150: return "Unhealthy (Sensitive)"
    elif aqi <= 200: return "Unhealthy"
    elif aqi <= 300: return "Very Unhealthy"
    else: return "Hazardous"

def get_color(category: str) -> str:
    if category == "Good": return "#16a34a"
    elif category == "Moderate": return "#facc15"
    elif category == "Unhealthy (Sensitive)": return "#f97316"
    else: return "#dc2626"

pollutant_disease_risks = {
    "PM2.5": ["Asthma attacks", "Bronchitis", "Reduced lung function", "Heart disease risk", "Lung cancer"],
    "PM10": ["Respiratory irritation", "Asthma aggravation", "Bronchitis", "Reduced lung capacity"],
    "NO2": ["Inflammation of airways", "Asthma worsening", "Respiratory infections"],
    "SO2": ["Breathing difficulty", "Asthma attacks", "Bronchial irritation"],
    "CO": ["Reduced oxygen supply", "Headaches", "Dizziness", "Heart stress"],
    "O3": ["Chest pain", "Coughing", "Lung inflammation", "Reduced lung function"],
    "NH3": ["Eye irritation", "Skin irritation", "Breathing difficulty", "Respiratory inflammation"]
}

pollutant_thresholds = {
    "PM2.5": 60, "PM10": 100, "NO2": 80, "SO2": 80, "CO": 2, "O3": 100, "NH3": 400
}

# =========================
# API MODELS & ENDPOINTS
# =========================
class PredictRequest(BaseModel):
    city: str

@app.get("/api/cities")
def get_cities():
    cities = sorted(df["city"].unique().tolist())
    return {"cities": cities}

@app.post("/api/predict")
def predict_aqi(req: PredictRequest):
    city = req.city
    city_df = df[df["city"] == city].sort_values("Date")

    if len(city_df) < WINDOW:
        raise HTTPException(status_code=400, detail="Not enough data for prediction.")

    input_data = city_df.tail(WINDOW)[FEATURES].values
    input_scaled = scaler.transform(input_data)

    aqi_mean = float(scaler.mean_[0])
    aqi_std = float(scaler.scale_[0])

    # =========================
    # LSTM
    # =========================
    predictions_lstm = []
    current_window = input_scaled.copy()

    for _ in range(5):
        reshaped = current_window.reshape(1, WINDOW, len(FEATURES))
        pred_scaled = float(lstm_model.predict(reshaped, verbose=0)[0][0])
        pred_aqi = (pred_scaled * aqi_std) + aqi_mean
        predictions_lstm.append(float(pred_aqi))

        new_row = current_window[-1].copy()
        new_row[0] = pred_scaled  # type: ignore
        current_window = np.vstack([current_window[1:], new_row])

    lstm_aqi = float(predictions_lstm[-1])
    lstm_category = categorize_aqi(lstm_aqi)

    # =========================
    # GRU
    # =========================
    predictions_gru = []
    current_window = input_scaled.copy()

    for _ in range(5):
        reshaped = current_window.reshape(1, WINDOW, len(FEATURES))
        pred_scaled = float(gru_model.predict(reshaped, verbose=0)[0][0])
        pred_aqi = (pred_scaled * aqi_std) + aqi_mean
        predictions_gru.append(float(pred_aqi))

        new_row = current_window[-1].copy()
        new_row[0] = pred_scaled  # type: ignore
        current_window = np.vstack([current_window[1:], new_row])

    gru_aqi = float(predictions_gru[-1])
    gru_category = categorize_aqi(gru_aqi)

    # =========================
    # TREE MODELS
    # =========================
    latest = city_df.tail(1).copy()
    latest["Month"] = latest["Date"].dt.month
    latest["DayOfWeek"] = latest["Date"].dt.dayofweek

    latest_input = latest[["city", "PM2.5", "PM10", "NO2", "NH3", "CO", "SO2", "O3", "Month", "DayOfWeek"]]
    
    # One-hot encode city consistently by forcing categories
    latest_input["city"] = pd.Categorical(latest_input["city"], categories=unique_cities)
    latest_input = pd.get_dummies(latest_input, columns=["city"])

    for col in feature_columns:
        if col not in latest_input.columns:
            latest_input[col] = 0

    latest_input = latest_input[feature_columns]

    rf_aqi = float(rf_model.predict(latest_input)[0])
    rf_category = categorize_aqi(rf_aqi)

    xgb_aqi = float(xgb_model.predict(latest_input)[0])
    xgb_category = categorize_aqi(xgb_aqi)

    lin_input = tree_scaler.transform(latest_input)
    lin_aqi = float(lin_model.predict(lin_input)[0])
    lin_category = categorize_aqi(lin_aqi)

    svm_aqi = float(svm_model.predict(lin_input)[0])
    svm_category = categorize_aqi(svm_aqi)

    card_color = get_color(rf_category)
    current_actual_aqi = float(city_df.tail(1)["AQI"].values[0])
    trend = "Rising" if rf_aqi > current_actual_aqi else "Falling"

    # =========================
    # HEALTH ANALYSIS
    # =========================
    latest_pollutants = city_df.tail(1)[FEATURES].iloc[0]
    
    # Calculate dominant pollutant (excluding AQI)
    pollutants_only = latest_pollutants[1:].astype(float)
    dominant_pollutant = str(pollutants_only.idxmax())

    identified_risks = []
    dangerous_pollutants = []

    for pollutant, value in latest_pollutants.items():
        if pollutant in pollutant_thresholds and value > pollutant_thresholds[str(pollutant)]: # type: ignore
            val = float(value)
            dangerous_pollutants.append({
                "pollutant": pollutant,
                "level": round(val, 2)
            })
            identified_risks.extend(pollutant_disease_risks[pollutant])

    return {
        "kpis": {
            "predictedAqi": round(float(rf_aqi), 2),
            "category": rf_category,
            "trend": trend,
            "dominantPollutant": dominant_pollutant,
            "color": card_color
        },
        "trends": {
            "days": [1, 2, 3, 4, 5],
            "lstm": predictions_lstm,
            "gru": predictions_gru,
            "rf": [rf_aqi] * 5,
            "xgb": [xgb_aqi] * 5,
            "lin": [lin_aqi] * 5,
            "svm": [svm_aqi] * 5
        },
        "comparison": [
            {"model": "LSTM", "predictedAqi": round(float(lstm_aqi), 2), "category": lstm_category, "mse": model_metrics["LSTM"]["mse"], "r2": model_metrics["LSTM"]["r2"]},
            {"model": "GRU", "predictedAqi": round(float(gru_aqi), 2), "category": gru_category, "mse": model_metrics["GRU"]["mse"], "r2": model_metrics["GRU"]["r2"]},
            {"model": "Random Forest", "predictedAqi": round(float(rf_aqi), 2), "category": rf_category, "mse": model_metrics["Random Forest"]["mse"], "r2": model_metrics["Random Forest"]["r2"]},
            {"model": "XGBoost", "predictedAqi": round(float(xgb_aqi), 2), "category": xgb_category, "mse": model_metrics["XGBoost"]["mse"], "r2": model_metrics["XGBoost"]["r2"]},
            {"model": "Linear Regression", "predictedAqi": round(float(lin_aqi), 2), "category": lin_category, "mse": model_metrics["Linear Regression"]["mse"], "r2": model_metrics["Linear Regression"]["r2"]},
            {"model": "SVM", "predictedAqi": round(float(svm_aqi), 2), "category": svm_category, "mse": model_metrics["SVM"]["mse"], "r2": model_metrics["SVM"]["r2"]}
        ],
        "healthAnalysis": {
            "dangerousPollutants": dangerous_pollutants,
            "identifiedRisks": list(set(identified_risks))
        }
    }
