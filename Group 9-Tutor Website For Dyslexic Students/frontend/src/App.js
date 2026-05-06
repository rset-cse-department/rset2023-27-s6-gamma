import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import ChapterSelection from "./ChapterSelection";
import Auth from "./Auth";
import Level2Dashboard from "./level2Dashboard";
import Level3Dashboard from "./level3Dashboard";
import Level4Dashboard from "./level4Dashboard";
import Level5Dashboard from "./level5Dashboard"; // The component we just made
import { level5Data } from "./level5Data";       // The data we made earlier
import ProfileView from "./ProfileView";
import { useLevelProgress } from "./LevelProgressContext";
import { lessonsData } from "./lessonsData";
import { level2Data } from "./level2Data";
import { level3Data } from "./level3Data";
import { level4Data } from "./level4Data";
import { Theme } from "./Theme";
import Certificate from "./Certificate";
import Confetti from 'react-confetti';

import QuizWrapper from "./QuizTracker";
import LessonWrapper from "./LessonTracker";
import FlashcardsWrapper from "./FlashcardsTracker";


const SuccessScreen = ({ level, onContinue, activeTheme }) => {
  // 🎊 Get the screen size for the confetti
  const width = window.innerWidth;
  const height = window.innerHeight;
  const theme = activeTheme || Theme;
  const isLevel5 = level === 5;
  const mainColor = isLevel5 ? "#00d2ff" : "#2ecc71";
  const medal = isLevel5 ? "💎" : "🏆";

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", backgroundColor: activeTheme.background, textAlign: "center", padding: "20px"
    }}>
      {/* 🥳 The Confetti Layer! */}
      <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />

      <div style={{
        backgroundColor: "white", padding: "60px", borderRadius: activeTheme.borderRadius,
        boxShadow: activeTheme.cardShadow, maxWidth: "600px", border: `8px solid ${mainColor}`,
        position: "relative", zIndex: 10 // This keeps the card on top of the sparkles
      }}>
        <div style={{ fontSize: "100px", marginBottom: "20px" }}>{medal}</div>
        <h1 style={{ fontSize: "42px", color: activeTheme.textMain }}>Level {level} Mastered!</h1>
        <button
          onClick={onContinue}
          style={{
            backgroundColor: mainColor, color: "white", padding: "20px 50px",
            borderRadius: "50px", border: "none", fontSize: "24px", fontWeight: "bold", cursor: "pointer"
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

function App() {
  const { markModuleComplete, progress, isLevel2Unlocked, isLevel3Unlocked, isLevel4Unlocked, isLevel5Unlocked, hydrateProgress, getStarsForLevel } = useLevelProgress();
  const [currentBg, setCurrentBg] = useState(Theme.background);
  const activeTheme = {
    ...Theme,
    background: currentBg
  };

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("current_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [page, setPage] = useState(() => localStorage.getItem("current_page") || "dashboard");
  const [subject, setSubject] = useState(() => localStorage.getItem("current_subject") || null);
  const [currentLevel, setCurrentLevel] = useState(() => parseInt(localStorage.getItem("current_level")) || 1);
  const [chapterData, setChapterData] = useState(() => {
    const saved = localStorage.getItem("current_chapter_data");
    return saved ? JSON.parse(saved) : null;
  });

  const saveStateToBackend = async (currentState) => {
    if (!user) {
      console.log("⚠️ No user in state, not saving to backend.");
      return;
    }
    console.log("💾 Attempting to save state to backend for user:", user.username, "State:", currentState);
    try {
      const resp = await fetch('http://127.0.0.1:8000/api/save-state/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          state: currentState
        })
      });
      const data = await resp.json();
      console.log("📥 Backend save response:", data);
    } catch (err) {
      console.error("❌ Failed to save state to backend", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("current_page", page);
    localStorage.setItem("current_level", currentLevel);
    if (subject) localStorage.setItem("current_subject", subject);
    if (chapterData) localStorage.setItem("current_chapter_data", JSON.stringify(chapterData));

    // Auto sync with backend if logged in
    if (user) {
      saveStateToBackend({ page, currentLevel, subject, chapterData, progress });
    }
  }, [page, currentLevel, subject, chapterData, progress, user]);


  const handleLogin = async (userData) => {
    // 🕵️ Step 1: Figure out if userData is a string or an object
    console.log("🕵️ What did the Auth component send me?", userData);

    const nameToSubmit = typeof userData === 'string' ? userData : userData.username;

    // 🔍 ADD THIS LOG TOO!
    console.log("📦 What am I putting in the username envelope?", nameToSubmit);


    const finalUsername = typeof userData === 'object' ? userData.username : userData;
    const finalPassword = typeof userData === 'object' ? userData.password : "";

    console.log("📤 Sending to Django:", finalUsername); // Check your browser console for this!

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: finalUsername,
          password: finalPassword
        })
      });

      const dataFromMongo = await response.json();

      if (response.ok) {
        localStorage.setItem("current_user", JSON.stringify(dataFromMongo));
        setUser(dataFromMongo);

        // Rehydrate MongoDB state to frontend local context
        if (dataFromMongo.state) {
          setPage(dataFromMongo.state.page || "dashboard");
          setCurrentLevel(dataFromMongo.state.currentLevel || 1);
          setSubject(dataFromMongo.state.subject || null);
          setChapterData(dataFromMongo.state.chapterData || null);
          if (dataFromMongo.state.progress) {
            // Merge default with backend progress
            const safeProgress = {
              Science: {}, Math: {}, English: {}, GK: {},
              ...dataFromMongo.state.progress
            };
            hydrateProgress(safeProgress);
          }
        } else {
          setPage("dashboard");
          hydrateProgress({ Science: {}, Math: {}, English: {}, GK: {} });
        }
        return { success: true };
      } else {
        console.error("❌ Django rejected the login:", dataFromMongo);
        return { success: false, error: dataFromMongo.error || "Login failed" };
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      // Even if it fails, we keep you logged in for testing
      setUser({ username: finalUsername, level: "Level 1", stars: 0 });
      setPage("dashboard");
    }
  };

  const handleLogout = async () => {
    if (user) {
      await saveStateToBackend({ page, currentLevel, subject, chapterData, progress });
    }
    localStorage.removeItem("current_user");
    setUser(null);
    setPage("dashboard");
  };

  const handleComplete = (score) => {
    console.log(`✅ Module complete! Subj: ${subject}, Chapter: ${chapterData?.id}, Score: ${score}`);
    if (subject && chapterData) {
      // 🚨 This needs to trigger a re-render!
      markModuleComplete(subject, chapterData.id, score);

      const levelStars = getStarsForLevel(currentLevel);
      console.log(`⭐ Total level stars evaluated: ${levelStars}`);

      const starsNeededToPass = (currentLevel === 1 || currentLevel === 2) ? 15 : 20;

      // If they got enough stars and passed the quiz (7/10)
      if (levelStars >= starsNeededToPass && score >= 7) {
        if (currentLevel === 1) setPage("level1Success");
        else if (currentLevel === 2) setPage("level2Success");
        else if (currentLevel === 3) setPage("level3Success");
        else if (currentLevel === 4) setPage("level4Success");
        else if (currentLevel === 5) setPage("level5Success"); // 🏆 Just this one line!
      } else {
        // If they aren't done with the level yet, go back to pick another chapter
        setPage("chapterSelection");
      }
    }
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  const activeDataSource =
    currentLevel === 5 ? level5Data :
      currentLevel === 4 ? level4Data :
        currentLevel === 3 ? level3Data :
          currentLevel === 2 ? level2Data :
            lessonsData;

  const earnedStars = getStarsForLevel(currentLevel);
  const starsNeeded = (currentLevel === 1 || currentLevel === 2) ? 15 : 20;
  const isLevelComplete = earnedStars >= starsNeeded;



  const views = {
    dashboard: (
      <div>
        <Dashboard
          user={user}
          activeTheme={activeTheme} // 🚀 Pass the magic paint here!
          onSelectSubject={(subj) => { setSubject(subj); setPage("chapterSelection"); }}
          onOpenProfile={() => setPage("profile")}
        />
      </div>
    ),
    level2Dashboard: (
      <div>
        <Level2Dashboard
          user={user}
          activeTheme={activeTheme} // 🚀 Pass the theme here!
          onSelectSubject={(subj) => { setSubject(subj); setPage("chapterSelection"); }}
          onBackToLevel1={() => { setCurrentLevel(1); setPage("dashboard"); }}
          onOpenProfile={() => setPage("profile")}
        />
      </div>
    ),
    level3Dashboard: (
      <div>
        <Level3Dashboard
          user={user}
          activeTheme={activeTheme} // 🚀 Passing the magic!
          onSelectSubject={(subj) => { setSubject(subj); setPage("chapterSelection"); }}
          onBackToLevel2={() => { setCurrentLevel(2); setPage("level2Dashboard"); }}
        />
      </div>
    ),
    level4Dashboard: (
      <div>
        <Level4Dashboard
          user={user}
          activeTheme={activeTheme} // 👈 Make sure this is here!
          onSelectSubject={(subj) => { setSubject(subj); setPage("chapterSelection"); }}
          onBackToLevel3={() => { setCurrentLevel(3); setPage("level3Dashboard"); }}
        />
      </div>
    ),
    level5Dashboard: (
      <div>
        <Level5Dashboard
          user={user}
          activeTheme={activeTheme} // 👈 This is the secret sauce!
          onSelectSubject={(subj) => { setSubject(subj); setPage("chapterSelection"); }}
          onBackToLevel4={() => { setCurrentLevel(4); setPage("level4Dashboard"); }}
        />
      </div>
    ),

    level1Success: <SuccessScreen level={1} activeTheme={activeTheme} onContinue={() => { setCurrentLevel(2); setPage("level2Dashboard"); }} />,
    level2Success: <SuccessScreen level={2} activeTheme={activeTheme} onContinue={() => { setCurrentLevel(3); setPage("level3Dashboard"); }} />,
    level3Success: <SuccessScreen level={3} activeTheme={activeTheme} onContinue={() => { setPage("level3Dashboard"); }} />,
    level4Success: <SuccessScreen level={4} activeTheme={activeTheme} onContinue={() => { setCurrentLevel(5); setPage("level5Dashboard"); }} />,
    // 🏆 ADD THIS ONE HERE!
    level5Success: (
      <SuccessScreen
        level={5}
        activeTheme={activeTheme} // 👈 This is the missing piece!
        onContinue={() => {
          setCurrentLevel(5);
          setPage("level5Dashboard");
        }}
      />
    ),
    certificate: (
      <Certificate
        user={user}
        activeTheme={activeTheme}
        onBack={() => setPage("level5Dashboard")}
      />
    ),

    // Add this inside your const views = { ... }
    // Add this to your views = { ... } list
    simplifiedQuiz: chapterData && (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{
          backgroundColor: "#FFF3E0",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
          border: "2px dashed #FF9F43"
        }}>
          <h2 style={{ color: "#E67E22", margin: 0 }}>🌟 Practice Mode 🌟</h2>
          <p>Let's try some easier ones together!</p>
        </div>

        <QuizWrapper
          /* This looks for an 'easierQuestions' list in your data */
          chapterData={{
            ...chapterData,
            questions: chapterData.easierQuestions || chapterData.questions
          }}
          onFinish={() => setPage("chapterSelection")}
          onBackToLesson={() => setPage("chapterSelection")}
        />
      </div>
    ),


    profile: (
      <ProfileView
        user={user}
        progress={progress}
        onBack={() => {
          // 🧭 This tells the app exactly which home screen to go to!
          if (currentLevel === 5) setPage("level5Dashboard");
          else if (currentLevel === 4) setPage("level4Dashboard");
          else if (currentLevel === 3) setPage("level3Dashboard");
          else if (currentLevel === 2) setPage("level2Dashboard");
          else setPage("dashboard");
        }}
      />
    ),
    chapterSelection: (
      <ChapterSelection
        subject={subject}
        currentLevel={currentLevel}
        chapters={activeDataSource[subject]}
        activeTheme={activeTheme} // 👈 ADD THIS LINE!
        onSelectChapter={(ch) => { setChapterData(ch); setPage("lesson"); }}
        onBack={() => {
          if (currentLevel === 5) setPage("level5Dashboard"); // Added level 5 back button too!
          else if (currentLevel === 4) setPage("level4Dashboard");
          else if (currentLevel === 3) setPage("level3Dashboard");
          else if (currentLevel === 2) setPage("level2Dashboard");
          else setPage("dashboard");
        }}
      />
    ),
    lesson: chapterData && (
      <LessonWrapper
        chapter={chapterData}
        onBack={() => setPage("chapterSelection")}
        onStartQuiz={() => setPage("quiz")}
        onStartFlashcards={() => setPage("flashcards")}
      />
    ),
    flashcards: chapterData && <FlashcardsWrapper flashcards={chapterData.flashcards} onBack={() => setPage("lesson")} />,
    quiz: (chapterData && chapterData.questions) ? (
      <QuizWrapper
        chapterData={chapterData}
        onFinish={handleComplete}
        onBackToLesson={() => setPage("chapterSelection")}
      />
    ) : (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Searching for your questions... 🔍</h2>
        <button onClick={() => setPage("chapterSelection")}>Go Back and Try Again</button>
      </div>

    ),
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: activeTheme.fontFamily,
      backgroundColor: activeTheme.background
    }}>
      <div style={{ width: "280px", backgroundColor: "#1E293B", color: "white", display: "flex", flexDirection: "column", padding: "30px 20px" }}>

        <div
          onClick={() => setPage("profile")}
          style={{
            display: "flex", alignItems: "center", gap: "15px", padding: "15px",
            backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "15px",
            marginBottom: "30px", border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer"
          }}
        >
          <div style={{
            fontSize: "35px", backgroundColor: "rgba(255, 255, 255, 0.8)", width: "55px", height: "55px",
            display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%"
          }}>
            {user.avatar || "👤"}
          </div>
          <div style={{ textAlign: "left", overflow: "hidden" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#F8FAFC", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.username}
            </div>
            <div style={{ fontSize: "12px", color: Theme.accent, fontWeight: "600" }}>
              View Profile
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: "20px", marginBottom: "30px", textAlign: "center", color: Theme.accent, letterSpacing: "1px" }}>MY ACADEMY</h2>
        {/* 🌈 PASTE THE COLOR CANDY BUTTONS HERE: */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
          {["#FDFBF7", "#E3F2FD", "#E8F5E9", "#FFEBEE"].map((color) => (
            <button
              key={color}
              onClick={() => setCurrentBg(color)}
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: color,
                border: "2px solid rgba(255,255,255,0.2)",
                cursor: "pointer"
              }}
            />
          ))}
        </div>
        <button
          onClick={handleLogout}
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "transparent",
            color: "#ef4444", // Red color for logout
            border: "1px solid #ef4444",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout 🏃💨
        </button>



        <nav style={{ flex: 1 }}>
          {[1, 2, 3, 4, 5].map((lvl) => {
            // Lock only level 5 for now, keep 1-4 unlocked
            let unlocked = true;
            if (lvl === 5) unlocked = isLevel5Unlocked();


            return (
              <div
                key={lvl}
                onClick={() => {
                  if (unlocked) {
                    setCurrentLevel(lvl);
                    // 2. Map each level number to its specific dashboard name
                    const pageNames = {
                      1: "dashboard",
                      2: "level2Dashboard",
                      3: "level3Dashboard",
                      4: "level4Dashboard",
                      5: "level5Dashboard"
                    };
                    setPage(pageNames[lvl]);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  margin: "8px 0",
                  borderRadius: "8px",
                  cursor: unlocked ? "pointer" : "not-allowed",
                  backgroundColor: currentLevel === lvl ? "rgba(255,255,255,0.1)" : "transparent",
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                <span style={{ fontSize: "20px", marginRight: "10px" }}>
                  {unlocked ? "🔓" : "🔒"}
                </span>
                <span style={{ fontWeight: "bold" }}>
                  Level {lvl}
                </span>
              </div>
            );
          })}
        </nav>
      </div>
      <div style={{
        flex: 1,
        overflowY: "auto",
        position: "relative",
        backgroundColor: activeTheme.background, // 🚀 This makes the main area change!
        transition: "background-color 0.4s ease" // Makes the change feel smooth like butter
      }}>

        {/* 🆘 The Struggling Button - Only shows during a real quiz */}
        {page === "quiz" && currentLevel >= 3 && (
          <button
            onClick={() => setPage("simplifiedQuiz")}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "#ff9f43",
              color: "white",
              padding: "10px 20px",
              borderRadius: "50px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              zIndex: 10
            }}
          >
            I'm Struggling 🆘
          </button>
        )}

        {views[page] || <div>Loading...</div>}
      </div>
    </div>
  );
}
export default App;