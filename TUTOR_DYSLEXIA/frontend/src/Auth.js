import React, { useState, useEffect } from "react";
import { Theme } from "./Theme";

const avatars = ["🦊", "🐼", "🐨", "🦁", "🤖", "🚀", "🦄", "🦉"];

const Auth = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // New state for confirmation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const rememberedUser = localStorage.getItem("tutor_remembered_name");
    if (rememberedUser) setUsername(rememberedUser);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim().toLowerCase();
    if (password.length !== 6 || isNaN(password)) {
      setError("PIN must be exactly 6 numbers.");
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem("tutor_users") || "{}");

    if (isRegistering) {
      if (allUsers[cleanUsername]) {
        setError("That name is taken! Try another one.");
      } else {
        // --- CREATE USER LOGIC ---
        const newUser = { 
          username: username.trim(),
          password, 
          avatar: selectedAvatar,
          progress: { Science: {}, Math: {}, English: {} } 
        };
        
        // Try to register on backend first
        const result = await onLogin(newUser);
        if (result && !result.success) {
          setError(result.error);
          return;
        }

        // Also save locally for convenience
        allUsers[cleanUsername] = newUser;
        localStorage.setItem("tutor_users", JSON.stringify(allUsers));
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsRegistering(false); // Take them back to login page
          setPassword(""); // Clear password for security
        }, 2000);
      }
    } else {
      // --- LOGIN LOGIC ---
      const loginPayload = { username: cleanUsername, password: password };
      
      console.log("📢 Auth is calling App.js handleLogin for:", cleanUsername);
      const result = await onLogin(loginPayload); 

      if (result && result.success) {
        if (rememberMe) {
          localStorage.setItem("tutor_remembered_name", cleanUsername);
        } else {
          localStorage.removeItem("tutor_remembered_name");
        }
      } else {
        setError(result?.error || "Oops! Wrong name or PIN. Try again!");
      }
    }
  };

  return (
    <div style={{ 
      height: "100vh", display: "flex", justifyContent: "center", 
      alignItems: "center", backgroundColor: Theme.background,
      fontFamily: Theme.fontFamily, padding: "20px"
    }}>
      <div style={{ 
        display: "flex", backgroundColor: "white", borderRadius: Theme.borderRadius, 
        boxShadow: Theme.cardShadow, width: "100%", maxWidth: "1000px", overflow: "hidden",
        flexDirection: "row", border: "1px solid #e2e8f0", minHeight: "600px"
      }}>
        
        {/* LEFT PANEL */}
        <div style={{ 
          flex: 1, backgroundColor: showSuccess ? "#d1fae5" : "#EBF4FF", padding: "40px", 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", transition: "background-color 0.5s"
        }}>
          <div style={{ fontSize: "120px", marginBottom: "20px" }}>
            {showSuccess ? "✅" : (isRegistering ? selectedAvatar : "👋")}
          </div>
          <h1 style={{ color: "#2c3e50", fontSize: "32px", marginBottom: "10px" }}>
            {showSuccess ? "Account Created!" : (isRegistering ? "Pick an Avatar!" : "Welcome Back!")}
          </h1>
          <p style={{ color: "#7f8c8d", fontSize: "18px" }}>
            {showSuccess ? "Now you can log in with your PIN." : "Ready to earn some stars today?"}
          </p>
        </div>

        {/* RIGHT PANEL: FORM */}
        <form onSubmit={handleAuth} style={{ flex: 1.5, padding: "50px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          
          {/* SUCCESS OVERLAY */}
          {showSuccess && (
            <div style={{ 
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: "rgba(255,255,255,0.9)", zIndex: 10, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", borderRadius: Theme.borderRadius
            }}>
              <h2 style={{ color: Theme.success, fontSize: "36px" }}>Awesome! 🚀</h2>
              <p style={{ fontSize: "20px", color: Theme.textMain }}>Taking you to the login page...</p>
            </div>
          )}

          <h2 style={{ color: "#2c3e50", fontSize: "36px", marginBottom: "30px", textAlign: "center" }}>
            {isRegistering ? "Join the Club" : "Student Login"}
          </h2>
          
          {error && (
            <div style={{ backgroundColor: "#fee2e2", color: "#e74c3c", padding: "12px", borderRadius: "12px", marginBottom: "20px", textAlign: "center", fontWeight: "bold" }}>
              {error}
            </div>
          )}

          {isRegistering && (
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold", fontSize: "18px" }}>Choose your character:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                {avatars.map(a => (
                  <div 
                    key={a}
                    onClick={() => setSelectedAvatar(a)}
                    style={{ 
                      fontSize: "30px", padding: "10px", cursor: "pointer", borderRadius: "12px",
                      backgroundColor: selectedAvatar === a ? Theme.accent : "#f1f5f9",
                      transform: selectedAvatar === a ? "scale(1.1)" : "scale(1)",
                      transition: "0.2s"
                    }}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "18px" }}>Username</label>
            <input 
              type="text" placeholder="Your Name" value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: "18px", borderRadius: "15px", border: "3px solid #E2E8F0", fontSize: "20px", outline: "none", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "18px" }}>6-Digit PIN</label>
            <input 
              type="password" placeholder="● ● ● ● ● ●" value={password} maxLength={6}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "18px", borderRadius: "15px", border: "3px solid #E2E8F0", fontSize: "20px", outline: "none", letterSpacing: "5px", boxSizing: "border-box" }}
              required
            />
          </div>

          {!isRegistering && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px", cursor: "pointer" }} onClick={() => setRememberMe(!rememberMe)}>
               <div style={{ 
                 width: "24px", height: "24px", borderRadius: "6px", border: `3px solid ${Theme.accent}`,
                 backgroundColor: rememberMe ? Theme.accent : "transparent",
                 display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold"
               }}>
                 {rememberMe && "✓"}
               </div>
               <span style={{ fontSize: "18px", fontWeight: "bold", color: "#64748b" }}>Remember my name</span>
            </div>
          )}

          <button type="submit" style={{ 
            width: "100%", padding: "20px", backgroundColor: "#2ecc71", 
            color: "white", border: "none", borderRadius: "50px", fontSize: "22px", 
            fontWeight: "bold", cursor: "pointer", boxShadow: "0 6px 0 #27ae60"
          }}>
            {isRegistering ? "Create Account! 🚀" : "Let's Go! →"}
          </button>

          <p onClick={() => { setIsRegistering(!isRegistering); setError(""); }} style={{ marginTop: "25px", color: "#3498db", cursor: "pointer", fontSize: "18px", textAlign: "center", textDecoration: "underline" }}>
            {isRegistering ? "I already have an account" : "I'm a new student!"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;