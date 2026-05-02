import React, { useState } from "react";
import "./App.css";

function Login({ onSuccess, onBack }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Add this function inside your Login component
const handleLoginClick = async () => {
  if (!username) return;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
    });

    const data = await response.json();
    
    // This is the important part! 
    // It passes the data from MongoDB back to your App
    onSuccess(data); 
  } catch (error) {
    console.error("The bridge is broken:", error);
  }
};

// 2. Update your button to use it
<button onClick={handleLoginClick}>Login</button>

  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      <h2 style={{ fontSize: "28px" }}>Login</h2>
      <input
        type="text"
        placeholder="Enter your username"
        style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div style={{ marginTop: "20px" }}>
        <button 
          style={{ 
            backgroundColor: "#4CAF50", 
            color: "white", 
            padding: "10px 25px", 
            borderRadius: "8px", 
            border: "none", 
            cursor: "pointer",
            fontSize: "18px",
            opacity: loading ? 0.7 : 1
          }} 
          onClick={handleLoginClick}
          disabled={loading}
        >
          {loading ? "Checking..." : "Login"}
        </button>
        
        <button 
          style={{ 
            backgroundColor: "#999", 
            color: "white", 
            padding: "10px 25px", 
            borderRadius: "8px", 
            border: "none", 
            marginLeft: "10px", 
            cursor: "pointer" 
          }} 
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Login;