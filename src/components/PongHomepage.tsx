"use client";
import React, { useState, useEffect } from 'react';
import EmotionBlaster from './EmotionBlaster';
const PongHomepage = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      } catch (error) {
        console.log('Web Audio API not supported');
      }
    };
    
    initAudio();
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Create retro beep sound effect
  const playBeep = () => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const handlePlayClick = () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }
    
    playBeep();
    setGameStarted(true);
//    <EmotionBlaster/>

// if (gameStarted) {
//   return <EmotionBlaster playerName={playerName} />;
// }

    console.log(`Starting emotion-detection Pong for player: ${playerName}`);
  };
 

  const handleInputClick = () => {
    playBeep();
  };

  if (gameStarted) {
  return <EmotionBlaster playerName={playerName} />;
}
// return (
//   <div className={`main-container ${gameStarted ? 'row-layout' : ''}`}>
//     {gameStarted ? (
//       <EmotionBlaster playerName={playerName} />
//     ) : (
//       <PongHomepage />
//     )}
//   </div>
// );


  return (
    
    <div className="main-container">
      {/* Retro grid background */}
      <div className="grid-background">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="grid-cell"></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Pixelated PONG Title */}
        <div className="title-container">
          <div className="pixel-title">
            <div className="letters-container">
              {/* P */}
              <div className="letter">
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-empty"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-empty"></div>
                </div>
              </div>

              {/* O */}
              <div className="letter">
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
              </div>

              {/* N */}
              <div className="letter">
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-block"></div>
                </div>
              </div>

              {/* G */}
              <div className="letter">
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-empty"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-empty"></div>
                  <div className="pixel-block"></div>
                </div>
                <div className="letter-row">
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                  <div className="pixel-block"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="subtitle">
            EMOTION DETECTION MODE
          </p>
        </div>

        {/* Player Name Input */}
        <div className="input-container">
          <label className="input-label">
            ENTER PLAYER NAME
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
            onClick={handleInputClick}
            onFocus={handleInputClick}
            placeholder="YOUR NAME"
            maxLength={12}
            className="name-input"
          />
        </div>

        {/* Game Area Preview - Single Player */}
        <div className="game-preview">
          {/* Player Paddle (Bottom) */}
          <div className="player-paddle"></div>
          
          {/* Blocks/Targets at top */}
          <div className="target-block target-red"></div>
          <div className="target-block target-yellow"></div>
          <div className="target-block target-blue"></div>
          <div className="target-block target-purple"></div>
          <div className="target-block target-orange"></div>
          
          {/* Ball */}
          <div className="game-ball"></div>
          
          {/* Playing Field */}
          <div className="playing-field"></div>
        </div>

        {/* Play Button */}
        <button
          onClick={handlePlayClick}
          disabled={!playerName.trim()}
          className={`play-button ${playerName.trim() ? 'enabled' : 'disabled'}`}
        >
          START GAME
        </button>

        {/* Game Info */}
        <div className="game-info">
          <div className="vs-display">
            <span className="player-text">PLAYER</span> VS <span className="target-text">TARGETS</span>
          </div>
          <div className="game-description">
            Break all the blocks using your emotions to control paddle movement!
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions">
          <p>Camera access required for emotion detection | Be expressive to play better!</p>
        </div>
      </div>

      <style jsx>{`
        .main-container {
          min-height: 100vh;
          background-color: black;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          user-select: none;
          position: relative;
          overflow: hidden;
        }
          .main-container.row-layout {
  flex-direction: row;
}

        .grid-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.1;
          display: grid;
          grid-template-columns: repeat(20, 1fr);
          grid-template-rows: repeat(20, 1fr);
          width: 100%;
          height: 100%;
        }

        .grid-cell {
          border: 1px solid #22c55e;
          border-opacity: 0.2;
        }

        .main-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top:40px;
        }

        .title-container {
          margin-bottom: 48px;
        }

        .letters-container {
          display: flex;
          gap: 16px;
        }

        .letter {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .letter-row {
          display: flex;
          gap: 4px;
        }

        .pixel-block {
          width: 16px;
          height: 16px;
          background-color: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .pixel-empty {
          width: 16px;
          height: 16px;
          background-color: transparent;
        }

        .subtitle {
          color: #22c55e;
          font-size: 18px;
          text-align: center;
          letter-spacing: 0.2em;
          font-weight: bold;
          animation: pulse 2s infinite;
          margin-top: 16px;
        }

        .input-container {
          margin-bottom: 32px;
          text-align: center;
        }

        .input-label {
          display: block;
          color: white;
          font-size: 20px;
          margin-bottom: 16px;
          letter-spacing: 0.1em;
        }

        .name-input {
          background-color: black;
          border: 4px solid white;
          color: white;
          font-size: 24px;
          padding: 12px 24px;
          text-align: center;
          letter-spacing: 0.2em;
          font-weight: bold;
          font-family: monospace;
          image-rendering: pixelated;
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .name-input::placeholder {
          color: #666;
        }

        .name-input:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 
            inset 0 0 10px rgba(34, 197, 94, 0.3),
            0 0 20px rgba(34, 197, 94, 0.2);
        }

        .game-preview {
          position: relative;
          margin-bottom: 48px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 32px;
          width: 320px;
          height: 192px;
        }

        .player-paddle {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 64px;
          height: 12px;
          background-color: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .target-block {
          position: absolute;
          top: 16px;
          width: 16px;
          height: 12px;
        }

        .target-red {
          left: 25%;
          background-color: #ef4444;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
        }

        .target-yellow {
          left: 33.33%;
          background-color: #eab308;
          box-shadow: 0 0 5px rgba(234, 179, 8, 0.5);
        }

        .target-blue {
          left: 50%;
          transform: translateX(-50%);
          background-color: #3b82f6;
          box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
        }

        .target-purple {
          right: 33.33%;
          background-color: #a855f7;
          box-shadow: 0 0 5px rgba(168, 85, 247, 0.5);
        }

        .target-orange {
          right: 25%;
          background-color: #f97316;
          box-shadow: 0 0 5px rgba(249, 115, 22, 0.5);
        }

        .game-ball {
          position: absolute;
          left: 33.33%;
          bottom: 64px;
          width: 12px;
          height: 12px;
          background-color: white;
          animation: bounce-diagonal 3s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .playing-field {
          width: 100%;
          height: 100%;
          background-color: transparent;
        }

        .play-button {
          padding: 16px 64px;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 0.2em;
          transition: all 0.15s;
          border: none;
          font-family: monospace;
          image-rendering: pixelated;
          margin-bottom: 48px;
        }

        .play-button.enabled {
          background-color: white;
          color: black;
          box-shadow: 
            0 6px 0 #666,
            0 8px 0 #444,
            0 10px 20px rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }

        .play-button.enabled:hover {
          background-color: #22c55e;
          color: black;
        }

        .play-button.enabled:active {
          transform: translateY(4px) scale(0.95);
          box-shadow: 
            0 2px 0 #666,
            0 4px 0 #444,
            0 6px 15px rgba(0, 0, 0, 0.3);
        }

        .play-button.disabled {
          background-color: #666;
          color: #999;
          cursor: not-allowed;
          box-shadow: 
            0 6px 0 #333,
            0 8px 0 #222,
            0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .game-info {
          text-align: center;
        }

        .vs-display {
          color: white;
          font-size: 18px;
          margin-bottom: 16px;
        }

        .player-text {
          color: #22c55e;
        }

        .target-text {
          color: #ef4444;
        }

        .game-description {
          color: #999;
          font-size: 14px;
          max-width: 384px;
        }

        .instructions {
          position: absolute;
          bottom: 16px;
          color: white;
          font-size: 12px;
          opacity: 0.4;
          text-align: center;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce-diagonal {
          0% { 
            transform: translate(0, 0);
          }
          25% { 
            transform: translate(20px, -15px);
          }
          50% { 
            transform: translate(40px, -30px);
          }
          75% { 
            transform: translate(20px, -15px);
          }
          100% { 
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default PongHomepage;