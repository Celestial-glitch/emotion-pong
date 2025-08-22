import React, { useEffect, useRef, useState, useCallback } from "react";

interface EmotionPongProps {
  detectedEmotion: string;
}

const EmotionPong: React.FC<EmotionPongProps> = ({
  detectedEmotion = "neutral",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Responsive canvas dimensions - matched to webcam size
  const [canvasSize, setCanvasSize] = useState({
    width: 600,
    height: 450,
  });

  // Calculate responsive canvas size - same as webcam
  useEffect(() => {
    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 768;
      const availableWidth = Math.min(
        window.innerWidth - 40,
        isMobile ? 350 : 600
      );
      const aspectRatio = 4 / 3; // Same as webcam (640/480)

      const width = availableWidth;
      const height = width / aspectRatio;

      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const paddleWidth = canvasSize.width * 0.167; // Proportional to canvas width
  const paddleHeight = 12;
  const paddleY = canvasSize.height - paddleHeight - 15;
  const paddleSpeed = canvasSize.width * 0.01;

  const [paddleX, setPaddleX] = useState((canvasSize.width - paddleWidth) / 2);
  const [ball, setBall] = useState({
    x: canvasSize.width / 2,
    y: canvasSize.height / 2,
    dx: 3,
    dy: -3,
    radius: 8,
  });

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(true);
  const [gameTime, setGameTime] = useState(0);
  const [highScore, setHighScore] = useState(0); // Removed localStorage

  // Update game elements when canvas size changes
  useEffect(() => {
    setPaddleX((canvasSize.width - paddleWidth) / 2);
    setBall((prev) => ({
      ...prev,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
    }));
  }, [canvasSize, paddleWidth]);

  // Track game time
  useEffect(() => {
    if (!isGameOver && !isPaused && gameStarted) {
      const timer = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGameOver, isPaused, gameStarted]);

  // Sound effect functions
  const playSound = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "square") => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContextRef.current.currentTime
      );
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + duration
      );

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    },
    []
  );

  const resetBall = () => {
    setBall({
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      dx: 3,
      dy: -3,
      radius: 8,
    });
  };

  useEffect(() => {
    if (isGameOver || isPaused || !gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      // Clear canvas with pure black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw clean thin white grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);

      // Vertical lines
      for (let i = 0; i <= canvasSize.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i <= canvasSize.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize.width, i);
        ctx.stroke();
      }

      // Draw paddle with modern glow effect
      ctx.shadowColor = "#00ff88";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#00ff88";
      ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

      // Paddle inner highlight
      ctx.shadowBlur = 5;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(paddleX + 2, paddleY + 2, paddleWidth - 4, paddleHeight - 4);

      ctx.shadowBlur = 0;

      // Draw ball with clean glow effect
      ctx.shadowColor = "#ff0066";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#ff0066";
      ctx.fill();
      ctx.closePath();

      // Ball inner core
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.closePath();

      ctx.shadowBlur = 0;
    };

    const update = () => {
      // Paddle Movement based on emotion
      if (
        detectedEmotion === "happy" &&
        paddleX + paddleWidth < canvasSize.width
      ) {
        setPaddleX((prev) => prev + paddleSpeed);
      } else if (detectedEmotion === "surprised" && paddleX > 0) {
        setPaddleX((prev) => prev - paddleSpeed);
      }

      // Ball Movement
      let newX = ball.x + ball.dx;
      let newY = ball.y + ball.dy;

      // Wall collision
      if (newX + ball.radius > canvasSize.width || newX - ball.radius < 0) {
        ball.dx *= -1;
        playSound(200, 0.1);
      }
      if (newY - ball.radius < 0) {
        ball.dy *= -1;
        playSound(300, 0.1);
      }

      // Paddle Collision
      if (
        newY + ball.radius > paddleY &&
        newX > paddleX - ball.radius &&
        newX < paddleX + paddleWidth + ball.radius &&
        ball.dy > 0
      ) {
        ball.dy *= -1;
        // Add some randomness to the ball direction
        ball.dx += (Math.random() - 0.5) * 0.5;
        setScore((prev) => prev + 1);
        playSound(400, 0.2);
      }

      // Ball missed paddle
      if (newY + ball.radius > canvasSize.height) {
        setLives((prev) => {
          const updated = prev - 1;
          if (updated <= 0) {
            setIsGameOver(true);
            // Update high score
            if (score > highScore) {
              setHighScore(score);
            }
            playSound(150, 1, "sawtooth");
          } else {
            playSound(180, 0.5);
          }
          return updated;
        });
        resetBall();
        return;
      }

      setBall((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));

      draw();
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    detectedEmotion,
    paddleX,
    ball,
    isGameOver,
    isPaused,
    gameStarted,
    playSound,
    score,
    highScore,
    canvasSize,
    paddleWidth,
    paddleY,
    paddleSpeed,
  ]);

  const handlePause = () => {
    setIsPaused(!isPaused);
    playSound(350, 0.2);
  };

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setGameTime(0);
    resetBall();
    playSound(450, 0.3);
  };

  const getEmotionColor = () => {
    switch (detectedEmotion) {
      case "happy":
        return "#00ff88";
      case "surprised":
        return "#ff6b00";
      case "sad":
        return "#0066ff";
      case "angry":
        return "#ff0066";
      default:
        return "#888888";
    }
  };

  const getEmotionIcon = () => {
    switch (detectedEmotion) {
      case "happy":
        return "😊";
      case "surprised":
        return "😲";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      default:
        return "😐";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getScoreRating = () => {
    if (score >= 20)
      return { text: "LEGENDARY NEURAL MASTER", color: "#FFD700", icon: "🏆" };
    if (score >= 15)
      return { text: "NEURAL EXPERT", color: "#FF6B35", icon: "🥇" };
    if (score >= 10)
      return { text: "EMOTION SPECIALIST", color: "#00FF88", icon: "🥈" };
    if (score >= 5)
      return { text: "NEURAL TRAINEE", color: "#00BFFF", icon: "🥉" };
    return { text: "NEURAL NOVICE", color: "#888888", icon: "🎯" };
  };

  // Full-screen Game Over display
  if (isGameOver) {
    const rating = getScoreRating();
    const isNewHighScore = score === highScore && score > 0;

    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)",
          fontFamily: '"Orbitron", monospace',
          color: "#ffffff",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap");
        `}</style>

        <div
          className="text-center mb-4"
          style={{
            fontSize: "clamp(2rem, 8vw, 6rem)",
            fontWeight: 900,
            color: "#ff0066",
            letterSpacing: "0.1em",
            textShadow: "0 0 20px rgba(255, 0, 102, 0.8)",
          }}
        >
          SYSTEM FAILURE
        </div>

        <div
          className="bg-dark bg-opacity-75 p-4 rounded text-center mb-4"
          style={{
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            minWidth: "300px",
          }}
        >
          {isNewHighScore && (
            <div className="badge bg-warning text-dark mb-3 p-2">
              🏆 NEW HIGH SCORE! 🏆
            </div>
          )}

          <div className="h5 text-secondary mb-2">Final Score</div>
          <div
            className="h1 mb-3"
            style={{
              color: "#00ff88",
              textShadow: "0 0 15px rgba(0, 255, 136, 0.6)",
            }}
          >
            {score.toString().padStart(4, "0")}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-4">
              <div className="h5 text-light">{formatTime(gameTime)}</div>
              <div className="small text-muted">TIME</div>
            </div>
            <div className="col-4">
              <div className="h5 text-light">
                {highScore.toString().padStart(4, "0")}
              </div>
              <div className="small text-muted">BEST</div>
            </div>
            <div className="col-4">
              <div className="h5 text-light">
                {Math.round((score / gameTime) * 60) || 0}
              </div>
              <div className="small text-muted">SCORE/MIN</div>
            </div>
          </div>

          <div className="text-center mb-3">
            <div style={{ fontSize: "2rem" }}>{rating.icon}</div>
            <div
              style={{
                color: rating.color,
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "uppercase",
              }}
            >
              {rating.text}
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 flex-wrap justify-content-center">
          <button
            onClick={handleRestart}
            className="btn btn-outline-light px-4 py-2"
            style={{ fontFamily: '"Orbitron", monospace' }}
          >
            Restart Game
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline-light px-4 py-2"
            style={{ fontFamily: '"Orbitron", monospace' }}
          >
            Main Menu
          </button>
        </div>
      </div>
    );
  }

  // Regular game display (when not game over)
  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap");
        .shared-bg {
          background: #000 !important;
        }
        @media (max-width: 991.98px) {
          .emotion-pong-main {
            min-height: 0 !important;
            height: 100% !important;
            width: 100% !important;
            padding: 0 !important;
          }
        }
        @media (min-width: 992px) {
          .emotion-pong-main {
            min-height: 100vh;
            padding: 10px;
          }
        }
      `}</style>
      <div
        className="d-flex flex-column align-items-center w-100 shared-bg emotion-pong-main"
        style={{
          fontFamily: '"Orbitron", monospace',
          color: "#ffffff",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="text-center mb-3">
          <div
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "4px",
              color: "#ffffff",
              textShadow:
                "2px 2px 0px #00ff88, 0 0 10px rgba(0, 255, 136, 0.5)",
            }}
          >
            EMOTION PONG
          </div>
          <div
            className="text-muted"
            style={{
              fontSize: "clamp(0.7rem, 2vw, 1rem)",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Neural Interface Protocol
          </div>
        </div>

        {gameStarted && (
          <>
            <div
              className="d-flex justify-content-between w-100 mb-3 p-3 bg-dark bg-opacity-50 rounded"
              style={{
                maxWidth: `${canvasSize.width}px`,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="text-center flex-fill">
                <div className="small text-muted">SCORE</div>
                <div className="h5 text-light">
                  {score.toString().padStart(4, "0")}
                </div>
              </div>
              <div className="text-center flex-fill">
                <div className="small text-muted">LIVES</div>
                <div className="h5 text-light">{"♥".repeat(lives)}</div>
              </div>
              <div className="text-center flex-fill">
                <div className="small text-muted">TIME</div>
                <div className="h5 text-light">{formatTime(gameTime)}</div>
              </div>
              <div className="text-center flex-fill">
                <div className="small text-muted">STATUS</div>
                <div className="h6 text-light">
                  {isGameOver ? "GAME OVER" : isPaused ? "PAUSED" : "ACTIVE"}
                </div>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="border rounded mb-3"
              style={{
                border: "2px solid rgba(255, 255, 255, 0.2) !important",
                boxShadow: "0 0 30px rgba(0, 0, 0, 0.8)",
                background: "#000000",
                maxWidth: "100%",
                height: "auto",
              }}
            />

            <div className="d-flex gap-3 flex-wrap justify-content-center">
              <button
                onClick={handlePause}
                className="btn btn-outline-light px-3 py-2"
                disabled={isGameOver}
                style={{ fontFamily: '"Orbitron", monospace' }}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={handleRestart}
                className="btn btn-outline-danger px-3 py-2"
                style={{ fontFamily: '"Orbitron", monospace' }}
              >
                Restart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EmotionPong;
