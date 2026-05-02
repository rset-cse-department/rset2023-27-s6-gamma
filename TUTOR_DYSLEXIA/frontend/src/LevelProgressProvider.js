// src/LevelProgressProvider.js
import React, { createContext, useContext, useState } from "react";

const LevelProgressContext = createContext();

export const LevelProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({}); // { Science: {1: 8, 2: 7, ...}, Math: {...}, English: {...} }

  const updateModuleScore = (subject, moduleId, score) => {
    setProgress((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], [moduleId]: score },
    }));
  };

  const isLevel2Unlocked = () => {
    const subjects = ["Science", "Math", "English"];
    for (let sub of subjects) {
      const scores = progress[sub];
      if (!scores) return false;
      for (let i = 1; i <= 5; i++) {
        if (!scores[i] || scores[i] < 7) return false;
      }
    }
    return true;
  };

  return (
    <LevelProgressContext.Provider value={{ progress, updateModuleScore, isLevel2Unlocked }}>
      {children}
    </LevelProgressContext.Provider>
  );
};

export const useLevelProgress = () => useContext(LevelProgressContext);