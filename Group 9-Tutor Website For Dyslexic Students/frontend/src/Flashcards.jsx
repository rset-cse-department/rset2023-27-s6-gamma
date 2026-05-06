import React, { useState } from "react";
import "./Flashcards.css";

const Flashcards = ({ subject, chapter, flashcards, onBack }) => {
  const [flippedIndex, setFlippedIndex] = useState(null);

  return (
    <div className="flashcards-page">
      <button className="secondary-btn" onClick={onBack}>
        ⬅ Back to Lesson
      </button>

      <h2>{subject}</h2>
      <h1>{chapter}</h1>

      <div className="flashcards-big">
        {flashcards.map((card, index) => {
          const isFlipped = flippedIndex === index;

          return (
            <div
              key={index}
              className={`flashcard-big ${isFlipped ? "flipped" : ""}`}
              onClick={() =>
                setFlippedIndex(isFlipped ? null : index)
              }
            >
              {isFlipped ? card.back : card.front}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Flashcards;