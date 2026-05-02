import React from 'react';

const Settings = ({ setFontSize, setTheme, setOverlay }) => {
  return (
    <div className="settings-container">
      <h2>Accessibility Settings</h2>
      
      {/* Font Scaling [cite: 83] */}
      <div className="setting-group">
        <p>Font Size</p>
        <button onClick={() => setFontSize('small')}>A</button>
        <button onClick={() => setFontSize('medium')}>A</button>
        <button onClick={() => setFontSize('large')}>A</button>
      </div>

      {/* Color Overlays [cite: 85] */}
      <div className="setting-group">
        <p>Color Overlay</p>
        <button style={{backgroundColor: '#FFFDD0'}} onClick={() => setOverlay('cream')}>Default</button>
        <button style={{backgroundColor: '#FFFFFF', border: '1px solid #000'}} onClick={() => setOverlay('white')}>None</button>
      </div>

      {/* High Contrast Themes [cite: 84] */}
      <div className="setting-group">
        <label>
          <input type="checkbox" onChange={(e) => setTheme(e.target.checked ? 'high-contrast' : 'standard')} />
          High Contrast Mode
        </label>
      </div>
    </div>
  );
};

export default Settings;