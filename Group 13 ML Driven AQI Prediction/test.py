import pandas as pd
import joblib
from tensorflow.keras.models import load_model
import numpy as np
import json

df = pd.read_csv("dataset_clean1.csv")
df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values("Date")
FEATURES = ["AQI", "PM2.5", "PM10", "NO2", "SO2", "CO", "O3", "NH3"]
WINDOW = 7

# Impute identically to app.py
df = df[["city", "Date"] + FEATURES]
df = df.fillna(df.mean(numeric_only=True))

city_df = df[df["city"] == "Amaravati"].sort_values("Date")
scaler = joblib.load("aqi_scaler.pkl")
lstm_model = load_model("models/lstm_model.keras", compile=False)

input_data = city_df.tail(WINDOW)[FEATURES].values
input_scaled = scaler.transform(input_data)
current_window = input_scaled.copy()

predictions = []
aqi_mean = scaler.mean_[0]
aqi_std = scaler.scale_[0]

for _ in range(5):
    reshaped = current_window.reshape(1, 7, 8)
    pred_scaled = lstm_model.predict(reshaped, verbose=0)[0][0]
    pred_aqi = (pred_scaled * aqi_std) + aqi_mean
    predictions.append(float(pred_aqi))
    new_row = current_window[-1].copy()
    new_row[0] = pred_scaled
    current_window = np.vstack([current_window[1:], new_row])

print("TEST LSTM PREDICTIONS:", predictions)
