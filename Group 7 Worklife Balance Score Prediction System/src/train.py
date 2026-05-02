import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


def train_model(data_path=r"C:\Users\HP\Desktop\React\wlb-ai-analyzer-main-ollama-revised\wlb-ai-analyzer-main-ollama--master\wlb-ai-analyzer-main\wlb-ai-analyzer-main\data\Wellbeing_and_lifestyle_data_Kaggle.csv"):

    df = pd.read_csv(data_path)

    # REMOVE TIMESTAMP COLUMN
    if "Timestamp" in df.columns:
        df.drop(columns=["Timestamp"], inplace=True)

    encoders = {}

    for col in df.columns:
        if df[col].dtype == 'object':
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le

    q1 = df["WORK_LIFE_BALANCE_SCORE"].quantile(0.25)
    q2 = df["WORK_LIFE_BALANCE_SCORE"].quantile(0.5)
    q3 = df["WORK_LIFE_BALANCE_SCORE"].quantile(0.75)

    print(f"Quartiles → Q1: {q1}, Q2: {q2}, Q3: {q3}")

    def label_score(x):
        if x < q1:
            return 0  # Bad
        elif x < q2:
            return 1  # Average
        elif x < q3:
            return 2  # Good
        else:
            return 3  # Excellent

    df["TARGET"] = df["WORK_LIFE_BALANCE_SCORE"].apply(label_score)

    # Drop original score
    df.drop("WORK_LIFE_BALANCE_SCORE", axis=1, inplace=True)

    X = df.drop("TARGET", axis=1)
    y = df["TARGET"]

    print("\nClass Distribution:")
    print(y.value_counts())

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.30,
        random_state=42,
        stratify=y
    )

    param_grid = {
        "n_estimators": [200, 300, 500],
        "max_depth": [10, 20, None],
        "min_samples_split": [2, 5],
        "min_samples_leaf": [1, 2],
        "max_features": ["sqrt", "log2"]
    }

    grid = GridSearchCV(
        RandomForestClassifier(
            random_state=42,
            class_weight="balanced",
            n_jobs=-1
        ),
        param_grid,
        cv=5,
        n_jobs=-1,
        verbose=1
    )

    print("\nTraining with GridSearch...")
    grid.fit(X_train, y_train)

    model = grid.best_estimator_

    print("\nBest Parameters:")
    print(grid.best_params_)

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    print("\nFeature Importance:")
    importance = model.feature_importances_
    features = X.columns

    imp_df = pd.DataFrame({
        "feature": features,
        "importance": importance
    }).sort_values(by="importance", ascending=False)

    print(imp_df)

    joblib.dump(model, "model.pkl")
    joblib.dump(encoders, "encoders.pkl")
    joblib.dump(X.columns.tolist(), "backend/columns.pkl")

    print("\nModel trained and saved successfully!")


# Run training
if __name__ == "__main__":
    train_model()