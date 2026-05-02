import React from "react";
import { Theme } from "./Theme";
import { useLevelProgress } from "./LevelProgressContext";

const Level2Dashboard = ({ user, onSelectSubject, onBackToLevel1, activeTheme }) => {
  const { progress, getStarsForLevel } = useLevelProgress();

  // Subject configuration for Level 2 - Evolution of icons
  const subjectData = [
    { name: "Science", icon: "🧬", color: "#9b59b6" },
    { name: "Math", icon: "📐", color: "#3498db" },
    { name: "English", icon: "✍️", color: "#e67e22" }
  ];

  // 🕵️ Step 1: Use the global star counter!
  const rawStars = getStarsForLevel(2);

  // 🕵️ Step 2: Set the goal and cap the display
  const goal = 15;

  // This makes sure the screen shows "15/15" even if rawStars is 16!
  const displayStars = Math.min(rawStars, goal);

  const percent = Math.min(Math.round((displayStars / goal) * 100), 100);

  // Level 3 unlocks when you actually hit the goal
  const isLevel3Unlocked = rawStars >= goal;

  return (
    <div style={{ padding: "40px", backgroundColor: activeTheme.background, minHeight: "100vh", fontFamily: Theme.fontFamily }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* PERSONALIZED HEADER WITH AVATAR */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "30px",
          backgroundColor: "white",
          padding: "20px 30px",
          borderRadius: activeTheme.borderRadius,
          boxShadow: activeTheme.cardShadow,
          borderLeft: `10px solid #9b59b6` // Distinct Level 2 color
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              fontSize: "60px",
              backgroundColor: "#f1f5f9",
              width: "100px", height: "100px",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "50%"
            }}>
              {user.avatar || "🦊"}
            </div>
            <div>
              <h1 style={{ color: activeTheme.textMain, margin: 0, fontSize: "32px" }}>Keep it up, {user.username}!</h1>
              <p style={{ color: Theme.textMuted, margin: "5px 0 0 0", fontSize: "20px" }}>Intermediate · Level 2</p>
            </div>
          </div>

          <button
            onClick={onBackToLevel1}
            style={{
              padding: "12px 24px", borderRadius: "12px", border: `2px solid ${Theme.sidebar}`,
              background: "white", color: Theme.sidebar, fontWeight: "bold", cursor: "pointer"
            }}
          >
            ← Level 1
          </button>
        </div>

        {/* PROGRESS CARD (UNLOCKS LEVEL 3) */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: Theme.borderRadius, boxShadow: Theme.cardShadow, marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "20px", fontWeight: "bold" }}>
            <span style={{ color: Theme.textMain }}>{isLevel3Unlocked ? "Level 3 Access Granted!" : "Level 3 Unlock Progress"}</span>
            <span style={{ color: "#9b59b6" }}>{displayStars} / {goal} Stars</span>
          </div>
          <div style={{ width: "100%", height: "24px", backgroundColor: "#f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", backgroundColor: "#9b59b6", transition: "width 1s ease-out" }} />
          </div>
        </div>

        {/* SUBJECT CARDS */}
        <div style={{ display: "flex", gap: "25px", marginBottom: "40px" }}>
          {subjectData.map(sub => (
            <button key={sub.name} onClick={() => onSelectSubject(sub.name)}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "45px 20px",
                borderRadius: Theme.borderRadius, border: "none", backgroundColor: "white",
                boxShadow: Theme.cardShadow, borderBottom: `10px solid ${sub.color}`, cursor: "pointer", transition: "0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <span style={{ fontSize: "75px", marginBottom: "15px" }}>{sub.icon}</span>
              <span style={{ fontSize: "26px", fontWeight: "bold", color: Theme.textMain }}>{sub.name}</span>
            </button>
          ))}
        </div>

        {/* CONGRATS FOR LEVEL 3 */}
        {isLevel3Unlocked ? (
          <div style={{
            textAlign: "center", padding: "35px", backgroundColor: "#E0F2FE",
            borderRadius: Theme.borderRadius, border: `3px solid ${Theme.accent}`, boxShadow: Theme.cardShadow
          }}>
            <h2 style={{ color: "#0369a1", margin: 0, fontSize: "30px" }}>🏆 Level 3 Unlocked!</h2>
            <p style={{ color: "#0c4a6e", marginTop: "12px", fontSize: "19px" }}>
              You are officially an Advanced Learner! Check the sidebar for Level 3.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: Theme.textMuted, fontSize: "18px", background: "white", padding: "15px", borderRadius: "12px" }}>
            Complete Level 2 topics to reach the Advanced stage!
          </div>
        )}

      </div>
    </div>
  );
};

export default Level2Dashboard;