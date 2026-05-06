import React, { useRef } from 'react';
import LessonView from "./LessonView";
import useTracker from "./useTracker";

// --- VERSION 1: The Main Lesson View ---
const LessonWrapper = ({ chapter, onBack, onStartQuiz, onStartFlashcards }) => {
  const metrics = useTracker(chapter.id);

  return (
    <LessonView 
      chapter={chapter} 
      onBack={onBack} 
      onStartQuiz={onStartQuiz} 
      onStartFlashcards={onStartFlashcards}
      trackingMetrics={metrics} 
    />
  );
};

export default LessonWrapper;

// --- VERSION 2: The Revised Time Tracker ---
export const LessonDwellTracker = ({ children, wordId }) => {
    const startTime = useRef(null);

    const startTracking = () => {
        // Start the stopwatch!
        startTime.current = Date.now();
    };

    const stopTracking = () => {
        if (startTime.current) {
            const dwellTime = Date.now() - startTime.current;
            
            // 🕵️ Step 1: Grab the LATEST username from the storage locker
            const userData = localStorage.getItem('current_user');
            const activeUser = userData ? JSON.parse(userData).username : 'guest';

            // 🕵️ Step 2: Send the data to your Django Backend
            fetch('http://127.0.0.1:8000/api/log/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metric: 'cursorDwellTime',
                    value: dwellTime,
                    id: wordId || 'lesson_word', // 🚀 This is the actual word!
                    username: activeUser,       // 🚀 This is the new username!
                    timestamp: new Date().toISOString()
                })
            }).catch(err => console.error('Failed to log lesson dwell time:', err));
            
            startTime.current = null;
        }
    };

    return (
      <span 
          onMouseEnter={startTracking} 
          onMouseLeave={stopTracking}
          style={{ cursor: 'pointer', display: 'inline-block' }}
      >
          {children}
      </span>
    );
};