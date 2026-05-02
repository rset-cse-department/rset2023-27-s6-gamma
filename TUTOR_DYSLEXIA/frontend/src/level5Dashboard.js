import React from "react";
import { Theme } from "./Theme";
import { useLevelProgress } from "./LevelProgressContext";

const Level5Dashboard = ({ user, onSelectSubject, onBackToLevel4, activeTheme }) => {
  const { progress } = useLevelProgress();

  // 🎨 Step 1: New colors and icons for the final level!
  const subjectData = [
    { name: "Science", icon: "🌊", color: "#2ecc71" }, // Green for Water Cycle
    { name: "Math", icon: "🍕", color: "#f1c40f" },    // Yellow for Fractions
    { name: "English", icon: "🦁", color: "#e74c3c" },  // Red for Metaphors
    { name: "GK", icon: "🧱", color: "#95a5a6" }       // Grey for Great Wall
  ];

  // 🕵️ Step 2: Calculate Stars for Level 5
  const totalStars = subjectData.reduce((acc, sub) => {
    const subjectProgress = progress[sub.name] || {};

    // We look for IDs starting with 'l5' now!
    const level5Scores = Object.entries(subjectProgress).filter(([quizId, score]) =>
      quizId.startsWith("l5") && score >= 7
    );

    return acc + level5Scores.length;
  }, 0);

  const goal = 20; // Maybe a smaller goal for the final push!
  const displayStars = Math.min(totalStars, goal);
  const percent = Math.min(Math.round((displayStars / goal) * 100), 100);

  const isAllComplete = totalStars >= goal;

  return (
    <div style={{ padding: "40px", backgroundColor: activeTheme.background, minHeight: "100vh", fontFamily: Theme.fontFamily }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "30px",
          backgroundColor: "white",
          padding: "20px 30px",
          borderRadius: activeTheme.borderRadius,
          boxShadow: Theme.cardShadow,
          borderLeft: `10px solid #FFD700` // Gold for Level 5
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              fontSize: "60px",
              backgroundColor: "#f1f5f9",
              width: "100px", height: "100px",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "50%"
            }}>
              {user.avatar || "🏆"}
            </div>
            <div>
              <h1 style={{ color: activeTheme.textMain, margin: 0, fontSize: "32px" }}>The Ultimate Explorer, {user.username}!</h1>
              <p style={{ color: Theme.textMuted, margin: "5px 0 0 0", fontSize: "20px" }}>Grandmaster · Level 5</p>
            </div>
          </div>

          <button
            onClick={onBackToLevel4}
            style={{
              padding: "12px 24px", borderRadius: "12px", border: `2px solid ${Theme.sidebar}`,
              background: "white", color: Theme.sidebar, fontWeight: "bold", cursor: "pointer"
            }}
          >
            ← Level 4
          </button>
        </div>

        {/* PROGRESS CARD */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: activeTheme.borderRadius, boxShadow: activeTheme.cardShadow, marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "20px", fontWeight: "bold" }}>
            <span style={{ color: activeTheme.textMain }}>Final Mastery Progress</span>
            <span style={{ color: "#FFD700" }}>{displayStars} / {goal} Stars</span>
          </div>
          <div style={{ width: "100%", height: "24px", backgroundColor: "#f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", backgroundColor: "#FFD700", transition: "width 1s ease-out" }} />
          </div>
        </div>

        {/* SUBJECT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px", marginBottom: "40px" }}>
          {subjectData.map(sub => (
            <button key={sub.name} onClick={() => onSelectSubject(sub.name)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px",
                borderRadius: activeTheme.borderRadius, border: "none", backgroundColor: "white",
                boxShadow: activeTheme.cardShadow, borderBottom: `10px solid ${sub.color}`, cursor: "pointer", transition: "0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
              <span style={{ fontSize: "60px", marginBottom: "10px" }}>{sub.icon}</span>
              <span style={{ fontSize: "22px", fontWeight: "bold", color: activeTheme.textMain }}>{sub.name}</span>
            </button>
          ))}
        </div>

        {/* FINAL COMPLETION MESSAGE */}
        {isAllComplete && (
          <div style={{
            textAlign: "center", padding: "35px", backgroundColor: "#dcfce7",
            borderRadius: activeTheme.borderRadius, border: `3px solid #22c55e`, boxShadow: activeTheme.cardShadow
          }}>
            <h2 style={{ color: "#166534", margin: 0, fontSize: "30px" }}>🎉 You've Completed Everything!</h2>
            <p style={{ color: "#166534", marginTop: "12px", fontSize: "19px" }}>
              You are officially a Master Learner. You've conquered all 5 levels!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level5Dashboard;