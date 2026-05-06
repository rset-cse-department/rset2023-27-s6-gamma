import React from "react";
import { Theme } from "./Theme";
import { useLevelProgress } from "./LevelProgressContext";

const Level4Dashboard = ({ user, onSelectSubject, onBackToLevel3, activeTheme }) => {
  const { progress, getStarsForLevel } = useLevelProgress();

  // Expert Level Subject Data
  const subjectData = [
    { name: "Science", icon: "🔬", color: "#9b59b6" },
    { name: "Math", icon: "📐", color: "#3498db" },
    { name: "English", icon: "🖋️", color: "#e67e22" },
    { name: "GK", icon: "🏅", color: "#27ae60" }
  ];

  // 🕵️ Step 1: Use the global star counter!
  const totalStars = getStarsForLevel(4);

  // 🕵️ Step 2: Now 'totalStars' exists, so these lines work!
  const goal = 20;
  const percent = Math.min(Math.round((totalStars / goal) * 100), 100);
  const isLevel5Unlocked = totalStars >= goal;

  return (
    <div style={{ padding: "40px", backgroundColor: activeTheme.background, minHeight: "100vh", fontFamily: activeTheme.fontFamily }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "30px", backgroundColor: "white", padding: "20px 30px",
          borderRadius: activeTheme.borderRadius, boxShadow: activeTheme.cardShadow,
          borderLeft: `10px solid #27ae60` // Green for GK/Level 4
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              fontSize: "60px", backgroundColor: "#f1f5f9", width: "100px", height: "100px",
              display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%"
            }}>
              {user.avatar || "👤"}
            </div>
            <div>
              <h1 style={{ color: activeTheme.textMain, margin: 0, fontSize: "32px" }}>Master Explorer, {user.username}!</h1>
              <p style={{ color: activeTheme.textMuted, margin: "5px 0 0 0", fontSize: "20px" }}>Expert · Level 4</p>
            </div>
          </div>

          <button
            onClick={onBackToLevel3}
            style={{
              padding: "12px 24px", borderRadius: "12px", border: `2px solid ${activeTheme.sidebar}`,
              background: "white", color: activeTheme.sidebar, fontWeight: "bold", cursor: "pointer"
            }}
          >
            ← Level 3
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: Theme.borderRadius, boxShadow: Theme.cardShadow, marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "20px", fontWeight: "bold" }}>
            <span style={{ color: activeTheme.textMain }}>Level 5 Unlock Progress</span>
            <span style={{ color: "#27ae60" }}>{totalStars} / {goal} Stars</span>
          </div>
          <div style={{ width: "100%", height: "24px", backgroundColor: "#f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", backgroundColor: "#27ae60", transition: "width 1s ease-out" }} />
          </div>
        </div>

        {/* SUBJECT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px", marginBottom: "40px" }}>
          {subjectData.map(sub => (
            <button key={sub.name} onClick={() => onSelectSubject(sub.name)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 10px",
                borderRadius: activeTheme.borderRadius, border: "none", backgroundColor: "white",
                boxShadow: activeTheme.cardShadow, borderBottom: `10px solid ${sub.color}`, cursor: "pointer", transition: "0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <span style={{ fontSize: "70px", marginBottom: "15px" }}>{sub.icon}</span>
              <span style={{ fontSize: "24px", fontWeight: "bold", color: Theme.textMain }}>{sub.name}</span>
            </button>
          ))}
        </div>

        {/* UNLOCK MESSAGE */}
        {isLevel5Unlocked ? (
          <div style={{
            textAlign: "center", padding: "35px", backgroundColor: "#fef3c7",
            borderRadius: activeTheme.borderRadius, border: `3px solid #f59e0b`, boxShadow: Theme.cardShadow
          }}>
            <h2 style={{ color: "#92400e", margin: 0, fontSize: "30px" }}>💎 Ultimate Master Unlocked!</h2>
            <p style={{ color: "#92400e", marginTop: "12px", fontSize: "19px" }}>
              You have conquered Level 4! You are ready for the final Level 5 challenge.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: Theme.textMuted, fontSize: "18px", background: "white", padding: "15px", borderRadius: "12px" }}>
            Collect {goal} stars to reach the final Diamond stage!
          </div>
        )}

      </div>
    </div>
  );
};

export default Level4Dashboard;