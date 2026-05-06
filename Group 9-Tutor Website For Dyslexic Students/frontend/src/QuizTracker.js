import React, { useRef } from 'react';
import Quiz from "./QuizView"; // This is the file we added the timer to!
import useTracker from "./useTracker";

// --- VERSION 1: The Main Quiz View (Used in App.js) ---
const QuizWrapper = ({ chapterData, onFinish, onBackToLesson }) => {
  const metrics = useTracker(chapterData.id);

  return (
    <Quiz 
      /* 🚨 CHANGE THIS LINE BELOW 🚨 */
      questions={chapterData.questions} 
      onFinish={onFinish} 
      onBackToLesson={onBackToLesson} 
      trackingMetrics={metrics}
    />
  );
};

export default QuizWrapper;



// --- VERSION 2: The Click Timer (Used inside Quiz questions) ---
export const QuizClickTracker = ({ children, questionId }) => {
    const questionStartTime = useRef(null);

    const handleQuestionStart = () => {
        // Start the stopwatch!
        questionStartTime.current = Date.now();
    };

    const handleAnswerClick = async (e) => {
        if (!questionStartTime.current) return;
        
        // Calculate how many milliseconds you took to think
        const clickLatency = Date.now() - questionStartTime.current;
        
        try {
            await fetch('http://127.0.0.1:8000/api/log/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user')).username : 'guest',
                    metric: 'clickLatency',
                    value: clickLatency,
                    id: questionId || 'quiz_' + Date.now(),
                    timestamp: new Date().toISOString()
                })
            });
        } catch (err) {
            console.error("Failed to log quiz data:", err);
        }
        
        // Reset the stopwatch for the next question
        questionStartTime.current = null;
    };

    return (
        <div 
            onMouseEnter={handleQuestionStart}
            onClick={handleAnswerClick}
            style={{ cursor: 'pointer' }}
        >
            {children}
        </div>
    );
};