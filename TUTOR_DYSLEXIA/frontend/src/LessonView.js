import { LessonDwellTracker } from "./LessonTracker";
import React, { useState, useEffect } from "react";
import { Theme } from "./Theme";

const LessonView = ({ chapter, onBack, onStartQuiz, onStartFlashcards }) => {
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [activeSentence, setActiveSentence] = useState(null);

  // Stop speech if user leaves the lesson
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  if (!chapter) return null;

  // Split text into sentences for better highlighting control
  const sentences = chapter.text.split(/(?<=[.!?])\s+/);

  const readSentence = (text, index) => {
    window.speechSynthesis.cancel();
    
    if (activeSentence === index) {
      setActiveSentence(null);
      setHighlightIdx(-1);
      return;
    }

    setActiveSentence(index);
    setHighlightIdx(-1);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const textUpToBoundary = text.substring(0, event.charIndex);
        const wordIndex = textUpToBoundary.trim().split(/\s+/).length - (textUpToBoundary.trim() === "" ? 1 : 0);
        setHighlightIdx(wordIndex);
      }
    };

    utterance.onend = () => {
      setHighlightIdx(-1);
      setActiveSentence(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ 
      maxWidth: "900px", 
      margin: "0 auto", 
      padding: "40px", 
      fontFamily: Theme.fontFamily,
      backgroundColor: Theme.background,
      minHeight: "100vh"
    }}>
      {/* 1. BACK BUTTON */}
      <button 
        onClick={onBack} 
        style={{ 
          fontSize: "20px", 
          color: Theme.accent, 
          border: "none", 
          background: "none", 
          cursor: "pointer", 
          marginBottom: "30px",
          fontWeight: "bold"
        }}
      >
        ← Back to Dashboard
      </button>

      {/* 2. CONTENT CARD */}
      <div style={{ 
        backgroundColor: "white", 
        padding: "50px", 
        borderRadius: Theme.borderRadius, 
        boxShadow: Theme.cardShadow,
        border: "1px solid #E2E8F0",
        position: "relative"
      }}>
        <h1 style={{ fontSize: Theme.fontSize.header, color: Theme.textMain, marginBottom: "25px" }}>
          {chapter.title}
        </h1>

        <img 
          src={chapter.imageUrl} 
          alt={chapter.title} 
          style={{ width: "100%", borderRadius: "12px", marginBottom: "35px", objectFit: "cover", maxHeight: "400px" }} 
        />

        {/* 3. DYSLEXIA FRIENDLY TEXT BLOCK WITH HIGHLIGHTING */}
        <div style={{ 
          fontSize: Theme.fontSize.base, 
          lineHeight: Theme.lineHeight, 
          color: Theme.textMain,
          letterSpacing: "0.5px",
          textAlign: "left"
        }}>
          {sentences.map((sentence, sIdx) => (
            <div 
              key={sIdx} 
              style={{ 
                marginBottom: "25px", 
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: activeSentence === sIdx ? "#F8FAFC" : "transparent",
                borderLeft: activeSentence === sIdx ? `6px solid ${Theme.accent}` : "6px solid transparent",
                display: "flex",
                alignItems: "flex-start",
                gap: "15px",
                transition: "all 0.3s ease"
              }}
            >
              {/* Individual Play Button per Sentence */}
              <button 
                onClick={() => readSentence(sentence, sIdx)}
                style={{ 
                  background: "none", 
                  border: "none", 
                  fontSize: "24px", 
                  cursor: "pointer",
                  marginTop: "4px"
                }}
              >
                {activeSentence === sIdx ? "⏹️" : "🔊"}
              </button>

              <p style={{ margin: 0, flex: 1 }}>
  {sentence.split(" ").map((word, wIdx) => {
    // 1. Check if the word has stars like **WATER**
    const isBold = word.startsWith("**") && word.endsWith("**");
    
    // 2. Clean the word for the tracker and display
    // This removes the stars so the student doesn't see them!
    const cleanDisplayWord = word.replace(/\*\*/g, ""); 
    const trackerId = cleanDisplayWord.replace(/[.,!?]/g, "");

    return (
      <LessonDwellTracker key={wIdx} wordId={trackerId}>
        <span 
          style={{
            backgroundColor: (activeSentence === sIdx && highlightIdx === wIdx) ? "#FACC15" : "transparent",
            color: (activeSentence === sIdx && highlightIdx === wIdx) ? "black" : "inherit",
            borderRadius: "4px",
            padding: "0 2px",
            transition: "background-color 0.1s",
            display: "inline-block",
            // 3. If it had stars, make it bold!
            fontWeight: isBold ? "800" : "normal" 
          }}
        >
          {cleanDisplayWord}{" "}
        </span>
      </LessonDwellTracker>
    );
  })}
</p>
            </div>
          ))}
        </div>

        {/* 4. ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
          <button 
            onClick={onStartFlashcards} 
            style={{
              flex: 1,
              padding: "20px",
              fontSize: "22px",
              borderRadius: "12px",
              border: `3px solid ${Theme.accent}`,
              backgroundColor: "white",
              color: Theme.accent,
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🗂 Practice Cards
          </button>

          <button 
            onClick={onStartQuiz} 
            style={{
              flex: 1,
              padding: "20px",
              fontSize: "22px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: Theme.success || "#2ecc71",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ✍️ Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonView;