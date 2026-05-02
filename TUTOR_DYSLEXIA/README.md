# Tutor Dyslexia - Learning Assistant

An educational platform designed to assist tutors and students in managing and addressing dyslexia through interactive lessons and progress tracking.

---

## 📂 Project Structure

- **`frontend/`**: React.js application providing the student/tutor user interface.
- **`backend/`**: Django-based API handling logic, database operations, and machine learning models.
- **`.gitignore`**: Configured to exclude virtual environments (`venv/`), `node_modules`, and system files.

---

## 🚀 First-Time Setup

Ensure you have **Python 3.8+** and **Node.js (LTS)** installed on your machine.

### 🐍 Backend Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```
3.  **Activate the environment:**
    -   **Windows:** `venv\Scripts\activate`
    -   **Mac/Linux:** `source venv/bin/activate`
4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```

### ⚛️ Frontend Installation

1.  **Open a new terminal and navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Launch the development server:**
    ```bash
    npm start
    ```

---

## 🔄 Development Workflow

### How to Save Your Changes
1.  **Check status:** `git status`
2.  **Stage changes:** `git add .`
3.  **Commit:** `git commit -m "Brief description of your changes"`
4.  **Push:** `git push origin main`

### How to Stay Updated
1.  **Pull latest code:** `git pull origin main`
2.  **Update libraries:**
    -   **Backend:** `pip install -r backend/requirements.txt`
    -   **Frontend:** `npm install` (inside the `frontend` folder)

---

## ⚠️ Important Notes

-   **Environment Variables:** Do not push `.env` files. Use a `.env.example` template for API keys.
-   **Dependencies:** When installing new Python libraries, update the requirements:
    ```bash
    pip freeze > backend/requirements.txt
    ```

---

## 📝 License
This project is for educational purposes.

*All the best with your development!* 🚀
