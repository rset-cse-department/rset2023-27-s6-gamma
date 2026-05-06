import React, { useState } from "react";

const Lesson = ({ chapter, onBack, onStartFlashcards, onStartQuiz }) => {
  const [ttsEnabled, setTtsEnabled] = useState(false);

  // Simple TTS function
  const handleSpeak = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("TTS not supported in your browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBack} style={{ marginBottom: "20px" }}>← Back</button>

      <h2>{chapter.title}</h2>

      <div style={{ margin: "20px 0" }}>
        <p>{chapter.text}</p>
        <button onClick={() => handleSpeak(chapter.text)}>
          🔊 Listen to Lesson
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <button onClick={onStartFlashcards} style={{ marginRight: "20px" }}>
          🃏 Flashcards
        </button>
        <button onClick={onStartQuiz}>📝 Quiz</button>
      </div>
    </div>
  );
};

export default Lesson;