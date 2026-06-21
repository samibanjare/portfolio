import { useState, useEffect, useRef } from "react";

const THEME = {
  primary: "#39e0ff",     // Cyan glow
  purple: "#7852e6",      // EMO Purple
  dark: "#23252f",        // Off-black body shell
  border: "#4b5563",
};

export default function RobotPet() {
  // Expressions: "NORMAL", "BLINK", "HAPPY", "SURPRISED", "SASSY", "ANNOYED"
  const [expression, setExpression] = useState("NORMAL");
  
  // Ref to track the last time an expression was changed
  const lastChangeTime = useRef(0);

  // Passive automatic blinking state loop when mouse is away
  useEffect(() => {
    const interval = setInterval(() => {
      setExpression((prev) => {
        if (prev === "NORMAL") {
          setTimeout(() => setExpression("NORMAL"), 140);
          return "BLINK";
        }
        return prev;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Fires a new random expression, but throttled so it doesn't change too fast
  const triggerRandomExpression = () => {
    const now = Date.now();
    
    // ⏱️ Lockout Delay: Only allow a change every 450ms
    if (now - lastChangeTime.current < 450) return;
    
    const expressions = ["HAPPY", "SURPRISED", "SASSY", "ANNOYED", "NORMAL"];
    
    // Filter out the current expression so it always transitions to a fresh one
    const availableChoices = expressions.filter(exp => exp !== expression);
    const randomChoice = availableChoices[Math.floor(Math.random() * availableChoices.length)];
    
    lastChangeTime.current = now;
    setExpression(randomChoice);
  };

  const handleMouseLeave = () => {
    setExpression("NORMAL");
  };

  // Advanced dynamic eye calculations keeping the exact cyan color & glow properties
  const getEyeStyle = (side) => {
    const baseStyle = {
      width: "28px",
      background: THEME.primary,
      boxShadow: `0 0 14px ${THEME.primary}`,
      // Smooth out transitions so eyes transform gracefully
      transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      position: "relative",
      transformOrigin: "center"
    };

    switch (expression) {
      case "BLINK":
        return {
          ...baseStyle,
          height: "3px",
          borderRadius: "2px",
          boxShadow: "none"
        };
        
      case "HAPPY":
        return {
          ...baseStyle,
          height: "16px",
          background: "transparent",
          boxShadow: "none",
          borderRadius: "0px",
          borderTop: `5px solid ${THEME.primary}`,
          borderLeft: `5px solid ${THEME.primary}`,
          borderRight: `5px solid ${THEME.primary}`,
          transform: "rotate(45deg)",
          marginTop: "6px",
          filter: `drop-shadow(0 0 6px ${THEME.primary})`
        };
        
      case "SURPRISED":
        return {
          ...baseStyle,
          height: "28px",
          width: "28px",
          borderRadius: "50%",
          boxShadow: `0 0 22px ${THEME.primary}`
        };
        
      case "SASSY":
        if (side === "left") {
          return {
            ...baseStyle,
            height: "5px",
            borderRadius: "3px",
            boxShadow: "none",
            marginTop: "10px"
          };
        }
        return {
          ...baseStyle,
          height: "24px",
          borderRadius: "8px 8px 2px 2px",
          transform: "skewY(-6deg)"
        };
        
      case "ANNOYED":
        return {
          ...baseStyle,
          height: "20px",
          borderRadius: "4px",
          clipPath: "polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)",
          transform: side === "left" ? "rotate(8deg)" : "rotate(-8deg)"
        };
        
      case "NORMAL":
      default:
        return {
          ...baseStyle,
          height: "28px",
          borderRadius: "8px"
        };
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "10px", userSelect: "none" }}>
      <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px", letterSpacing: "1px" }}>
        MY COMPANION
      </div>

      {/* Robot Frame - Tracks movement smoothly with time tracking restrictions */}
      <div 
        onMouseMove={triggerRandomExpression}
        onMouseLeave={handleMouseLeave}
        style={{ 
          margin: "0 auto", 
          width: "180px", 
          position: "relative", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        
        {/* HEADPHONE ARCH OVERLAY */}
        <div style={{
          position: "absolute",
          top: "-12px",
          width: "164px",
          height: "44px",
          border: `9px solid ${THEME.purple}`,
          borderBottom: "none",
          borderRadius: "44px 44px 0 0",
          zIndex: 5,
          boxSizing: "border-box"
        }}>
          <div style={{ position: "absolute", left: "-8px", top: "15px", width: "14px", height: "7px", backgroundColor: THEME.primary, borderRadius: "3px" }} />
          <div style={{ position: "absolute", right: "-8px", top: "15px", width: "14px", height: "7px", backgroundColor: THEME.primary, borderRadius: "3px" }} />
        </div>

        {/* LEFT EARPAD */}
        <div style={{
          position: "absolute",
          left: "-1px",
          top: "34px",
          width: "28px",
          height: "44px",
          background: THEME.purple,
          borderLeft: `3px solid ${THEME.primary}`,
          borderRadius: "12px",
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ width: "12px", height: "12px", background: "#111318", borderRadius: "50%" }} />
        </div>

        {/* RIGHT EARPAD */}
        <div style={{
          position: "absolute",
          right: "-1px",
          top: "34px",
          width: "28px",
          height: "44px",
          background: THEME.purple,
          borderRight: `3px solid ${THEME.primary}`,
          borderRadius: "12px",
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ width: "12px", height: "12px", background: "#111318", borderRadius: "50%" }} />
        </div>

        {/* MAIN HEAD CORE CONTAINER */}
        <div style={{
          width: "146px",
          height: "118px",
          background: THEME.dark,
          borderRadius: "36px",
          padding: "10px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          position: "relative",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          borderBottom: "4px solid #16171e"
        }}>
          {/* SCREEN FACEPLATE BEZEL */}
          <div style={{
            width: "100%",
            height: "100%",
            background: "#0a0b0e",
            borderRadius: "26px",
            border: "4px solid #575b6e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "18px",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, width: "18px", height: "8px", background: THEME.dark, borderRadius: "0 0 5px 5px" }} />

            {/* LEFT EYE */}
            <div style={getEyeStyle("left")} />

            {/* RIGHT EYE */}
            <div style={getEyeStyle("right")} />
          </div>
        </div>

        {/* MECHANICAL LEGS */}
        <div style={{ display: "flex", gap: "20px", marginTop: "-8px", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "26px", height: "36px", background: THEME.dark, borderRadius: "6px", borderBottom: "6px solid #14151b" }} />
            <div style={{ width: "56px", height: "18px", background: THEME.dark, borderRadius: "10px 10px 4px 4px", borderBottom: `5px solid ${THEME.purple}`, marginTop: "-4px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "26px", height: "36px", background: THEME.dark, borderRadius: "6px", borderBottom: "6px solid #14151b" }} />
            <div style={{ width: "56px", height: "18px", background: THEME.dark, borderRadius: "10px 10px 4px 4px", borderBottom: `5px solid ${THEME.purple}`, marginTop: "-4px" }} />
          </div>
        </div>

        {/* CHARGING BASE */}
        <div style={{
          width: "190px",
          height: "10px",
          background: "#4b5263",
          borderRadius: "10px",
          marginTop: "-2px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
          borderBottom: "3px solid #31343f",
          zIndex: 0
        }} />
      </div>

      {/* Dynamic mood tracking text string output */}
      <div style={{ 
        marginTop: "16px", 
        fontSize: "14px", 
        fontWeight: "bold", 
        color: "#67e8f9",
        letterSpacing: "2px"
      }}>
        {expression === "HAPPY" && "HAPPY ^_~"}
        {expression === "SURPRISED" && "SHOCK O_O"}
        {expression === "SASSY" && "SASSY ._~"}
        {expression === "ANNOYED" && "ANNOYED >_<"}
        {(expression === "NORMAL" || expression === "BLINK") && "NEXUS"}
      </div>
    </div>
  );
}

