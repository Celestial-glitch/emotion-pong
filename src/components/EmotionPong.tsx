

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

      // Draw enhanced grid pattern with glow effect
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 0.5;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 2;
      
      for (let i = 0; i < canvasWidth; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasHeight);
        ctx.stroke();
      }
      for (let i = 0; i < canvasHeight; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasWidth, i);
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;

      // Draw paddle with enhanced glow effect
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
      
      // Paddle inner glow
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(paddleX + 2, paddleY + 2, paddleWidth - 4, paddleHeight - 4);
      
      // Paddle reflection with stronger effect
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0, 255, 136, 0.4)';
      ctx.fillRect(paddleX, paddleY + paddleHeight, paddleWidth, 4);

      // Draw ball with enhanced glow effect
      ctx.shadowColor = '#ff0066';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ff0066';
      ctx.fill();
      ctx.closePath();

      // Ball inner core
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.closePath();

      // Enhanced ball trail effect
      ctx.shadowBlur = 0;
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(
          ball.x - ball.dx * i * 1.5, 
          ball.y - ball.dy * i * 1.5, 
          ball.radius * (1 - i * 0.15), 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 0, 102, ${0.5 - i * 0.08})`;
        ctx.fill();
        ctx.closePath();
      }

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
  }, [detectedEmotion, paddleX, ball, isGameOver, isPaused, gameStarted, playSound]);



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

  return (
    <div className="emotion-pong-container">
      <style jsx>{`
        .emotion-pong-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #000000;

          padding: 10px;
          font-family: 'Courier New', monospace;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          height: 100%;; /* Change from 100% to 100vh */
  width: 100%; /* Keep this */
  box-sizing: border-box; /* Add this */
        }

        .emotion-pong-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 25px 25px;
          pointer-events: none;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(25px, 25px); }
        }

        .emotion-pong-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .game-title {
          font-size: 3.5rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
          text-shadow: 
            0 0 5px #00ff88,
            0 0 10px #00ff88,
            0 0 20px #00ff88,
            0 0 40px #00ff88;
          color: #00ff88;
          letter-spacing: 12px;
          position: relative;
          z-index: 1;
          animation: titleGlow 2s ease-in-out infinite alternate;
        }

        @keyframes titleGlow {
          from { 
            text-shadow: 
              0 0 5px #00ff88,
              0 0 10px #00ff88,
              0 0 20px #00ff88,
              0 0 40px #00ff88;
          }
          to { 
            text-shadow: 
              0 0 10px #00ff88,
              0 0 20px #00ff88,
              0 0 30px #00ff88,
              0 0 50px #00ff88,
              0 0 60px #00ff88;
          }
        }

        .game-subtitle {
          font-size: 1.3rem;
          color: #00ff88;
          text-align: center;
          margin-bottom: 30px;
          letter-spacing: 3px;
          text-shadow: 0 0 10px #00ff88;
          position: relative;
          z-index: 1;
          opacity: 0.8;
        }

        .game-canvas {
          border: 3px solid #00ff88;
          border-radius: 15px;
          box-shadow: 
            0 0 20px rgba(0, 255, 136, 0.4),
            inset 0 0 20px rgba(0, 255, 136, 0.1);
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
          background: rgba(0, 0, 0, 0.8);
          padding: 20px;
          border-radius: 15px;
          border: 2px solid #00ff88;
          box-shadow: 
            0 0 20px rgba(0, 255, 136, 0.3),
            inset 0 0 10px rgba(0, 255, 136, 0.1);
          position: relative;
          z-index: 1;
        }

        .stat-item {
          text-align: center;
          font-size: 1.1rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #00ff88;
          text-shadow: 
            0 0 5px #00ff88,
            0 0 10px #00ff88;
          animation: statPulse 3s ease-in-out infinite;
        }

        @keyframes statPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .emotion-display {
          text-align: center;
          margin-bottom: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 15px;
          border: 2px solid #00ff88;
          box-shadow: 
            0 0 20px rgba(0, 255, 136, 0.3),
            inset 0 0 10px rgba(0, 255, 136, 0.1);
          position: relative;
          z-index: 1;
        }

        .emotion-icon {
          font-size: 3.5rem;
          margin-bottom: 10px;
          filter: drop-shadow(0 0 10px currentColor);
          animation: emotionFloat 2s ease-in-out infinite;
        }

        @keyframes emotionFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .emotion-text {
          font-size: 1.6rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 3px;
          text-shadow: 0 0 10px currentColor;
        }

        .controls-panel {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .game-button {
          padding: 15px 30px;
          font-size: 1.2rem;
          font-weight: bold;
          background: linear-gradient(45deg, #00ff88, #00cc6a);
          color: #000;
          border: 2px solid #00ff88;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 
            0 0 15px rgba(0, 255, 136, 0.4),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 1;
        }

        .game-button:hover {
          background: linear-gradient(45deg, #00cc6a, #009950);
          transform: translateY(-3px);
          box-shadow: 
            0 5px 20px rgba(0, 255, 136, 0.6),
            inset 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .game-button:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .restart-button {
          background: linear-gradient(45deg, #ff0066, #cc0052);
        }

        .restart-button:hover {
          background: linear-gradient(45deg, #cc0052, #99003d);
        }

        .game-instructions {
          text-align: center;
          max-width: 600px;
          background: rgba(0, 0, 0, 0.8);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #00ff88;
          line-height: 1.8;
          box-shadow: 
            0 0 20px rgba(0, 255, 136, 0.3),
            inset 0 0 10px rgba(0, 255, 136, 0.1);
          position: relative;
          z-index: 1;
        }

        .instruction-title {
          font-size: 1.3rem;
          color: #00ff88;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .instruction-item {
          margin: 8px 0;
          font-size: 1rem;
        }

        .game-over-screen {
          text-align: center;
          background: rgba(0, 0, 0, 0.9);
          padding: 40px;
          border-radius: 20px;
          border: 3px solid #ff0066;
          box-shadow: 
            0 0 30px rgba(255, 0, 102, 0.5),
            inset 0 0 20px rgba(255, 0, 102, 0.1);
          position: relative;
          z-index: 1;
        }

        .game-over-title {
          font-size: 2.5rem;
          color: #ff0066;
          margin-bottom: 15px;
          text-shadow: 0 0 20px #ff0066;
        }

        .final-score {
          font-size: 1.8rem;
          color: #00ff88;
          margin-bottom: 20px;
        }

        .start-screen {
          text-align: center;
          background: rgba(0, 255, 136, 0.1);
          padding: 40px;
          border-radius: 15px;
          border: 2px solid #00ff88;
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        }

        .start-title {
          font-size: 2rem;
          color: #00ff88;
          margin-bottom: 20px;
          text-shadow: 0 0 15px #00ff88;
        }
      `}</style>

      <div className="game-title">EMOTION PONG</div>
      <div className="game-subtitle">Neural Interface Mode</div>

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
              <div>STATUS</div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>
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

          <div className="emotion-display">
            <div className="emotion-icon">{getEmotionIcon()}</div>
            <div 
              className="emotion-text" 
              style={{ color: getEmotionColor() }}
            >
              {detectedEmotion}
            </div>
          </div>

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

          {isGameOver && (
            <div className="game-over-screen">
              <div className="game-over-title">SYSTEM FAILURE</div>
              <div className="final-score">Final Score: {score}</div>
              <p>Neural connection lost. Reinitialize?</p>
            </div>
          )}

          <div className="game-instructions">
            <div className="instruction-title">Neural Control Manual</div>
            <div className="instruction-item">😊 <strong>HAPPY</strong> → Paddle moves RIGHT</div>
            <div className="instruction-item">😲 <strong>SURPRISED</strong> → Paddle moves LEFT</div>
            <div className="instruction-item">😐 <strong>NEUTRAL</strong> → Paddle remains stationary</div>
            <div className="instruction-item">🎯 <strong>OBJECTIVE</strong> → Keep the energy ball active</div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmotionPong;