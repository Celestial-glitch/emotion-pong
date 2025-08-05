import React, { useEffect, useRef, useState, useCallback } from "react";

interface EmotionPongProps {
  detectedEmotion: string;
}

const EmotionPong: React.FC<EmotionPongProps> = ({ detectedEmotion = "neutral" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const canvasWidth = 600;
  const canvasHeight = 400;
  const paddleWidth = 100;
  const paddleHeight = 12;
  const paddleY = canvasHeight - paddleHeight - 15;
  const paddleSpeed = 6;

  const [paddleX, setPaddleX] = useState((canvasWidth - paddleWidth) / 2);
  const [ball, setBall] = useState({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
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
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('emotionPongHighScore');
    return saved ? parseInt(saved) : 0;
  });

  // Track game time
  useEffect(() => {
    if (!isGameOver && !isPaused && gameStarted) {
      const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGameOver, isPaused, gameStarted]);

  // Sound effect functions
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'square') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  }, []);

  const resetBall = () => {
    setBall({
      x: canvasWidth / 2,
      y: canvasHeight / 2,
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
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw clean thin white grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
      
      // Vertical lines
      for (let i = 0; i <= canvasWidth; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasHeight);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let i = 0; i <= canvasHeight; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasWidth, i);
        ctx.stroke();
      }

      // Draw paddle with modern glow effect
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
      
      // Paddle inner highlight
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(paddleX + 2, paddleY + 2, paddleWidth - 4, paddleHeight - 4);
      
      ctx.shadowBlur = 0;

      // Draw ball with clean glow effect
      ctx.shadowColor = '#ff0066';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ff0066';
      ctx.fill();
      ctx.closePath();

      // Ball inner core
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.closePath();

      ctx.shadowBlur = 0;
    };

    const update = () => {
      // Paddle Movement based on emotion
      if (detectedEmotion === "happy" && paddleX + paddleWidth < canvasWidth) {
        setPaddleX((prev) => prev + paddleSpeed);
      } else if (detectedEmotion === "surprised" && paddleX > 0) {
        setPaddleX((prev) => prev - paddleSpeed);
      }

      // Ball Movement
      let newX = ball.x + ball.dx;
      let newY = ball.y + ball.dy;

      // Wall collision
      if (newX + ball.radius > canvasWidth || newX - ball.radius < 0) {
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
      if (newY + ball.radius > canvasHeight) {
        setLives((prev) => {
          const updated = prev - 1;
          if (updated <= 0) {
            setIsGameOver(true);
            // Update high score
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('emotionPongHighScore', score.toString());
            }
            playSound(150, 1, 'sawtooth');
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
  }, [detectedEmotion, paddleX, ball, isGameOver, isPaused, gameStarted, playSound, score, highScore]);

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
      case 'happy': return '#00ff88';
      case 'surprised': return '#ff6b00';
      case 'sad': return '#0066ff';
      case 'angry': return '#ff0066';
      default: return '#888888';
    }
  };

  const getEmotionIcon = () => {
    switch (detectedEmotion) {
      case 'happy': return '😊';
      case 'surprised': return '😲';
      case 'sad': return '😢';
      case 'angry': return '😠';
      default: return '😐';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreRating = () => {
    if (score >= 20) return { text: "LEGENDARY NEURAL MASTER", color: "#FFD700", icon: "🏆" };
    if (score >= 15) return { text: "NEURAL EXPERT", color: "#FF6B35", icon: "🥇" };
    if (score >= 10) return { text: "EMOTION SPECIALIST", color: "#00FF88", icon: "🥈" };
    if (score >= 5) return { text: "NEURAL TRAINEE", color: "#00BFFF", icon: "🥉" };
    return { text: "NEURAL NOVICE", color: "#888888", icon: "🎯" };
  };

  // Full-screen Game Over display
  if (isGameOver) {
    const rating = getScoreRating();
    const isNewHighScore = score === highScore && score > 0;

    return (
      <div className="fullscreen-gameover">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

          .fullscreen-gameover {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', monospace;
            color: #ffffff;
            z-index: 1000;
            overflow: hidden;
          }

          .fullscreen-gameover::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(255, 0, 102, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 
              100% 100%,
              100% 100%,
              30px 30px,
              30px 30px;
            animation: backgroundPulse 4s ease-in-out infinite;
          }

          @keyframes backgroundPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }

          .game-over-title {
            font-size: clamp(3rem, 8vw, 8rem);
            font-weight: 900;
            text-align: center;
            margin-bottom: 20px;
            color: #ff0066;
            letter-spacing: 0.1em;
            text-shadow: 
              0 0 20px rgba(255, 0, 102, 0.8),
              0 0 40px rgba(255, 0, 102, 0.6),
              0 0 60px rgba(255, 0, 102, 0.4);
            animation: titlePulse 2s ease-in-out infinite alternate;
            position: relative;
            z-index: 2;
          }

          @keyframes titlePulse {
            from { 
              filter: brightness(1);
              transform: scale(1);
            }
            to { 
              filter: brightness(1.2);
              transform: scale(1.05);
            }
          }

          .system-failure-text {
            font-size: clamp(1rem, 3vw, 1.5rem);
            color: #ff6b00;
            text-align: center;
            margin-bottom: 40px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            animation: glitch 3s infinite;
            position: relative;
            z-index: 2;
          }

          @keyframes glitch {
            0%, 90%, 100% { transform: translateX(0); }
            92% { transform: translateX(-2px); }
            94% { transform: translateX(2px); }
            96% { transform: translateX(-1px); }
            98% { transform: translateX(1px); }
          }

          .score-display {
            background: rgba(0, 0, 0, 0.3); /* Dark translucent background */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px); /* for Safari */
border-radius: 20px;
border: 2px solid rgba(255, 255, 255, 0.1); /* subtle white border */
padding: 40px;
margin-bottom: 40px;
text-align: center;
box-shadow:
  0 20px 60px rgba(0, 0, 0, 0.6),
  inset 0 1px 0 rgba(255, 255, 255, 0.05); /* softer inner glow */
position: relative;
z-index: 2;
min-width: 400px;
color: white; /* ensure text is readable on dark bg */

          }

          .final-score {
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 700;
            color: #00ff88;
            margin-bottom: 15px;
            text-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
            animation: scoreGlow 2s ease-in-out infinite alternate;
          }

          @keyframes scoreGlow {
            from { 
              filter: brightness(1);
              text-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
            }
            to { 
              filter: brightness(1.3);
              text-shadow: 0 0 25px rgba(0, 255, 136, 0.8), 0 0 35px rgba(0, 255, 136, 0.4);
            }
          }

          .score-label {
            font-size: 1.2rem;
            color: #cccccc;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }

          .high-score-badge {
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #000;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            animation: newRecordPulse 1s ease-in-out infinite alternate;
          }

          @keyframes newRecordPulse {
            from { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
            to { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 30px 0;
            width: 100%;
          }

          .stat-item {
            text-align: center;
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 5px;
          }

          .stat-label {
            font-size: 0.8rem;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .rating-display {
            text-align: center;
            margin: 30px 0;
          }

          .rating-icon {
            font-size: 3rem;
            margin-bottom: 10px;
            display: block;
          }

          .rating-text {
            font-size: 1.3rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-shadow: 0 0 10px currentColor;
          }

          .action-buttons {
            display: flex;
            gap: 20px;
            margin-top: 40px;
            position: relative;
            z-index: 2;
            flex-wrap: wrap;
            justify-content: center;
          }

          .action-button {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: #ffffff;
            padding: 15px 30px;
            font-size: 1.1rem;
            font-weight: 600;
            font-family: 'Orbitron', monospace;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            min-width: 140px;
          }

          .action-button:hover {
            background: rgba(0, 255, 136, 0.2);
            border-color: rgba(0, 255, 136, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
          }

          .action-button:active {
            transform: translateY(0);
          }

          @media (max-width: 768px) {
            .score-display {
              min-width: 320px;
              padding: 30px 20px;
            }
            
            .action-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .action-button {
              width: 200px;
            }
          }
        `}</style>
{/* 
        <div className="game-over-title">SYSTEM FAILURE</div> */}
        <div className="system-failure-text">Neural Connection Terminated</div>

        <div className="score-display">
          {isNewHighScore && (
            <div className="high-score-badge">
              🏆 NEW HIGH SCORE! 🏆
            </div>
          )}
          
          <div className="score-label">Final Score</div>
          <div className="final-score">{score.toString().padStart(4, '0')}</div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{formatTime(gameTime)}</div>
              <div className="stat-label">Time Survived</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{highScore.toString().padStart(4, '0')}</div>
              <div className="stat-label">Best Score</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{Math.round((score / gameTime) * 60) || 0}</div>
              <div className="stat-label">Score/Min</div>
            </div>
          </div>

          <div className="rating-display">
            <span className="rating-icon">{rating.icon}</span>
            <div className="rating-text" style={{ color: rating.color }}>
              {rating.text}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleRestart} className="action-button">
            Restart Game
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="action-button"
          >
            Main Menu
          </button>
        </div>
      </div>
    );
  }

  // Regular game display (when not game over)
  return (
    <div className="emotion-pong-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .emotion-pong-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          min-height: 100vh;
          padding: 20px;
          font-family: 'Orbitron', monospace;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .emotion-pong-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
          animation: subtleMove 30s linear infinite;
        }

        @keyframes subtleMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }

        .game-title {
          font-family: 'Courier New', monospace;
          font-size: 4rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 8px;
          color: #ffffff;
          letter-spacing: 8px;
          position: relative;
          z-index: 1;
          text-shadow: 
            2px 2px 0px #00ff88,
            4px 4px 0px #007755,
            0 0 10px rgba(0, 255, 136, 0.5);
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          animation: pixelGlow 3s ease-in-out infinite alternate;
        }

        @keyframes pixelGlow {
          from { 
            filter: brightness(1);
            text-shadow: 
              2px 2px 0px #00ff88,
              4px 4px 0px #007755,
              0 0 10px rgba(0, 255, 136, 0.5);
          }
          to { 
            filter: brightness(1.2);
            text-shadow: 
              2px 2px 0px #00ff88,
              4px 4px 0px #007755,
              0 0 20px rgba(0, 255, 136, 0.8),
              0 0 30px rgba(0, 255, 136, 0.3);
          }
        }

        .game-subtitle {
          font-size: 1.1rem;
          color: #888888;
          text-align: center;
          margin-bottom: 30px;
          letter-spacing: 2px;
          position: relative;
          z-index: 1;
          font-weight: 400;
          text-transform: uppercase;
        }

        .game-canvas {
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          box-shadow: 
            0 0 30px rgba(0, 0, 0, 0.8),
            inset 0 0 1px rgba(255, 255, 255, 0.1);
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          background: #000000;
        }

        .game-stats {
          display: flex;
          justify-content: space-between;
          width: 600px;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }

        .stat-item {
          text-align: center;
          font-size: 0.9rem;
          color: #cccccc;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 5px;
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
        }

        .controls-panel {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
        }

        .game-button {
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Orbitron', monospace;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
        }

        .game-button:hover {
          background: rgba(0, 255, 136, 0.2);
          border-color: rgba(0, 255, 136, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 255, 136, 0.3);
        }

        .game-button:active {
          transform: translateY(0);
        }

        .game-button:disabled {
          background: rgba(255, 255, 255, 0.05);
          color: #666;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .restart-button:hover {
          background: rgba(255, 100, 100, 0.2);
          border-color: rgba(255, 100, 100, 0.4);
          box-shadow: 0 6px 20px rgba(255, 100, 100, 0.3);
        }
      `}</style>

      <div className="game-title">EMOTION PONG</div>
      <div className="game-subtitle">Neural Interface Protocol</div>

      {!gameStarted ? null : (
        <>
          <div className="game-stats">
            <div className="stat-item">
              <div>SCORE</div>
              <div className="stat-value">{score.toString().padStart(4, '0')}</div>
            </div>
            <div className="stat-item">
              <div>LIVES</div>
              <div className="stat-value">{'♥'.repeat(lives)}</div>
            </div>
            <div className="stat-item">
              <div>TIME</div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>{formatTime(gameTime)}</div>
            </div>
            <div className="stat-item">
              <div>STATUS</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>
                {isGameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'ACTIVE'}
              </div>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="game-canvas"
          />

          <div className="controls-panel">
            <button 
              onClick={handlePause} 
              className="game-button"
              disabled={isGameOver}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={handleRestart} className="game-button restart-button">
              Restart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmotionPong;