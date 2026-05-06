export const speak = (text) => {
  window.speechSynthesis.cancel(); // Stop any current speaking
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85; // Slightly slower for better comprehension
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};
