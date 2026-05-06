// Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLevelProgress } from "./LevelProgressContext";
import "./Dashboard.css"; // your CSS file

const subjects = [
  { id: 1, name: "English" },
  { id: 2, name: "Math" },
  { id: 3, name: "Science" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLevel2Unlocked } = useLevelProgress();

  const handleSubjectClick = (subject) => {
    // Example: subject 2 or 3 = Level 2
    if (subject.id > 1 && !isLevel2Unlocked()) {
      alert("You must complete Level 1 quizzes (score ≥7/10) to unlock this subject!");
      return;
    }
    navigate(`/chapters/${subject.id}`);
  };

  return (
    <div className="dashboard">
      <h1>Choose a Subject</h1>
      <div className="subjects-grid">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className={`subject-card ${sub.id > 1 && !isLevel2Unlocked() ? "locked" : ""}`}
            onClick={() => handleSubjectClick(sub)}
          >
            <h2>{sub.name}</h2>
            {sub.id > 1 && !isLevel2Unlocked() && <p>Locked 🔒</p>}
            {sub.id === 1 || isLevel2Unlocked() ? <p>Start Learning →</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;