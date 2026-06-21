import { useState, useEffect, useRef, useCallback } from "react";

const THEME = {
  primary: "#00ff9f",
  dim: "#00cc7a",
  border: "#1f2924",
  danger: "#ff5555",
};

export default function RocketGame() {
  const [rocketPos, setRocketPos] = useState(7); // x position (0-14)
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gridWidth = 15;
  const gridHeight = 12;
  const gameSpeed = 180;
  const gameRef = useRef(null);

  // Generate new asteroid
  const spawnAsteroid = useCallback(() => {
    const x = Math.floor(Math.random() * gridWidth);
    setAsteroids(prev => [...prev, { x, y: 0 }]);
  }, [gridWidth]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      // Move asteroids down
      setAsteroids(prev => {
        const newAsteroids = prev
          .map(ast => ({ ...ast, y: ast.y + 1 }))
          .filter(ast => ast.y < gridHeight);

        // Check collision with rocket
        const hit = newAsteroids.some(ast => 
          ast.y === gridHeight - 1 && ast.x === rocketPos
        );

        if (hit) {
          setGameOver(true);
          return newAsteroids;
        }

        return newAsteroids;
      });

      setScore(s => s + 1);

      // Spawn new asteroid randomly
      if (Math.random() < 0.4) spawnAsteroid();
    }, gameSpeed);

    return () => clearInterval(interval);
  }, [rocketPos, gameOver, isPaused, spawnAsteroid]);

  const moveRocket = (newPos) => {
    if (gameOver || isPaused) return;
    setRocketPos(Math.max(0, Math.min(gridWidth - 1, newPos)));
  };

  const handleKeyDown = (e) => {
    if (gameOver && e.key.toLowerCase() === 'r') {
      resetGame();
      return;
    }

    if (e.key === ' ' || e.key.toLowerCase() === 'p') {
      setIsPaused(p => !p);
      return;
    }

    if (gameOver || isPaused) return;

    switch (e.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        moveRocket(rocketPos - 1);
        break;
      case "ArrowRight":
      case "d":
      case "D":
        moveRocket(rocketPos + 1);
        break;
      default:
        break;
    }
  };

  const resetGame = () => {
    setRocketPos(7);
    setAsteroids([]);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rocketPos, gameOver, isPaused]);

  return (
    <div style={{ textAlign: "center" }} tabIndex={0}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        fontSize: "12px", 
        color: THEME.dim, 
        marginBottom: "8px" 
      }}>
        <span>ROCKET DEFENSE</span>
        <span>Score: <span style={{ color: THEME.primary }}>{score}</span></span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
        gap: "1px",
        background: "#0a0c0e",
        padding: "6px",
        border: `2px solid ${THEME.border}`,
        width: "fit-content",
        margin: "0 auto"
      }}>
        {Array.from({ length: gridWidth * gridHeight }).map((_, i) => {
          const x = i % gridWidth;
          const y = Math.floor(i / gridWidth);

          const isRocket = y === gridHeight - 1 && x === rocketPos;
          const isAsteroid = asteroids.some(a => a.x === x && a.y === y);

          return (
            <div
              key={i}
              style={{
                width: "18px",
                height: "18px",
                background: isRocket 
                  ? "#00ff9f" 
                  : isAsteroid 
                    ? THEME.danger 
                    : "#1a2420",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                boxShadow: isRocket ? "0 0 8px #00ff9f" : "none",
              }}
            >
              {isRocket ? "▲" : isAsteroid ? "☄" : ""}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "10px", fontSize: "11px", color: THEME.dim }}>
        ← → or A D • P to Pause • R to Restart
      </div>

      {gameOver && (
        <div style={{ 
          marginTop: "8px", 
          color: "#ff5555", 
          fontWeight: "bold" 
        }}>
          MISSION FAILED — Press R to try again
        </div>
      )}

      {isPaused && !gameOver && (
        <div style={{ marginTop: "8px", color: THEME.primary }}>
          PAUSED — Press P to resume
        </div>
      )}
    </div>
  );
}