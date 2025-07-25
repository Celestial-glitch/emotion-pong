
"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface WebcamDetectorProps {
  onEmotionDetected: (emotion: string) => void;
}

const WebcamDetector: React.FC<WebcamDetectorProps> = ({ onEmotionDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelsLoaded = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPaused, setIsPaused] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [confidence, setConfidence] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'surprised': return '😲';
      case 'fearful': return '😨';
      case 'disgusted': return '🤢';
      case 'neutral': return '😐';
      default: return '🤖';
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '#00ff88';
      case 'sad': return '#4a90e2';
      case 'angry': return '#ff0066';
      case 'surprised': return '#ff6b00';
      case 'fearful': return '#9b59b6';
      case 'disgusted': return '#f39c12';
      case 'neutral': return '#888888';
      default: return '#00ff88';
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      if (modelsLoaded.current) return;
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector_model");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression_model");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68_model");
      modelsLoaded.current = true;
    };

    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    loadModels().then(startVideo);

    const startDetection = () => {
      intervalRef.current = setInterval(async () => {
        if (isPaused) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) return;

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.matchDimensions(canvas, displaySize);
        const resized = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Custom pixelated drawing style
          ctx.imageSmoothingEnabled = false;
          ctx.strokeStyle = '#00ff88';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur = 10;
        }

        // Custom drawing for pixelated effect
        resized.forEach(detection => {
          const { x, y, width, height } = detection.detection.box;
          
          // Draw pixelated face detection box
          if (ctx) {
            ctx.strokeRect(x, y, width, height);
            
            // Draw corner brackets for cyberpunk effect
            const cornerSize = 20;
            ctx.lineWidth = 4;
            
            // Top-left corner
            ctx.beginPath();
            ctx.moveTo(x, y + cornerSize);
            ctx.lineTo(x, y);
            ctx.lineTo(x + cornerSize, y);
            ctx.stroke();
            
            // Top-right corner
            ctx.beginPath();
            ctx.moveTo(x + width - cornerSize, y);
            ctx.lineTo(x + width, y);
            ctx.lineTo(x + width, y + cornerSize);
            ctx.stroke();
            
            // Bottom-left corner
            ctx.beginPath();
            ctx.moveTo(x, y + height - cornerSize);
            ctx.lineTo(x, y + height);
            ctx.lineTo(x + cornerSize, y + height);
            ctx.stroke();
            
            // Bottom-right corner
            ctx.beginPath();
            ctx.moveTo(x + width - cornerSize, y + height);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x + width, y + height - cornerSize);
            ctx.stroke();
          }
        });

        if (detections.length > 0) {
          const exp = detections[0].expressions;
          const sorted = Object.entries(exp).sort((a, b) => b[1] - a[1]);
          const detectedEmotion = sorted[0][0];
          const emotionConfidence = sorted[0][1];
          
          setCurrentEmotion(detectedEmotion);
          setConfidence(emotionConfidence);
          setFaceDetected(true);
          onEmotionDetected(detectedEmotion);
        } else {
          setFaceDetected(false);
          setCurrentEmotion("neutral");
          setConfidence(0);
        }
      }, 500);
    };

    startDetection();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onEmotionDetected, isPaused]);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setCurrentEmotion("neutral");
    setConfidence(0);
    setFaceDetected(false);
    setIsPaused(false);
  };

  return (
    <div className="webcam-detector-container">
      <style jsx>{`
        .webcam-detector-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #000000;
          padding: 10px;
          font-family: 'Courier New', monospace;
          color: #ffffff;
          position: relative;
          border-radius: 15px;
          border: 2px solid #00ff88;
          box-shadow: 
            0 0 20px rgba(0, 255, 136, 0.4),
            inset 0 0 20px rgba(0, 255, 136, 0.1);
              height: 100%;; /* Change from 100% to 100vh */
  width: 100%; /* Keep this */
  box-sizing: border-box; /* Add this */
        }

        .webcam-detector-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 15px 15px;
          pointer-events: none;
          border-radius: 13px;
        }

        .detector-title {
          font-size: 1.8rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 15px;
          color: #00ff88;
          text-shadow: 
            0 0 5px #00ff88,
            0 0 10px #00ff88,
            0 0 15px #00ff88;
          letter-spacing: 3px;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        .video-container {
          position: relative;
          width: 640px;
          height: 480px;
          margin: 0 auto 20px;
          border: 3px solid #00ff88;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 
            0 0 30px rgba(0, 255, 136, 0.4),
            inset 0 0 10px rgba(0, 255, 136, 0.1);
          background: #000000;
          z-index: 1;
          position: relative;
        }

        .video-element {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: contrast(1.2) brightness(0.9);
        }

        .canvas-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          pointer-events: none;
        }

        .status-overlay {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          padding: 8px 12px;
          border-radius: 5px;
          border: 1px solid #00ff88;
          font-size: 0.9rem;
          color: #00ff88;
          z-index: 15;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .pause-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          padding: 20px;
          border-radius: 10px;
          border: 2px solid #ff6b00;
          color: #ff6b00;
          font-size: 1.5rem;
          font-weight: bold;
          z-index: 20;
          text-shadow: 0 0 10px #ff6b00;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .emotion-display {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          padding: 20px;
          border-radius: 15px;
          border: 2px solid #00ff88;
          margin-bottom: 20px;
          box-shadow: 
            0 0 20px rgba(0, 255, 136, 0.3),
            inset 0 0 10px rgba(0, 255, 136, 0.1);
          position: relative;
          z-index: 1;
          min-width: 300px;
        }

        .emotion-icon {
          font-size: 3rem;
          margin-right: 20px;
          filter: drop-shadow(0 0 10px currentColor);
          animation: emotionPulse 2s ease-in-out infinite;
        }

        @keyframes emotionPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .emotion-info {
          text-align: left;
        }

        .emotion-text {
          font-size: 1.8rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 0 10px currentColor;
          margin-bottom: 5px;
        }

        .confidence-text {
          font-size: 1rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .confidence-bar {
          width: 200px;
          height: 8px;
          background: #333;
          border-radius: 4px;
          margin-top: 5px;
          overflow: hidden;
          border: 1px solid #555;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88, #00cc6a);
          border-radius: 3px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .controls-panel {
          display: flex;
          gap: 15px;
          position: relative;
          z-index: 1;
        }

        .control-button {
          padding: 12px 24px;
          font-size: 1.1rem;
          font-weight: bold;
          background: linear-gradient(45deg, #00ff88, #00cc6a);
          color: #000;
          border: 2px solid #00ff88;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 
            0 0 15px rgba(0, 255, 136, 0.4),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .control-button:hover {
          background: linear-gradient(45deg, #00cc6a, #009950);
          transform: translateY(-2px);
          box-shadow: 
            0 5px 20px rgba(0, 255, 136, 0.6),
            inset 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .pause-button {
          background: linear-gradient(45deg, #ff6b00, #e55a00);
          border-color: #ff6b00;
          box-shadow: 
            0 0 15px rgba(255, 107, 0, 0.4),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .pause-button:hover {
          background: linear-gradient(45deg, #e55a00, #cc4d00);
          box-shadow: 
            0 5px 20px rgba(255, 107, 0, 0.6),
            inset 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .restart-button {
          background: linear-gradient(45deg, #ff0066, #cc0052);
          border-color: #ff0066;
          box-shadow: 
            0 0 15px rgba(255, 0, 102, 0.4),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .restart-button:hover {
          background: linear-gradient(45deg, #cc0052, #99003d);
          box-shadow: 
            0 5px 20px rgba(255, 0, 102, 0.6),
            inset 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .no-face-warning {
          background: rgba(255, 107, 0, 0.1);
          border: 1px solid #ff6b00;
          color: #ff6b00;
          padding: 10px;
          border-radius: 5px;
          font-size: 0.9rem;
          text-align: center;
          margin-top: 10px;
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div className="detector-title">Neural Interface Scanner</div>
      
      <div className="video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          width={640} 
          height={480} 
          className="video-element"
        />
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={480} 
          className="canvas-overlay"
        />
        
        <div className="status-overlay">
          {faceDetected ? "FACE LOCKED" : "SCANNING..."}
        </div>
        
        {isPaused && (
          <div className="pause-overlay">
            DETECTION PAUSED
          </div>
        )}
      </div>

      <div className="emotion-display">
        <div 
          className="emotion-icon"
          style={{ color: getEmotionColor(currentEmotion) }}
        >
          {getEmotionIcon(currentEmotion)}
        </div>
        <div className="emotion-info">
          <div 
            className="emotion-text"
            style={{ color: getEmotionColor(currentEmotion) }}
          >
            {currentEmotion}
          </div>
          <div className="confidence-text">
            Confidence: {Math.round(confidence * 100)}%
          </div>
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="controls-panel">
        <button 
          onClick={handleTogglePause}
          className={`control-button ${isPaused ? 'pause-button' : ''}`}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button 
          onClick={handleRestart}
          className="control-button restart-button"
        >
          Restart
        </button>
      </div>

      {!faceDetected && !isPaused && (
        <div className="no-face-warning">
          ⚠️ No face detected - Position yourself in front of the camera
        </div>
      )}
    </div>
  );
};

export default WebcamDetector;