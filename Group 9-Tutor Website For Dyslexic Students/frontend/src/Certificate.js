import React from "react";
import Confetti from 'react-confetti'; // 🎊 Don't forget to import!

const Certificate = ({ user, activeTheme, onBack }) => {
  // 📏 Get the size of the window so confetti fills the whole screen
  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <div style={{ 
      padding: "40px", 
      backgroundColor: activeTheme.background, 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: activeTheme.fontFamily,
      overflow: "hidden" // Keeps scrollbars from popping up
    }}>
      
      {/* 🥳 Confetti will rain down over everything! */}
      <Confetti 
        width={width} 
        height={height} 
        numberOfPieces={150} // 150 pieces is a good party size!
        recycle={true}       // This keeps the party going forever
      />

      {/* 📜 THE CERTIFICATE PAPER */}
      <div style={{ 
        width: "100%", 
        maxWidth: "800px", 
        backgroundColor: "white", 
        padding: "60px", 
        borderRadius: "15px", 
        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        border: "15px solid #FFD700", 
        textAlign: "center",
        position: "relative",
        zIndex: 10 // 🪜 Keeps the paper above most of the confetti
      }}>
        
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>🏆</div>
        
        <h1 style={{ color: "#b8860b", fontSize: "48px", marginBottom: "10px" }}>CERTIFICATE</h1>
        <h3 style={{ color: activeTheme.textMain, fontSize: "24px", marginBottom: "40px" }}>OF COMPLETION</h3>
        
        <p style={{ fontSize: "20px", color: activeTheme.textMuted }}>This is proudly awarded to</p>
        
        <h2 style={{ 
          fontSize: "50px", 
          color: activeTheme.accent, 
          margin: "20px 0",
          fontFamily: "'Brush Script MT', cursive" 
        }}>
          {user.username}
        </h2>
        
        <p style={{ fontSize: "20px", color: activeTheme.textMuted, maxWidth: "500px", margin: "0 auto" }}>
          For demonstrating incredible bravery and smarts by conquering all 5 Levels of the Academy!
        </p>
        
        <div style={{ marginTop: "50px", borderTop: "2px solid #eee", paddingTop: "20px", display: "inline-block" }}>
          <p style={{ fontWeight: "bold", color: activeTheme.textMain }}>{new Date().toLocaleDateString()}</p>
          <p style={{ color: activeTheme.textMuted }}>Date of Achievement</p>
        </div>
      </div>

      <div className="no-print" style={{ display: "flex", gap: "20px", marginTop: "40px", zIndex: 20 }}>
        <button 
          onClick={onBack} 
          style={{ 
            padding: "15px 30px", 
            borderRadius: "30px", 
            border: "none", 
            backgroundColor: "#64748b", 
            color: "white", 
            fontWeight: "bold", 
            cursor: "pointer",
            fontSize: "18px",
          }}>
          Back to Academy
        </button>

        <button 
          onClick={() => window.print()} 
          style={{ 
            padding: "15px 30px", 
            borderRadius: "30px", 
            border: "none", 
            backgroundColor: "#FFD700", 
            color: "#000", 
            fontWeight: "bold", 
            cursor: "pointer",
            fontSize: "18px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
          Download / Print ⬇️
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          div { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default Certificate;