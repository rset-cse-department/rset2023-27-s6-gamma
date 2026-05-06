import React, { createContext, useContext, useState } from "react";
// 1. Make sure you import your data files here!
import { lessonsData } from "./lessonsData";
import { level2Data } from "./level2Data";
import { level3Data } from "./level3Data";
import { level4Data } from "./level4Data";
import { level5Data } from "./level5Data";

const LevelProgressContext = createContext();

export const LevelProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    return { Science: {}, Math: {}, English: {}, GK: {} };
  });

  // 2. The "Star Counter" that knows how to check specific levels
  const getStarsForLevel = (levelNum) => {

    let dataToSearch;
    if (levelNum === 1) dataToSearch = lessonsData;
    if (levelNum === 2) dataToSearch = level2Data;
    if (levelNum === 3) dataToSearch = level3Data;
    if (levelNum === 4) dataToSearch = level4Data;
    if (levelNum === 5) dataToSearch = level5Data;

    const subjects = ["Science", "Math", "English", "GK"];
    let count = 0;

    subjects.forEach((sub) => {
      if (dataToSearch && dataToSearch[sub]) {
        dataToSearch[sub].forEach((chapter) => {
          const score = (progress[sub] || {})[chapter.id];
          if (score !== null && score >= 7) count++;
        });
      }
    });
    return count;
  };

  const markModuleComplete = (subject, moduleId, score) => {
    setProgress((prev) => {
      const newProgress = {
        ...prev,
        [subject]: { ...(prev[subject] || {}), [moduleId]: score },
      };

      return newProgress;
    });
  };

  // 3. The Rules: Level 2 needs Level 1 stars, Level 3 needs Level 2 stars, etc.
  const isLevel2Unlocked = () => getStarsForLevel(1) >= 15;
  const isLevel3Unlocked = () => getStarsForLevel(2) >= 15;
  const isLevel4Unlocked = () => getStarsForLevel(3) >= 15;
  const isLevel5Unlocked = () => getStarsForLevel(4) >= 20;

  const hydrateProgress = (newProgress) => {
    setProgress(newProgress);
  };

  return (
    <LevelProgressContext.Provider
      value={{
        progress,
        markModuleComplete,
        isLevel2Unlocked,
        isLevel3Unlocked,
        isLevel4Unlocked,
        isLevel5Unlocked,
        getStarsForLevel,
        hydrateProgress
      }}
    >
      {children}
    </LevelProgressContext.Provider>
  );
};

export const useLevelProgress = () => useContext(LevelProgressContext);