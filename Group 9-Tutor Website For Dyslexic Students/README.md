FOR NABAMI


Project Structurefrontend/: React.js application for the user 
interface.backend/: Django/Python API handling logic and machine learning models.
.gitignore: Configured to ignore local environments (ml_env/), node modules, and system files.

First-Time SetupFollow these steps to get the project running locally on your machine.
backend
  1. Prerequisites =Ensure you have the following installed:Python 3.8+Node.js & npm
  2.  Backend Installation= Navigate to the backend directory:cd backend
  3. Create a new virtual environment (since the original ml_env is ignored):python -m venv venv
   4. Activate the environment :Windows: venv\Scripts\activate Mac/Linux: source venv/bin/activateInstall
             dependencies:pip install -r requirements.txt
   5. Run the server:python manage.py runserver
frontend
3. Frontend InstallationOpen a new terminal and navigate to the frontend directory:cd frontend
Install the necessary packages:npm install
Launch the development server:npm start


🔄 Development Workflow : How to Push Your Changes
When you make updates to the code on your laptop and want to save them to GitHub: 
  Check your status:git status
  Add changes:git add .
  Commit with a descriptive message:git commit -m "Describe what you changed"
  Push to GitHub:git push origin main
  
How to Sync with the Latest Version
 If changes were made by another user (or from another computer), use these commands to get the latest updates:  Pull the code: =   git pull origin main
 
Update libraries:
For Backend: pip install -r backend/requirements.txt
For Frontend: npm install (inside the frontend folder)

⚠️ Important NotesEnvironment Variables: Do not push .env files. Use a .env.example template if your project requires API keys.
Requirements: If you install new Python libraries, always update the requirements list using:pip freeze > backend/requirements.txt
📝 License {This project is for educational/tutoring purposes.}
all the best
