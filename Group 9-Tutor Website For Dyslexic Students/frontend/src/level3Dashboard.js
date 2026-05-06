import React from "react";
import { Theme } from "./Theme";
import { useLevelProgress } from "./LevelProgressContext";

const Level3Dashboard = ({ user, onSelectSubject, onBackToLevel2, activeTheme }) => {
  const { progress, getStarsForLevel } = useLevelProgress();

  // Subject configuration for Level 3 - Advanced Icons
  const subjectData = [
    { name: "Science", icon: "🚀", color: "#9b59b6" },
    { name: "Math", icon: "🧮", color: "#3498db" },
    { name: "English", icon: "📖", color: "#e67e22" }
  ];

  // 🕵️ Step 1: Use the global star counter!
  const totalStars = getStarsForLevel(3);

  // 🕵️ Step 2: Now these lines will work perfectly!
  const goal = 15;
  const displayStars = Math.min(totalStars, goal);
  const percent = Math.min(Math.round((displayStars / goal) * 100), 100);

  // 🕵️ Step 3: Check for unlock
  const isLevel4Unlocked = totalStars >= goal;

  return (
    <div style={{ padding: "40px", backgroundColor: activeTheme.background, minHeight: "100vh", fontFamily: activeTheme.fontFamily }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* PERSONALIZED HEADER */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "30px",
          backgroundColor: "white",
          padding: "20px 30px",
          borderRadius: activeTheme.borderRadius,
          boxShadow: activeTheme.cardShadow,
          borderLeft: `10px solid #e67e22` // Orange for Level 3
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
              <h1 style={{ color: activeTheme.textMain, margin: 0, fontSize: "32px" }}>You're a Pro, {user.username}!</h1>
              <p style={{ color: activeTheme.textMuted, margin: "5px 0 0 0", fontSize: "20px" }}>Advanced · Level 3</p>
            </div>
          </div>

          <button
            onClick={onBackToLevel2}
            style={{
              padding: "12px 24px", borderRadius: "12px", border: `2px solid ${activeTheme.sidebar}`,
              background: "white", color: activeTheme.sidebar, fontWeight: "bold", cursor: "pointer"
            }}
          >
            ← Level 2
          </button>
        </div>

        {/* PROGRESS CARD (UNLOCKS LEVEL 4) */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: activeTheme.borderRadius, boxShadow: activeTheme.cardShadow, marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "20px", fontWeight: "bold" }}>
            <span style={{ color: activeTheme.textMain }}>{isLevel4Unlocked ? "Mastery Achieved!" : "Level 4 Unlock Progress"}</span>
            <span style={{ color: "#e67e22" }}>{displayStars} / {goal} Stars</span>
          </div>
          <div style={{ width: "100%", height: "24px", backgroundColor: "#f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", backgroundColor: "#e67e22", transition: "width 1s ease-out" }} />
          </div>
        </div>

        {/* SUBJECT CARDS */}
        <div style={{ display: "flex", gap: "25px", marginBottom: "40px" }}>
          {subjectData.map(sub => (
            <button key={sub.name} onClick={() => onSelectSubject(sub.name)}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "45px 20px",
                borderRadius: activeTheme.borderRadius, border: "none", backgroundColor: "white",
                boxShadow: activeTheme.cardShadow, borderBottom: `10px solid ${sub.color}`, cursor: "pointer", transition: "0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <span style={{ fontSize: "75px", marginBottom: "15px" }}>{sub.icon}</span>
              <span style={{ fontSize: "26px", fontWeight: "bold", color: activeTheme.textMain }}>{sub.name}</span>
            </button>
          ))}
        </div>

        {/* CONGRATS FOR LEVEL 4 */}
        {isLevel4Unlocked ? (
          <div style={{
            textAlign: "center", padding: "35px", backgroundColor: "#fef3c7",
            borderRadius: activeTheme.borderRadius, border: `3px solid #f59e0b`, boxShadow: activeTheme.cardShadow
          }}>
            <h2 style={{ color: "#92400e", margin: 0, fontSize: "30px" }}>👑 Level 4 Unlocked!</h2>
            <p style={{ color: "#92400e", marginTop: "12px", fontSize: "19px" }}>
              Incredible work! You are now entering the Grandmaster stage. Check the sidebar for Level 4.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: Theme.textMuted, fontSize: "18px", background: "white", padding: "15px", borderRadius: "12px" }}>
            Finish your final Level 3 tasks to reach the Grandmaster stage!
          </div>
        )}

      </div>
    </div>
  );
};

export default Level3Dashboard;