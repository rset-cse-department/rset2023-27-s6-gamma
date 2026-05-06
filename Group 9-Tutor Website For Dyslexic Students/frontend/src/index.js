import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LevelProgressProvider } from "./LevelProgressContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LevelProgressProvider>
    <App />
  </LevelProgressProvider>
);