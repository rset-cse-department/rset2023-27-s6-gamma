import React, { useState } from "react";
import "./App.css";

function CreateUser({ onCreate, onBack }) {
  const [username, setUsername] = useState("");

  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      <h2 style={{ fontSize: "28px" }}>Create Account</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div>
        <button style={{ backgroundColor: "#007acc", color: "white" }} onClick={() => onCreate({ username })}>Create</button>
        <button style={{ backgroundColor: "#999", color: "white" }} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

export default CreateUser;
