export const Theme = {
  // --- COLORS ---
  // Changed background to a slightly warmer 'Cream/Off-White' to reduce eye strain
  background: "#FDFBF7", 
  sidebar: "#9b2420",
  accent: "#3498db",
  success: "#2ecc71",
  // Using a soft Dark Grey instead of pure black to stop the 'shimmer' effect
  textMain: "#2C3E50", 
  textMuted: "#64748b",
  
  // --- TYPOGRAPHY ---
  fontFamily: "'Lexend', sans-serif", 
  lineHeight: "1.9", // A tiny bit more space between lines     
  letterSpacing: "0.12em", // Using 'em' helps the spacing stay perfect at any size
  wordSpacing: "0.25em", // ADDED: Extra space between words helps the brain separate them
  fontSize: {
    header: "34px",
    base: "22px", 
    small: "18px" // Made small text a bit bigger for easier reading
  },
  
  // --- LAYOUT ---
  borderRadius: "20px",
  cardShadow: "0 10px 30px rgba(0,0,0,0.08)", 

  // --- COMPONENTS ---
  levelButton: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    fontSize: "28px",
    fontWeight: "600", // Semi-bold is often easier to read than extra-thick Bold
    borderRadius: "20px",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    transition: "transform 0.2s, background-color 0.3s",
    marginBottom: "25px", // More space between buttons
    color: "white" 
  }
};