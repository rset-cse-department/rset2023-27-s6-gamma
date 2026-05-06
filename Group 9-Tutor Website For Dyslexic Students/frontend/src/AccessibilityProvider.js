import React, { createContext, useState, useEffect } from 'react';

export const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // States based on your UI Design requirements [cite: 45, 110]
  const [fontSize, setFontSize] = useState(18); // Default large for readability
  const [theme, setTheme] = useState('cream'); // Cream reduces visual stress 
  const [fontFamily, setFontFamily] = useState('Arial'); // Sans-serif preferred

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, theme, setTheme, fontFamily, setFontFamily }}>
      <div style={{ 
        fontSize: `${fontSize}px`, 
        backgroundColor: theme === 'cream' ? '#FFFDD0' : '#FFFFFF',
        fontFamily: fontFamily,
        minHeight: '100vh',
        color: '#333' // Soft black for better contrast without glare
      }}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};