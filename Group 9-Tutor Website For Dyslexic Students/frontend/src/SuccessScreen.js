import React from "react";
import { Theme } from "./Theme";

const SuccessScreen = ({ level, onContinue }) => {
  return (
    <div style={{ 
      display: "flex", justifyContent: "center", alignItems: "center", 
      height: "100vh", backgroundColor: "#f9f9f9", textAlign: "center", padding: "20px" 
    }}>
      <div style={{ 
        backgroundColor: "white", padding: "60px", borderRadius: "30px", 
        boxShadow: "0 20px 50px rgba(0,0,0,0.1)", maxWidth: "600px",
        border: "10px solid #f1c40f" // Gold Border
      }}>
        <div style={{ fontSize: "100px", marginBottom: "20px" }}>🏆</div>
        <h1 style={{ fontSize: "42px", color: Theme.textMain, margin: "0 0 10px 0" }}>
          Level {level} Mastered!
        </h1>
        <p style={{ fontSize: "20px", color: Theme.textMuted, lineHeight: "1.6", marginBottom: "40px" }}>
          Incredible work! You have collected all 15 stars and completed every challenge in this stage. 
          You are ready for the next part of your journey.
        </p>
        
        <button 
          onClick={onContinue}
          style={{ 
            backgroundColor: "#2ecc71", color: "white", padding: "20px 50px", 
            borderRadius: "15px", border: "none", fontSize: "24px", 
            fontWeight: "bold", cursor: "pointer", width: "100%",
            boxShadow: "0 10px 0 #27ae60", transition: "0.1s"
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = "translateY(4px)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          {level === 1 ? "Unlock Level 2" : "Finish Level 2"}
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;