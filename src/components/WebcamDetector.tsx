"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

interface WebcamDetectorProps {
  onEmotionDetected: (emotion: string) => void;
}

const WebcamDetector: React.FC<WebcamDetectorProps> = ({ onEmotionDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelsLoaded = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastProcessTime = useRef<number>(0);
  
  const [isPaused, setIsPaused] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [confidence, setConfidence] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [fps, setFps] = useState(0);

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

  // Optimized detection function with requestAnimationFrame
  const processFrame = useCallback(async () => {
    if (isPaused) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const now = performance.now();
    
    // Process every 100ms for faster detection while maintaining performance
    if (now - lastProcessTime.current > 100) {
      try {
        // Use smaller input size for faster processing
        const detectionOptions = new faceapi.TinyFaceDetectorOptions({
          inputSize: 256, // Reduced from default 416 for speed
          scoreThreshold: 0.3 // Lower threshold for faster detection
        });

        const detections = await faceapi
          .detectAllFaces(video, detectionOptions)
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
          
          // Optimized drawing with reduced effects for performance
          ctx.imageSmoothingEnabled = false;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
        }

        // Streamlined drawing for better performance
        resized.forEach(detection => {
          const { x, y, width, height } = detection.detection.box;
          
          if (ctx) {
            // Simple corner brackets for speed
            const cornerSize = 15;
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#00ff88';
            
            // Draw all corners in one path for efficiency
            ctx.beginPath();
            // Top-left
            ctx.moveTo(x, y + cornerSize);
            ctx.lineTo(x, y);
            ctx.lineTo(x + cornerSize, y);
            // Top-right
            ctx.moveTo(x + width - cornerSize, y);
            ctx.lineTo(x + width, y);
            ctx.lineTo(x + width, y + cornerSize);
            // Bottom-left
            ctx.moveTo(x, y + height - cornerSize);
            ctx.lineTo(x, y + height);
            ctx.lineTo(x + cornerSize, y + height);
            // Bottom-right
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

        // Calculate FPS
        const processingTime = performance.now() - now;
        const currentFps = Math.round(1000 / Math.max(processingTime, 100));
        setFps(currentFps);
        
        lastProcessTime.current = now;
      } catch (error) {
        console.error('Detection error:', error);
      }
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [onEmotionDetected, isPaused]);

  useEffect(() => {
    const loadModels = async () => {
      if (modelsLoaded.current) return;
      
      console.log('Loading models...');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector_model"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression_model"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68_model")
      ]);
      
      modelsLoaded.current = true;
      console.log('Models loaded successfully');
    };

    const startVideo = async () => {
      try {
        // Request higher quality video for better detection
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30, max: 60 } // Higher frame rate
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            // Start processing once video is ready
            animationFrameRef.current = requestAnimationFrame(processFrame);
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    loadModels().then(startVideo);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Clean up video stream
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [processFrame]);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setCurrentEmotion("neutral");
    setConfidence(0);
    setFaceDetected(false);
    setIsPaused(false);
    setFps(0);
  };

  return (
    <div className="webcam-detector-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .webcam-detector-container {
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

        .webcam-detector-container::before {
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

        .detector-title {
          font-family: 'Courier New', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 25px;
          color: #ffffff;
          letter-spacing: 4px;
          position: relative;
          z-index: 1;
          text-shadow: 
            2px 2px 0px #00ff88,
            4px 4px 0px #007755,
            0 0 10px rgba(0, 255, 136, 0.5);
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          text-transform: uppercase;
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

        .video-container {
          position: relative;
          width: 640px;
          height: 480px;
          margin: 0 auto 25px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 
            0 0 30px rgba(0, 0, 0, 0.8),
            inset 0 0 1px rgba(255, 255, 255, 0.1);
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
          filter: contrast(1.1) brightness(0.95);
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
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
          color: #ffffff;
          z-index: 15;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .performance-overlay {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 255, 136, 0.1);
          backdrop-filter: blur(10px);
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid rgba(0, 255, 136, 0.3);
          font-size: 0.75rem;
          color: #00ff88;
          z-index: 15;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 16px rgba(0, 255, 136, 0.2);
        }

        .pause-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid rgba(255, 107, 0, 0.5);
          color: #ff6b00;
          font-size: 1.3rem;
          font-weight: 700;
          z-index: 20;
          text-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 0 8px 32px rgba(255, 107, 0, 0.3);
        }

        .emotion-display {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 25px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
          min-width: 350px;
        }

        .emotion-icon {
          font-size: 3.5rem;
          margin-right: 25px;
          filter: drop-shadow(0 0 8px currentColor);
          animation: emotionFloat 2s ease-in-out infinite;
        }

        @keyframes emotionFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        .emotion-info {
          text-align: left;
        }

        .emotion-text {
          font-size: 1.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 0 8px currentColor;
          margin-bottom: 8px;
        }

        .confidence-text {
          font-size: 0.9rem;
          color: #cccccc;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .confidence-bar {
          width: 220px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88, #00cc6a);
          border-radius: 2px;
          transition: width 0.3s ease;
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
        }

        .controls-panel {
          display: flex;
          gap: 15px;
          position: relative;
          z-index: 1;
          margin-bottom: 20px;
        }

        .control-button {
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
        }

        .control-button:hover {
          background: rgba(0, 255, 136, 0.2);
          border-color: rgba(0, 255, 136, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 255, 136, 0.3);
        }

        .pause-button:hover {
          background: rgba(255, 107, 0, 0.2);
          border-color: rgba(255, 107, 0, 0.4);
          box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);
        }

        .restart-button:hover {
          background: rgba(255, 100, 100, 0.2);
          border-color: rgba(255, 100, 100, 0.4);
          box-shadow: 0 6px 20px rgba(255, 100, 100, 0.3);
        }

        .no-face-warning {
          background: rgba(255, 107, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          color: #ff6b00;
          padding: 15px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          position: relative;
          z-index: 1;
          font-weight: 500;
          box-shadow: 0 4px 16px rgba(255, 107, 0, 0.2);
          max-width: 500px;
        }

        .no-face-warning::before {
          content: '⚠️';
          margin-right: 8px;
          font-size: 1.1em;
        }
      `}</style>

      <div className="detector-title">Neural Interface Scanner</div>
      

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
        
        <div className="performance-overlay">
          {fps} FPS
        </div>
        
        {isPaused && (
          <div className="pause-overlay">
            DETECTION PAUSED
          </div>
        )}
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
          No face detected - Position yourself in front of the camera
        </div>
      )}
    </div>
  );
};

export default WebcamDetector;