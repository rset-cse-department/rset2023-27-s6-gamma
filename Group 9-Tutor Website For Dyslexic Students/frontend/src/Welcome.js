import React from "react";
import "./App.css";

const Welcome = ({ onCreate, onLogin }) => {
  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", textAlign: "center", padding: "20px"
    }}>
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>Welcome to Dyslexia Tutor</h1>
      <p style={{ fontSize: "22px", marginBottom: "40px", lineHeight: "1.8" }}>
        Learn at your own pace. Choose an option to get started!
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "250px" }}>
        <button style={{ backgroundColor: "#007acc", color: "white" }} onClick={onCreate}>Create User</button>
        <button style={{ backgroundColor: "#4CAF50", color: "white" }} onClick={onLogin}>Login</button>
      </div>
    </div>
  );
};

export default Welcome;
