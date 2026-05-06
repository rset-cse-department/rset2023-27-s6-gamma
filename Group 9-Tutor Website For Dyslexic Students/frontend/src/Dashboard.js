import React from "react";
import { Theme } from "./Theme";
import { useLevelProgress } from "./LevelProgressContext";

const Dashboard = ({ user, onSelectSubject, activeTheme }) => {
  const { progress, isLevel2Unlocked, getStarsForLevel } = useLevelProgress();

  const subjects = [
    { name: "Science", icon: "🔬", color: "#9b59b6" },
    { name: "Math", icon: "📐", color: "#3498db" },
    { name: "English", icon: "📚", color: "#e67e22" }
  ];

  // 🕵️ Step 1: Use the global star counter!
  const rawStars = getStarsForLevel(1);

  // 🕵️ Step 2: Set the goal based on the Level
  // For Level 1, 2, and 3, the goal is 15. For Level 4, it is 20.
  const currentLevelName = user.level || "Level 1";
  const goal = currentLevelName.includes("Level 4") ? 20 : 15;

  // 🕵️ Step 3: Cap the stars so it doesn't show "16/15"
  // Math.min picks the smaller number, so it stops exactly at the goal!
  const displayStars = Math.min(rawStars, goal);

  // Calculate the percentage for the green/blue bar
  const percent = Math.min(Math.round((displayStars / goal) * 100), 100);
  const unlocked = isLevel2Unlocked();

  return (
    <div style={{ padding: "40px", backgroundColor: activeTheme.background, minHeight: "100vh", fontFamily: activeTheme.fontFamily }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* PERSONALIZED HEADER */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
          backgroundColor: "white",
          padding: "20px 30px",
          borderRadius: Theme.borderRadius,
          boxShadow: Theme.cardShadow,
          borderLeft: `10px solid ${Theme.accent}`
        }}>
          <div style={{
            fontSize: "60px",
            backgroundColor: "#f1f5f9",
            width: "100px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
          }}>
            {user.avatar || "🦊"}
          </div>
          <div>
            <h1 style={{ color: Theme.textMain, margin: 0, fontSize: "32px" }}>Welcome, {user.username}!</h1>
            <p style={{ color: Theme.textMuted, margin: "5px 0 0 0", fontSize: "20px" }}>Foundations · {currentLevelName}</p>
          </div>
        </div>

        {/* --- PROGRESS BAR --- */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: Theme.borderRadius, boxShadow: Theme.cardShadow, marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontWeight: "bold", fontSize: "20px" }}>
            <span style={{ color: Theme.textMain }}>{unlocked ? "Level 2 Unlock progress" : "Level 2 Unlock Progress"}</span>
            <span style={{ color: Theme.accent }}>{displayStars} / {goal} Stars</span>
          </div>
          <div style={{ position: "relative", width: "100%", height: "24px", backgroundColor: "#eee", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", backgroundColor: Theme.accent, transition: "width 1s ease-out" }} />
          </div>
        </div>

        {/* --- SUBJECT CARDS --- */}
        <div style={{ display: "flex", gap: "25px", marginBottom: "40px" }}>
          {subjects.map(sub => (
            <button
              key={sub.name}
              onClick={() => onSelectSubject(sub.name)}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px",
                borderRadius: Theme.borderRadius, border: "none", backgroundColor: "white",
                boxShadow: Theme.cardShadow, borderBottom: `8px solid ${sub.color}`, cursor: "pointer", transition: "0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <span style={{ fontSize: "70px", marginBottom: "15px" }}>{sub.icon}</span>
              <span style={{ fontSize: "24px", fontWeight: "bold", color: Theme.textMain }}>{sub.name}</span>
            </button>
          ))}
        </div>

        {/* --- CONGRATS MESSAGE --- */}
        {unlocked ? (
          <div style={{
            textAlign: "center",
            padding: "30px",
            backgroundColor: "#d1fae5",
            borderRadius: Theme.borderRadius,
            border: `3px solid ${Theme.success}`,
            boxShadow: Theme.cardShadow
          }}>
            <h2 style={{ color: "#065f46", margin: 0, fontSize: "28px" }}>
              🎉 Level 2 Unlocked!
            </h2>
            <p style={{ color: "#065f46", marginTop: "10px", fontSize: "18px", fontWeight: "500" }}>
              Fantastic! You have mastered the foundations. Level 2 is now available in your sidebar.
            </p>
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            color: Theme.textMuted,
            fontSize: "18px",
            backgroundColor: "rgba(255,255,255,0.5)",
            padding: "15px",
            borderRadius: "12px"
          }}>
            Keep earning stars to unlock the next level!
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;