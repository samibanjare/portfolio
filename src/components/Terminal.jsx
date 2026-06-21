import { useState, useEffect, useRef } from "react";
import { CONTENT } from "../data/profile.js";
import RocketGame from "./SnakeGame.jsx";
import RobotPet from "./RobotPet.jsx";
import profileImg from "../assets/profile_img.jpeg";
import { useTerminalCommands } from "../hooks/useTerminal.js";
import { MetricsPanel } from "./MatrixPanel.jsx";

// ====================== KALI LINUX THEME ======================
export const THEME = {
  fontFamily: "'Hack', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
  fontSize: "13.8px",
  primary: "#00ff9f",
  dim: "#00cc7a",
  bg: "#0d0f11",
  panelBg: "#121417",
  border: "#1f2924",
  text: "#a1e8c9",
};

// Dynamic Metrics Hook
function useSystemMetric(initial = 50, variance = 12, speed = 900) {
  const [value, setValue] = useState(initial);
  const [history, setHistory] = useState(Array.from({ length: 40 }, () => initial));

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => {
        let next = prev + (Math.random() - 0.5) * variance;
        if (Math.random() < 0.1) next += Math.random() * 22;
        return Math.max(8, Math.min(97, parseFloat(next.toFixed(1))));
      });
    }, speed);
    return () => clearInterval(interval);
  }, [variance, speed]);

  useEffect(() => {
    setHistory(prev => [...prev.slice(1), value]);
  }, [value]);

  return { current: value, history };
}

