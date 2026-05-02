import { useState, useEffect } from 'react';

const useTracker = (contentID) => {
  const [metrics, setMetrics] = useState({
    cursorX: 0,
    cursorY: 0,
    dwellTime: 0,
    clickLatency: 0,
    startTime: Date.now()
  });

  const sendMetricsToBackend = async (data) => {
    try {
      await fetch('http://127.0.0.1:8000/api/log/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user')).username : 'guest',
          metric: 'userInteraction',
          value: data.dwellTime,
          id: contentID,
          timestamp: new Date().toISOString(),
          cursorPosition: { x: data.cursorX, y: data.cursorY }
        })
      });
    } catch (err) {
      console.error('Failed to send metrics to backend:', err);
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      setMetrics(prev => ({
        ...prev,
        cursorX: e.clientX,
        cursorY: e.clientY,
        dwellTime: Date.now() - prev.startTime
      }));
    };

    const handleClick = () => {
      console.log(`ML Data Logged for ${contentID}:`, metrics);
      // Send data to backend on click
      sendMetricsToBackend(metrics);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('click', handleClick);
    };
  }, [contentID, metrics]);

  return metrics;
};

export default useTracker;