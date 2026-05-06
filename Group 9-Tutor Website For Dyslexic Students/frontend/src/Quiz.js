import React, { useState } from "react";
import { Theme } from "./Theme";

const Quiz = ({ chapterData, onFinish, onBackToLesson }) => {
  const questions = chapterData?.questions || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);


if (!questions || questions.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", backgroundColor: Theme.background, minHeight: "100vh" }}>
        <h2 style={{ color: Theme.textMain }}>Loading questions...</h2>
        <p style={{ color: Theme.textMuted }}>If this takes too long, check your data files!</p>
        <button onClick={onBackToLesson} style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>Go Back</button>
      </div>
    );
  }



  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    if (isCorrect) setScore(score + 1);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const passed = score >= 7;
    return (
      <div style={{ padding: "40px", textAlign: "center", backgroundColor: Theme.background, minHeight: "100vh" }}>
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: Theme.borderRadius, boxShadow: Theme.cardShadow, maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "48px" }}>{passed ? "🎉" : "📚"}</h1>
          <h2 style={{ color: Theme.textMain }}>Quiz Complete!</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: passed ? "#2ecc71" : "#e74c3c" }}>
            You scored {score} / {questions.length}
          </p>
          <p style={{ color: Theme.textMuted, marginBottom: "30px" }}>
            {passed ? "Great job! You earned a star for this chapter." : "Keep practicing! You need 7/10 to earn a star."}
          </p>
          <button 
            onClick={() => onFinish(score)} 
            style={{ padding: "15px 40px", backgroundColor: Theme.accent, color: "white", border: "none", borderRadius: "10px", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}
          >
            Finish & Collect Stars
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", backgroundColor: Theme.background, minHeight: "100vh", fontFamily: Theme.fontFamily }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Progress Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
          <button onClick={onBackToLesson} style={{ color: Theme.textMuted, background: "none", border: "none", cursor: "pointer" }}>← Quit Quiz</button>
          <span style={{ fontWeight: "bold", color: Theme.accent }}>Question {currentQuestion + 1} of {questions.length}</span>
        </div>

        {/* Question Card */}
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: Theme.borderRadius, boxShadow: Theme.cardShadow, borderTop: `8px solid ${Theme.accent}` }}>
          <h2 style={{ fontSize: "28px", color: Theme.textMain, marginBottom: "30px", lineHeight: "1.4" }}>
            {questions[currentQuestion].question}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                style={{
                  padding: "25px",
                  fontSize: "20px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: Theme.textMain,
                  transition: "0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = Theme.accent;
                  e.currentTarget.style.backgroundColor = "#f0f7ff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;