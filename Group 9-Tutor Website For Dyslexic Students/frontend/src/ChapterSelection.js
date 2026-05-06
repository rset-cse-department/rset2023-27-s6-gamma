import React from "react";
import { useLevelProgress } from "./LevelProgressContext";

const ChapterSelection = ({ subject, chapters, onSelectChapter, onBack, activeTheme, currentLevel }) => {
  const { progress } = useLevelProgress();
  
  // 2. Safety Net - Fixed all the names inside here too!
  if (!chapters) {
    return (
      <div style={{ padding: "40px", backgroundColor: activeTheme.background, textAlign: "center", fontFamily: activeTheme.fontFamily }}>
        <h2 style={{ color: activeTheme.textMain }}>Oops! Chapters not found.</h2>
        <p style={{ color: activeTheme.textMuted }}>Check if the subject name matches in level4Data.js</p>
        <button onClick={onBack} style={{ padding: "10px 20px", cursor: "pointer", borderRadius: "8px" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "40px", 
      backgroundColor: activeTheme.background, // 🚀 Now it matches!
      minHeight: "100vh", 
      fontFamily: activeTheme.fontFamily 
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <button onClick={onBack} style={{ 
          color: activeTheme.accent, 
          background: "none", 
          border: "none", 
          cursor: "pointer", 
          fontWeight: "bold", 
          marginBottom: "20px", 
          fontSize: "18px",
          fontFamily: activeTheme.fontFamily
        }}>
          ← Back to Dashboard
        </button>

        <h2 style={{ color: activeTheme.textMain, marginBottom: "30px", fontSize: "32px", fontFamily: activeTheme.fontFamily }}>
          Select a <span style={{ color: activeTheme.accent }}>{subject}</span> Chapter
        </h2>

        <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
          {chapters.map((ch) => {
            const isDone = (progress[subject] || {})[ch.id] >= 7;
            
            return (
              <button 
                key={ch.id} 
                onClick={() => onSelectChapter(ch)} 
                style={{ 
                  width: "260px", 
                  height: "150px", 
                  borderRadius: activeTheme.borderRadius, 
                  backgroundColor: isDone ? "#f0fff4" : "white", 
                  border: isDone ? "2px solid #2ecc71" : "none", 
                  boxShadow: activeTheme.cardShadow, 
                  borderTop: `8px solid ${isDone ? "#2ecc71" : activeTheme.accent}`, 
                  cursor: "pointer", 
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  padding: "15px",
                  fontFamily: activeTheme.fontFamily // 🚀 Keeps text easy to read!
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <span style={{ fontSize: "20px", fontWeight: "bold", color: activeTheme.textMain, textAlign: "center" }}>
                  {ch.title}
                </span>
                
                {isDone && (
                  <div style={{ 
                    position: "absolute", top: "-12px", right: "-12px", 
                    backgroundColor: "#2ecc71", color: "white", borderRadius: "50%", 
                    width: "35px", height: "35px", display: "flex", alignItems: "center", 
                    justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    fontSize: "20px"
                  }}>
                    ⭐
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChapterSelection;