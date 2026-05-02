import React, { useState } from "react";

function CreateUser({ onCreate, onBack }) {
  const [username, setUsername] = useState("");

  const handleCreate = () => {
    if (username.trim() === "") {
      alert("Enter a username");
      return;
    }
    onCreate({ username });
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Create Account</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "8px", width: "200px" }}
      />
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleCreate} style={{ marginRight: "10px", padding: "8px 16px" }}>
          Create
        </button>
        <button onClick={onBack} style={{ padding: "8px 16px" }}>
          Back
        </button>
      </div>
    </div>
  );
}

export default CreateUser;
