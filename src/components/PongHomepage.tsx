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
    console.log(`Starting emotion-detection Pong for player: ${playerName}`);
  };

  const handleInputClick = () => {
    playBeep();
  };

   if (gameStarted) {
  return <EmotionBlaster playerName={playerName} />;
}
  return (
    <div className="main-container">
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />

      {/* Retro grid background */}
      <div className="grid-background">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="grid-cell"></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="container-fluid main-content">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            
            {/* Pixelated PONG Title */}
            <div className="title-container text-center mb-4">
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
            <div className="row justify-content-center mb-4">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="input-container text-center">
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
                    className="form-control name-input"
                  />
                </div>
              </div>
            </div>

            {/* Game Rules Section */}
            <div className="row justify-content-center mb-4">
              <div className="col-12">
                <div className="neural-manual-horizontal">
                  <div className="manual-header text-center mb-3">
                    <div className="manual-title">NEURAL CONTROL MANUAL</div>
                    <div className="manual-subtitle">EMOTION → ACTION</div>
                  </div>
                  
                  <div className="row g-2 justify-content-center">
                    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                      <div className="rule-item-horizontal">
                        <div className="emotion-display-sm">😊 HAPPY</div>
                        <div className="arrow-sm">→</div>
                        <div className="action-display-sm">RIGHT</div>
                      </div>
                    </div>
                    
                    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                      <div className="rule-item-horizontal">
                        <div className="emotion-display-sm">😲 SURPRISED</div>
                        <div className="arrow-sm">→</div>
                        <div className="action-display-sm">LEFT</div>
                      </div>
                    </div>
                    
                    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                      <div className="rule-item-horizontal">
                        <div className="emotion-display-sm">😐 NEUTRAL</div>
                        <div className="arrow-sm">→</div>
                        <div className="action-display-sm">STOP</div>
                      </div>
                    </div>
                    
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                      <div className="objective-item-horizontal">
                        <div className="objective-icon">🎯</div>
                        <div className="objective-text">KEEP ENERGY BALL ACTIVE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Area Preview - Wider and Less Height */}
            <div className="row justify-content-center mb-4">
              <div className="col-12 col-lg-10">
                <div className="game-preview-wide">
                  {/* Player Paddle (Bottom) */}
                  <div className="player-paddle-wide"></div>
                  
                  {/* Top Row Blocks */}
                  <div className="target-block target-red-wide" style={{left: '10%'}}></div>
                  <div className="target-block target-yellow-wide" style={{left: '20%'}}></div>
                  <div className="target-block target-blue-wide" style={{left: '30%'}}></div>
                  <div className="target-block target-purple-wide" style={{left: '40%'}}></div>
                  <div className="target-block target-orange-wide" style={{left: '50%'}}></div>
                  <div className="target-block target-cyan-wide" style={{left: '60%'}}></div>
                  <div className="target-block target-pink-wide" style={{left: '70%'}}></div>
                  <div className="target-block target-indigo-wide" style={{left: '80%'}}></div>
                  
                  {/* Second Row Blocks */}
                  <div className="target-block-row2 target-emerald-wide" style={{left: '15%'}}></div>
                  <div className="target-block-row2 target-violet-wide" style={{left: '25%'}}></div>
                  <div className="target-block-row2 target-lime-wide" style={{left: '35%'}}></div>
                  <div className="target-block-row2 target-rose-wide" style={{left: '45%'}}></div>
                  <div className="target-block-row2 target-sky-wide" style={{left: '55%'}}></div>
                  <div className="target-block-row2 target-amber-wide" style={{left: '65%'}}></div>
                  <div className="target-block-row2 target-teal-wide" style={{left: '75%'}}></div>
                  
                  {/* Ball */}
                  <div className="game-ball-wide"></div>
                  
                  {/* Side walls */}
                  <div className="side-wall-left"></div>
                  <div className="side-wall-right"></div>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="row justify-content-center mb-4">
              <div className="col-12 col-md-6 col-lg-4">
                <button
                  onClick={handlePlayClick}
                  disabled={!playerName.trim()}
                  className={`btn w-100 play-button ${playerName.trim() ? 'enabled' : 'disabled'}`}
                >
                  START GAME
                </button>
              </div>
            </div>

            {/* Game Info
            <div className="game-info text-center mb-4">
              <div className="vs-display mb-3">
                <span className="player-text">PLAYER</span> VS <span className="target-text">TARGETS</span>
              </div>
              <div className="game-description">
                Break all the blocks using your emotions to control paddle movement!
              </div>
            </div> */}

            {/* Instructions */}
            <div className="instructions text-center">
              <p>Camera access required for emotion detection | Be expressive to play better!</p>
            </div>

          </div>
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
          padding: 20px;
        }

        .grid-background {
          position: fixed;
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
          max-width: 1400px;
        }

        .title-container {
          margin-bottom: 32px;
        }

        .letters-container {
          display: flex;
          gap: 16px;
          justify-content: center;
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
          margin-bottom: 0;
        }

        .input-container {
          margin-bottom: 24px;
        }

        .input-label {
          display: block;
          color: white;
          font-size: 16px;
          margin-bottom: 12px;
          letter-spacing: 0.1em;
        }

        .name-input {
          background-color: black !important;
          border: 4px solid white !important;
          color: white !important;
          font-size: 20px;
          padding: 10px 20px;
          text-align: center;
          letter-spacing: 0.2em;
          font-weight: bold;
          font-family: monospace;
          image-rendering: pixelated;
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .name-input::placeholder {
          color: #666 !important;
        }

        .name-input:focus {
          outline: none !important;
          border-color: #22c55e !important;
          box-shadow: 
            inset 0 0 10px rgba(34, 197, 94, 0.3),
            0 0 20px rgba(34, 197, 94, 0.2) !important;
        }

        .neural-manual-horizontal {
          border: 2px solid rgba(34, 197, 94, 0.3);
          background-color: rgba(0, 0, 0, 0.7);
          padding: 20px;
          box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.1);
        }

        .manual-header {
          border-bottom: 1px solid rgba(34, 197, 94, 0.3);
          padding-bottom: 12px;
        }

        .manual-title {
          color: #22c55e;
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .manual-subtitle {
          color: white;
          font-size: 14px;
          opacity: 0.8;
          letter-spacing: 0.05em;
        }

        .rule-item-horizontal {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.05);
          text-align: center;
          height: 100%;
          min-height: 80px;
        }

        .emotion-display-sm {
          color: #22c55e;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
        }

        .arrow-sm {
          color: white;
          font-size: 12px;
          opacity: 0.6;
        }

        .action-display-sm {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }

        .objective-item-horizontal {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: 2px solid rgba(239, 68, 68, 0.3);
          background-color: rgba(239, 68, 68, 0.1);
          text-align: center;
          height: 100%;
          min-height: 80px;
        }

        .objective-icon {
          font-size: 18px;
        }

        .objective-text {
          color: #ef4444;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.05em;
        }

        .game-preview-wide {
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background-color: rgba(0, 0, 0, 0.3);
          padding: 20px;
          width: 100%;
          height: 120px;
          overflow: hidden;
        }

        .player-paddle-wide {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 12px;
          background-color: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .target-block {
          position: absolute;
          top: 12px;
          width: 8%;
          max-width: 40px;
          height: 10px;
        }

        .target-block-row2 {
          position: absolute;
          top: 28px;
          width: 7%;
          max-width: 35px;
          height: 10px;
        }

        .target-red-wide {
          background-color: #ef4444;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
        }

        .target-yellow-wide {
          background-color: #eab308;
          box-shadow: 0 0 5px rgba(234, 179, 8, 0.5);
        }

        .target-blue-wide {
          background-color: #3b82f6;
          box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
        }

        .target-purple-wide {
          background-color: #a855f7;
          box-shadow: 0 0 5px rgba(168, 85, 247, 0.5);
        }

        .target-orange-wide {
          background-color: #f97316;
          box-shadow: 0 0 5px rgba(249, 115, 22, 0.5);
        }

        .target-cyan-wide {
          background-color: #06b6d4;
          box-shadow: 0 0 5px rgba(6, 182, 212, 0.5);
        }

        .target-pink-wide {
          background-color: #ec4899;
          box-shadow: 0 0 5px rgba(236, 72, 153, 0.5);
        }

        .target-indigo-wide {
          background-color: #6366f1;
          box-shadow: 0 0 5px rgba(99, 102, 241, 0.5);
        }

        .target-emerald-wide {
          background-color: #10b981;
          box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
        }

        .target-violet-wide {
          background-color: #8b5cf6;
          box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
        }

        .target-lime-wide {
          background-color: #84cc16;
          box-shadow: 0 0 5px rgba(132, 204, 22, 0.5);
        }

        .target-rose-wide {
          background-color: #f43f5e;
          box-shadow: 0 0 5px rgba(244, 63, 94, 0.5);
        }

        .target-sky-wide {
          background-color: #0ea5e9;
          box-shadow: 0 0 5px rgba(14, 165, 233, 0.5);
        }

        .target-amber-wide {
          background-color: #f59e0b;
          box-shadow: 0 0 5px rgba(245, 158, 11, 0.5);
        }

        .target-teal-wide {
          background-color: #14b8a6;
          box-shadow: 0 0 5px rgba(20, 184, 166, 0.5);
        }

        .game-ball-wide {
          position: absolute;
          left: 45%;
          bottom: 50px;
          width: 12px;
          height: 12px;
          background-color: white;
          animation: bounce-horizontal 4s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .side-wall-left {
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.3);
        }

        .side-wall-right {
          position: absolute;
          right: 0;
          top: 0;
          width: 2px;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.3);
        }

        .play-button {
          padding: 16px 32px !important;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 0.2em;
          transition: all 0.15s;
          border: none !important;
          font-family: monospace;
          image-rendering: pixelated;
        }

        .play-button.enabled {
          background-color: white !important;
          color: black !important;
          box-shadow: 
            0 6px 0 #666,
            0 8px 0 #444,
            0 10px 20px rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }

        .play-button.enabled:hover {
          background-color: #22c55e !important;
          color: black !important;
          transform: translateY(-2px);
        }

        .play-button.enabled:active {
          transform: translateY(4px) scale(0.95) !important;
          box-shadow: 
            0 2px 0 #666,
            0 4px 0 #444,
            0 6px 15px rgba(0, 0, 0, 0.3) !important;
        }

        .play-button.disabled {
          background-color: #666 !important;
          color: #999 !important;
          cursor: not-allowed;
          box-shadow: 
            0 6px 0 #333,
            0 8px 0 #222,
            0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .game-info {
          color: white;
        }

        .vs-display {
          font-size: 18px;
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
          max-width: 600px;
          margin: 0 auto;
        }

        .instructions {
          color: white;
          font-size: 12px;
          opacity: 0.4;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce-horizontal {
          0% { 
            transform: translate(0, 0);
          }
          25% { 
            transform: translate(60px, -20px);
          }
          50% { 
            transform: translate(120px, -40px);
          }
          75% { 
            transform: translate(60px, -20px);
          }
          100% { 
            transform: translate(0, 0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .pixel-block, .pixel-empty {
            width: 12px;
            height: 12px;
          }
          
          .letters-container {
            gap: 12px;
          }
          
          .subtitle {
            font-size: 16px;
          }
          
          .name-input {
            font-size: 18px;
          }
          
          .game-preview-wide {
            height: 100px;
            padding: 15px;
          }
          
          .manual-title {
            font-size: 14px;
          }
          
          .emotion-display-sm {
            font-size: 10px;
          }
          
          .action-display-sm {
            font-size: 9px;
          }
          
          .objective-text {
            font-size: 11px;
          }
        }

        @media (max-width: 576px) {
          .pixel-block, .pixel-empty {
            width: 10px;
            height: 10px;
          }
          
          .letters-container {
            gap: 8px;
          }
          
          .subtitle {
            font-size: 14px;
          }
          
          .game-preview-wide {
            height: 80px;
            padding: 10px;
          }
          
          .rule-item-horizontal {
            min-height: 70px;
            padding: 8px 6px;
          }
          
          .objective-item-horizontal {
            min-height: 70px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default PongHomepage;