export default function PortfolioTerminal() {
  const [history, setHistory] = useState([
    "Welcome to my Linux-style portfolio!",
    "Type 'help' to see available commands.",
    ""
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showRocketGame, setShowRocketGame] = useState(false);
  const [expression, setExpression] = useState("NORMAL");

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const cpu = useSystemMetric(42, 18, 950);
  const network = useSystemMetric(47, 28, 800);

  const { processCommand } = useTerminalCommands(CONTENT, cpu, network, setHistory, setShowRocketGame);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, input]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showRocketGame) {
        setShowRocketGame(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showRocketGame]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input);
      setCommandHistory(prev => [input, ...prev]);
      setInput("");
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const idx = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(idx);
        setInput(commandHistory[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInput(commandHistory[historyIndex - 1]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const renderLineWithLinks = (text, theme) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    if (!text.match(urlRegex)) return text;

    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const href = part.startsWith('http') ? part : `https://${part}`;
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.primary,
              textDecoration: "underline",
              cursor: "pointer"
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="portfolio-root" style={{
      background: THEME.bg,
      color: THEME.primary,
      fontFamily: THEME.fontFamily,
      fontSize: THEME.fontSize,
      width: "100vw",
      overflowX: "hidden",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      boxSizing: "border-box"
    }}>
      <div className="grid-layout">

        {/* LEFT PANEL */}
        <div className="side-panel left-panel" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Panel theme={THEME}>
            <div style={{ fontSize: "32px", fontWeight: 500 }}>
              {new Date().toLocaleTimeString("en-US", { hour12: false })}
            </div>
            <div style={{ color: THEME.dim, fontSize: "14px", marginTop: "4px" }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div style={{ color: THEME.dim, fontSize: "12px" }}>
              Kali Linux Portfolio
            </div>
          </Panel>

          <Panel theme={THEME} title="BOT MOOD STATUS">
            <Row 
              label="CORE EMOTION" 
              value={
                expression === "HAPPY" ? "ECSTATIC" :
                expression === "SURPRISED" ? "SHOCKED" :
                expression === "SASSY" ? "SMUG" :
                expression === "ANNOYED" ? "IRRITATED" : "STABLE"
              } 
              theme={THEME} 
              valueColor={expression === "ANNOYED" ? "#ff4a4a" : THEME.primary}
            />
          </Panel>

          <Panel theme={THEME} title="MEMORY / BOT" className="pet-panel" style={{ display: "flex", flexDirection: "column" }}>
            <RobotPet expression={expression} setExpression={setExpression}/>
          </Panel>

          <Panel theme={THEME} title="TRY THESE">
            <div style={{ 
              display: "flex", 
              flexDirection: "row", 
              flexWrap: "wrap",
              gap: "8px 12px", 
              color: THEME.dim, 
              fontSize: "12px", 
              lineHeight: 1.6 
            }}>
              <span>cat about,</span>
              <span>neofetch,</span>
              <span>metrics,</span>
              <span>help</span>
            </div>
          </Panel>
        </div>

        {/* CENTER TERMINAL */}
        <div className="main-terminal" style={{
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${THEME.border}`,
          background: THEME.panelBg,
          overflow: "hidden",
          minHeight: "350px"
        }}>
          {/* BANNER ROW */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            padding: "16px 16px 0 16px",
            overflowX: "auto"
          }}>
            <img 
              src={profileImg} 
              alt="Sami Banjare"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: `2px solid ${THEME.primary}`,
                objectFit: "cover",
                flexShrink: 0
              }}
            />
            <pre style={{
              margin: 0,
              color: THEME.primary,
              fontFamily: "monospace",
              whiteSpace: "pre",
              fontSize: "10px",
              lineHeight: "1.2"
            }}>
{`
  ███████╗ █████╗ ███╗   ███╗██╗  ██████╗  █████╗ ███╗   ██╗  ██╗ █████╗ ██████╗ ███████╗
  ██╔════╝██╔══██╗████╗ ████║██║  ██╔══██╗██╔══██╗████╗  ██║  ██║██╔══██╗██╔══██╗██╔════╝
  ███████╗███████║██╔████╔██║██║  ██████╔╝███████║██╔██╗ ██║  ██║███████║██████╔╝█████╗  
  ╚════██║██╔══██║██║╚██╔╝██║██║  ██╔══██╗██╔══██║██║╚██╗██║  ██║██╔══██║██╔══██╗██╔══╝  
  ███████║██║  ██║██║ ╚═╝ ██║██║  ██████╔╝██║  ██║██║ ╚████║████║██║  ██║██║  ██║███████╗
  ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
`}
            </pre>
          </div>

          <div style={{ padding: "8px 12px", borderBottom: `1px solid ${THEME.border}`, color: THEME.dim, fontSize: "12px" }}>
            portfolio@samibanjare — Interactive Terminal
          </div>

          <div ref={terminalRef} style={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            lineHeight: "1.65",
            display: "flex",
            flexDirection: "column"
          }}>
            {history.map((line, i) => {
              if (line === null || line === undefined) return null;
              if (Array.isArray(line)) {
                return line.map((subLine, subIdx) => (
                  <div key={`sub-${i}-${subIdx}`} style={{ whiteSpace: "pre-wrap", color: THEME.text }}>
                    {renderLineWithLinks(String(subLine), THEME)}
                  </div>
                ));
              }
              const lineStr = typeof line === "string" ? line : String(line);
              const isPrompt = lineStr.includes("@samibanjare");
              return (
                <div key={i} style={{
                  whiteSpace: "pre-wrap",
                  color: isPrompt ? THEME.primary : THEME.text,
                  wordBreak: "break-word"
                }}>
                  {renderLineWithLinks(lineStr, THEME)}
                </div>
              );
            })}
            <form onSubmit={handleSubmit} style={{ display: "flex", marginTop: "4px" }}>
              <span style={{ color: THEME.primary, marginRight: "8px", flexShrink: 0 }}>
                portfolio@samibanjare~$ 
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: THEME.primary,
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  outline: "none",
                  padding: 0
                }}
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="side-panel right-panel" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Panel theme={THEME} title="FEATURED WORK">
            {/* ... your existing featured work content ... */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                background: `linear-gradient(135deg, ${THEME.primary}22, rgba(0,0,0,0.4))`,
                border: `1px solid ${THEME.primary}44`,
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: THEME.primary
                }}>
                  <span style={{ fontSize: "24px", marginBottom: "4px" }}>🖼️</span>
                  <span style={{ fontSize: "11px", letterSpacing: "1px", fontWeight: "bold" }}>PROJECT_PREVIEW.PNG</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", lineHeight: 1.2 }}>AI-Learning-Platform</div>
                  <div style={{ fontSize: "11px", color: THEME.dim, marginTop: "4px" }}>Figma / WebGL / React</div>
                </div>
                <a href="#view" style={{ 
                  fontSize: "11px", color: THEME.primary, textDecoration: "none", border: `1px solid ${THEME.primary}`, 
                  padding: "5px 10px", borderRadius: "3px", background: `${THEME.primary}11`, fontWeight: 500
                }}>
                  VIEW CASE
                </a>
              </div>
            </div>
          </Panel>

          <Panel theme={THEME} title="PROJECT DECK" className="deck-panel" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%" }}>
              <div style={{ fontSize: "11px", color: THEME.dim }}>RECENT RENDERS & SHOTS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", flex: 1 }}>
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: `1px dashed ${THEME.dim}44`,
                      borderRadius: "4px",
                      display: "flex",
                      minHeight: "60px",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                  >
                    <span style={{ fontSize: "10px", color: THEME.dim }}>SHOT_0{item}.JPG</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Real Metrics Panel */}
          <MetricsPanel theme={THEME} />
        </div>
      </div>

      {/* ROCKET GAME POPUP */}
      {showRocketGame && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.92)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            border: `2px solid ${THEME.primary}`, background: THEME.panelBg,
            padding: "20px", borderRadius: "8px", maxWidth: "620px", width: "90%"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: THEME.primary }}>🚀 ROCKET DEFENSE</h3>
              <button onClick={() => setShowRocketGame(false)} style={{
                background: "transparent", border: `1px solid ${THEME.border}`,
                color: THEME.primary, padding: "4px 12px", cursor: "pointer"
              }}>
                CLOSE [ESC]
              </button>
            </div>
            <RocketGame />
            <div style={{ textAlign: "center", marginTop: "12px", fontSize: "11px", color: THEME.dim }}>
              Destroy the asteroids before they hit your rocket!
            </div>
          </div>
        </div>
      )}

      {/* STYLING */}
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${THEME.border}; border-radius: 3px; }
        
        @media (min-width: 869px) {
          .portfolio-root { height: 100vh; }
          .grid-layout {
            display: grid;
            grid-template-columns: minmax(280px, 320px) 1fr minmax(280px, 320px);
            gap: 10px;
            flex: 1;
            minHeight: 0;
            height: 100%;
          }
          .side-panel { height: 100%; max-height: 100vh; overflow-y: auto; }
          .pet-panel, .deck-panel { flex: 1; }
          .main-terminal { height: 100%; }
        }

        @media (max-width: 868px) {
          .portfolio-root { height: auto; overflow-y: auto; }
          .grid-layout { display: flex; flex-direction: column; gap: 15px; width: 100%; }
          .side-panel, .main-terminal { width: 100%; height: auto; }
          .main-terminal { order: -1; }
        }
      `}</style>
    </div>
  );
}

// Reusable Components
function Panel({ children, theme, title, style, className }) {
  return (
    <div className={className} style={{
      border: `1px solid ${theme.border}`,
      background: theme.panelBg,
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      height: "fit-content",
      ...style
    }}>
      {title && <div style={{ color: theme.dim, fontSize: "10px", letterSpacing: "1px", marginBottom: "10px" }}>{title}</div>}
      {children}
    </div>
  );
}

function Row({ label, value, theme, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "12.5px" }}>
      <span style={{ color: theme.dim }}>{label}</span>
      <span style={{ color: valueColor || theme.text }}>{value}</span>
    </div>
  );
}