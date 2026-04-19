"""
train_models.py
Retrains all 6 models (LSTM, GRU, RF, XGBoost, Linear Regression, SVM)
with proper 80/20 train/test splits and improved architectures.
Saves retrained models + test-set metrics to models/metrics.json.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, r2_score
import xgboost as xgb
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, GRU, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# ========== CONFIG ==========
FEATURES = ["AQI", "PM2.5", "PM10", "NO2", "SO2", "CO", "O3", "NH3"]
WINDOW = 7
SPLIT_RATIO = 0.8
EPOCHS = 100
BATCH_SIZE = 32

# ========== LOAD DATA ==========
print("Loading data...")
df = pd.read_csv("dataset_clean1.csv")
df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values("Date")
df = df[["city", "Date"] + FEATURES]
df = df.fillna(df.mean(numeric_only=True))

unique_cities = sorted(df["city"].unique().tolist())
print(f"Found {len(unique_cities)} cities, {len(df)} total rows")

# ========== SPLIT DATA ==========
# Time-based split: first 80% for train, last 20% for test (per city)
train_frames = []
test_frames = []

for city in unique_cities:
    city_df = df[df["city"] == city].sort_values("Date")
    split_idx = int(len(city_df) * SPLIT_RATIO)
    train_frames.append(city_df.iloc[:split_idx])
    test_frames.append(city_df.iloc[split_idx:])

train_df = pd.concat(train_frames).reset_index(drop=True)
test_df = pd.concat(test_frames).reset_index(drop=True)
print(f"Train: {len(train_df)} rows, Test: {len(test_df)} rows")

# ========== FIT SCALER ON TRAIN DATA ==========
scaler = StandardScaler()
scaler.fit(train_df[FEATURES])
joblib.dump(scaler, "aqi_scaler.pkl")
print("Scaler fitted and saved.")

# ==========================================================
# TREE / LINEAR / SVM MODELS
# ==========================================================
def prepare_tree_features(data_df):
    """Prepare features for tree-based/linear/SVM models."""
    prep = data_df.copy()
    prep["Month"] = prep["Date"].dt.month
    prep["DayOfWeek"] = prep["Date"].dt.dayofweek
    X = prep[["city", "PM2.5", "PM10", "NO2", "NH3", "CO", "SO2", "O3", "Month", "DayOfWeek"]]
    X["city"] = pd.Categorical(X["city"], categories=unique_cities)
    X = pd.get_dummies(X, columns=["city"])
    y = prep["AQI"].values
    return X, y

print("\nPreparing tree model features...")
X_train_tree, y_train_tree = prepare_tree_features(train_df)
X_test_tree, y_test_tree = prepare_tree_features(test_df)

# Align columns
feature_columns = X_train_tree.columns.tolist()
for col in feature_columns:
    if col not in X_test_tree.columns:
        X_test_tree[col] = 0
X_test_tree = X_test_tree[feature_columns]

joblib.dump(feature_columns, "feature_columns.pkl")

metrics = {}

# ----- Random Forest -----
print("\nTraining Random Forest...")
rf = RandomForestRegressor(n_estimators=300, max_depth=20, min_samples_split=2, random_state=42, n_jobs=-1)
rf.fit(X_train_tree, y_train_tree)
rf_pred = rf.predict(X_test_tree)
rf_mse = float(mean_squared_error(y_test_tree, rf_pred))
rf_r2 = float(r2_score(y_test_tree, rf_pred))
print(f"  RF  -> MSE: {rf_mse:.2f}, R²: {rf_r2:.4f}")
joblib.dump(rf, "models/rf_model.pkl")
metrics["Random Forest"] = {"mse": round(rf_mse, 2), "r2": round(rf_r2, 4)}

# ----- XGBoost -----
print("Training XGBoost...")
xgb_model = xgb.XGBRegressor(n_estimators=150, max_depth=6, learning_rate=0.05, subsample=0.8, random_state=42, n_jobs=-1)
xgb_model.fit(X_train_tree, y_train_tree)
xgb_pred = xgb_model.predict(X_test_tree)
xgb_mse = float(mean_squared_error(y_test_tree, xgb_pred))
xgb_r2 = float(r2_score(y_test_tree, xgb_pred))
print(f"  XGB -> MSE: {xgb_mse:.2f}, R²: {xgb_r2:.4f}")
joblib.dump(xgb_model, "models/xgb_model.pkl")
metrics["XGBoost"] = {"mse": round(xgb_mse, 2), "r2": round(xgb_r2, 4)}

# ----- Linear Regression (Ridge) -----
print("Training Linear Regression (Ridge)...")
# Scale features for linear model
tree_scaler = StandardScaler()
X_train_lin = tree_scaler.fit_transform(X_train_tree)
X_test_lin = tree_scaler.transform(X_test_tree)
joblib.dump(tree_scaler, "tree_scaler.pkl")

lin = Ridge(alpha=1.0)
lin.fit(X_train_lin, y_train_tree)
lin_pred = lin.predict(X_test_lin)
lin_mse = float(mean_squared_error(y_test_tree, lin_pred))
lin_r2 = float(r2_score(y_test_tree, lin_pred))
print(f"  LIN -> MSE: {lin_mse:.2f}, R²: {lin_r2:.4f}")
joblib.dump(lin, "models/linear_model.pkl")
metrics["Linear Regression"] = {"mse": round(lin_mse, 2), "r2": round(lin_r2, 4)}

# ----- SVM (SVR) -----
print("Training SVM (SVR)...")
svr = SVR(kernel="rbf", C=100, gamma="scale", epsilon=0.1)
svr.fit(X_train_lin, y_train_tree)  # Use scaled features
svr_pred = svr.predict(X_test_lin)
svr_mse = float(mean_squared_error(y_test_tree, svr_pred))
svr_r2 = float(r2_score(y_test_tree, svr_pred))
print(f"  SVM -> MSE: {svr_mse:.2f}, R²: {svr_r2:.4f}")
joblib.dump(svr, "models/svm_model.pkl")
metrics["SVM"] = {"mse": round(svr_mse, 2), "r2": round(svr_r2, 4)}

# ==========================================================
# SEQUENCE MODELS (LSTM, GRU)
# ==========================================================
def create_sequences(data_df, scaler):
    """Create sliding window sequences for LSTM/GRU from all cities."""
    X_all, y_all = [], []
    for city in unique_cities:
        city_data = data_df[data_df["city"] == city].sort_values("Date")
        if len(city_data) <= WINDOW:
            continue
        values = city_data[FEATURES].values
        scaled = scaler.transform(values)
        for i in range(WINDOW, len(scaled)):
            X_all.append(scaled[i - WINDOW:i])
            y_all.append(scaled[i][0])  # AQI is index 0
    return np.array(X_all), np.array(y_all)

print("\nCreating sequences for LSTM/GRU...")
X_train_seq, y_train_seq = create_sequences(train_df, scaler)
X_test_seq, y_test_seq = create_sequences(test_df, scaler)
print(f"  Train sequences: {X_train_seq.shape}, Test sequences: {X_test_seq.shape}")

early_stop = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)

# ----- LSTM -----
print("\nTraining LSTM...")
lstm = Sequential([
    LSTM(128, return_sequences=True, input_shape=(WINDOW, len(FEATURES))),
    Dropout(0.2),
    LSTM(64),
    Dropout(0.2),
    Dense(32, activation="relu"),
    Dense(1)
])
lstm.compile(optimizer="adam", loss="mse")
lstm.fit(X_train_seq, y_train_seq, epochs=EPOCHS, batch_size=BATCH_SIZE,
         validation_split=0.1, callbacks=[early_stop], verbose=1)

lstm_pred_scaled = lstm.predict(X_test_seq, verbose=0).flatten()
aqi_mean = scaler.mean_[0]
aqi_std = scaler.scale_[0]
lstm_pred = (lstm_pred_scaled * aqi_std) + aqi_mean
lstm_actual = (y_test_seq * aqi_std) + aqi_mean

lstm_mse = float(mean_squared_error(lstm_actual, lstm_pred))
lstm_r2 = float(r2_score(lstm_actual, lstm_pred))
print(f"  LSTM -> MSE: {lstm_mse:.2f}, R²: {lstm_r2:.4f}")
lstm.save("models/lstm_model.keras")
metrics["LSTM"] = {"mse": round(lstm_mse, 2), "r2": round(lstm_r2, 4)}

# ----- GRU -----
print("\nTraining GRU...")
gru = Sequential([
    GRU(128, return_sequences=True, input_shape=(WINDOW, len(FEATURES))),
    Dropout(0.2),
    GRU(64),
    Dropout(0.2),
    Dense(32, activation="relu"),
    Dense(1)
])
gru.compile(optimizer="adam", loss="mse")
gru.fit(X_train_seq, y_train_seq, epochs=EPOCHS, batch_size=BATCH_SIZE,
        validation_split=0.1, callbacks=[early_stop], verbose=1)

gru_pred_scaled = gru.predict(X_test_seq, verbose=0).flatten()
gru_pred = (gru_pred_scaled * aqi_std) + aqi_mean
gru_actual = (y_test_seq * aqi_std) + aqi_mean

gru_mse = float(mean_squared_error(gru_actual, gru_pred))
gru_r2 = float(r2_score(gru_actual, gru_pred))
print(f"  GRU  -> MSE: {gru_mse:.2f}, R²: {gru_r2:.4f}")
gru.save("models/gru_model.keras")
metrics["GRU"] = {"mse": round(gru_mse, 2), "r2": round(gru_r2, 4)}

# ========== SAVE METRICS ==========
with open("models/metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

print("\n" + "=" * 50)
print("ALL MODELS TRAINED SUCCESSFULLY!")
print("=" * 50)
print("\nTest-set metrics saved to models/metrics.json:")
for model_name, m in metrics.items():
    print(f"  {model_name:20s} -> MSE: {m['mse']:8.2f}, R²: {m['r2']:.4f}")
