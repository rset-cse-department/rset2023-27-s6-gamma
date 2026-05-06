// src/LessonContainer.js
import React, { useState } from "react";
import Lesson from "./Lesson";
import { lessonsData } from "./lessonsData";

const LessonContainer = ({ subject = "Science" }) => {
  const [user, setUser] = useState({ completedChapters: [] });

  // Pick the first lesson in the subject
  const chapter = lessonsData[subject][0]; // Safety: make sure this exists

  if (!chapter) return <div>Lesson not found</div>;

  const handleComplete = (score, updatedChapters) => {
    console.log("Lesson completed! Score:", score);
    setUser({ ...user, completedChapters: updatedChapters });
    alert(`Lesson completed! Score: ${score}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Lesson
        chapter={chapter}
        user={user}
        onBack={() => alert("Back button pressed")}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default LessonContainer;