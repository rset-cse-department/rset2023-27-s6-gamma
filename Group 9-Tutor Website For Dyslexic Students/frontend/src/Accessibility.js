import React from 'react';

const AccessibilitySettings = ({ settings, setSettings, onDone }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <div style={settingsCard}>
        <h2 style={{ marginBottom: '30px' }}>Settings ⚙️</h2>

        {/* 1. Font Size Control [cite: 82, 203-206] */}
        <div style={section}>
          <p>Font Size</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {['18px', '24px', '32px'].map(size => (
              <button 
                key={size}
                onClick={() => setSettings({...settings, fontSize: size})}
                style={{ ...sizeBtn, border: settings.fontSize === size ? '3px solid #6c5ce7' : '1px solid #ccc' }}
              >
                {size === '18px' ? 'A' : size === '24px' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Color Overlay [cite: 84, 209-213] */}
        <div style={section}>
          <p>Color Overlay</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => setSettings({...settings, theme: 'default', contrast: false})} style={themeBtn}>Default</button>
            <button onClick={() => setSettings({...settings, theme: 'cream', contrast: false})} style={{ ...themeBtn, backgroundColor: '#FFF9E3' }}>Cream</button>
          </div>
        </div>

        {/* 3. High Contrast Toggle [cite: 83, 216] */}
        <div style={section}>
          <p>High Contrast</p>
          <button 
            onClick={() => setSettings({...settings, contrast: !settings.contrast, theme: 'default'})}
            style={{ ...themeBtn, backgroundColor: settings.contrast ? '#FFFF00' : '#000', color: settings.contrast ? '#000' : '#fff' }}
          >
            {settings.contrast ? 'Turn Off' : 'Turn On'}
          </button>
        </div>

        <button onClick={onDone} style={doneBtn}>Done</button>
      </div>
    </div>
  );
};

// --- STYLES ---
const settingsCard = { background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' };
const section = { marginBottom: '25px', padding: '15px', borderBottom: '1px solid #eee' };
const sizeBtn = { padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', background: '#f8f9fa' };
const themeBtn = { padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #ccc', fontWeight: 'bold' };
const doneBtn = { marginTop: '20px', width: '100%', padding: '15px', borderRadius: '25px', border: 'none', background: '#6c5ce7', color: 'white', fontWeight: 'bold', cursor: 'pointer' };

export default AccessibilitySettings;