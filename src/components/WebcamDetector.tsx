"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

interface WebcamDetectorProps {
  onEmotionDetected: (emotion: string) => void;
   playerName: string; // Add playerName prop
}

const WebcamDetector: React.FC<WebcamDetectorProps> = ({
  onEmotionDetected,
   playerName, // Accept playerName prop
}) => {
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
  const [videoSize, setVideoSize] = useState({
    width: 600,
    height: 450,
  });

  // Calculate responsive video size - same as game canvas
  useEffect(() => {
    const updateVideoSize = () => {
      const isMobile = window.innerWidth < 768;
      const availableWidth = Math.min(
        window.innerWidth - 40,
        isMobile ? 350 : 600
      );
      const aspectRatio = 4 / 3; // Same as game (600/450)

      const width = availableWidth;
      const height = width / aspectRatio;

      setVideoSize({ width, height });
    };

    updateVideoSize();
    window.addEventListener("resize", updateVideoSize);
    return () => window.removeEventListener("resize", updateVideoSize);
  }, []);

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "😊";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      case "surprised":
        return "😲";
      case "fearful":
        return "😨";
      case "disgusted":
        return "🤢";
      case "neutral":
        return "😐";
      default:
        return "🤖";
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "#00ff88";
      case "sad":
        return "#4a90e2";
      case "angry":
        return "#ff0066";
      case "surprised":
        return "#ff6b00";
      case "fearful":
        return "#9b59b6";
      case "disgusted":
        return "#f39c12";
      case "neutral":
        return "#888888";
      default:
        return "#00ff88";
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

    if (
      !video ||
      !canvas ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
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
          scoreThreshold: 0.3, // Lower threshold for faster detection
        });

        const detections = await faceapi
          .detectAllFaces(video, detectionOptions)
          .withFaceLandmarks()
          .withFaceExpressions();

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.matchDimensions(canvas, displaySize);
        const resized = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Optimized drawing with reduced effects for performance
          ctx.imageSmoothingEnabled = false;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          ctx.lineWidth = 2;
        }

        // Streamlined drawing for better performance
        resized.forEach((detection) => {
          const { x, y, width, height } = detection.detection.box;

          if (ctx) {
            // Simple corner brackets for speed
            const cornerSize = 15;
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#00ff88";

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
        console.error("Detection error:", error);
      }
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [onEmotionDetected, isPaused]);

  useEffect(() => {
    const loadModels = async () => {
      if (modelsLoaded.current) return;

      console.log("Loading models...");
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(
          "/models/tiny_face_detector_model"
        ),
        faceapi.nets.faceExpressionNet.loadFromUri(
          "/models/face_expression_model"
        ),
        faceapi.nets.faceLandmark68Net.loadFromUri(
          "/models/face_landmark_68_model"
        ),
      ]);

      modelsLoaded.current = true;
      console.log("Models loaded successfully");
    };

    const startVideo = async () => {
      try {
        // Request higher quality video for better detection
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30, max: 60 }, // Higher frame rate
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            // Start processing once video is ready
            animationFrameRef.current = requestAnimationFrame(processFrame);
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
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
        tracks.forEach((track) => track.stop());
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
    <div
      className="d-flex flex-column align-items-center w-100 shared-bg webcam-detector-main"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        fontFamily: '"Orbitron", monospace',
        color: "#ffffff",
        width: "100%",
        height: "100%",
      }}
    >
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap");
        @media (max-width: 991.98px) {
          .webcam-detector-main {
            min-height: 0 !important;
            height: 100% !important;
            width: 100% !important;
            padding: 0 !important;
          }
        }
        @media (min-width: 992px) {
          .webcam-detector-main {
            min-height: 100vh;
            padding: 10px;
          }
        }
        .neural-heading {
          font-size: clamp(1.2rem, 4vw, 2rem);
        }
        @media (min-width: 992px) {
          .neural-heading {
            font-size: clamp(1.5rem, 5vw, 3rem);
          }
        }
      `}</style>

      <div className="text-center mb-3">
        <div
          className="neural-heading"
          style={{
            fontFamily: '"Courier New", monospace',
            fontWeight: 900,
            letterSpacing: "3px",
            color: "#ffffff",
            textShadow: "2px 2px 0px #00ff88, 0 0 10px rgba(0, 255, 136, 0.5)",
            textTransform: "uppercase",
          }}
        >
          {playerName}'s Webcam
        </div>
      </div>

      {/* Emotion Display */}
      <div
        className="d-flex align-items-center justify-content-center mb-3 p-3 bg-dark bg-opacity-50 rounded"
        style={{
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          maxWidth: `${videoSize.width}px`,
          width: "100%",
        }}
      >
        <div
          className="me-3"
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            color: getEmotionColor(currentEmotion),
            filter: "drop-shadow(0 0 8px currentColor)",
          }}
        >
          {getEmotionIcon(currentEmotion)}
        </div>
        <div className="text-start flex-grow-1">
          <div
            className="h4 mb-1"
            style={{
              color: getEmotionColor(currentEmotion),
              textTransform: "uppercase",
              letterSpacing: "1px",
              textShadow: "0 0 8px currentColor",
            }}
          >
            {currentEmotion}
          </div>
          <div className="small text-muted mb-2">
            Confidence: {Math.round(confidence * 100)}%
          </div>
          <div className="progress" style={{ height: "6px" }}>
            <div
              className="progress-bar"
              style={{
                width: `${confidence * 100}%`,
                background: "linear-gradient(90deg, #00ff88, #00cc6a)",
                boxShadow: "0 0 8px rgba(0, 255, 136, 0.4)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div
        className="position-relative mb-3 border rounded overflow-hidden"
        style={{
          width: `${videoSize.width}px`,
          height: `${videoSize.height}px`,
          maxWidth: "100%",
          border: "2px solid rgba(255, 255, 255, 0.2) !important",
          boxShadow: "0 0 30px rgba(0, 0, 0, 0.8)",
          background: "#000000",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            objectFit: "cover",
            filter: "contrast(1.1) brightness(0.95)",
          }}
        />
        <canvas
          ref={canvasRef}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ pointerEvents: "none", zIndex: 10 }}
        />

        {/* Status Overlay */}
        <div
          className="position-absolute top-0 start-0 m-2 px-2 py-1 bg-dark bg-opacity-75 rounded small text-light"
          style={{
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {faceDetected ? "FACE LOCKED" : "SCANNING..."}
        </div>

        {/* Performance Overlay */}
        <div
          className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded small"
          style={{
            background: "rgba(0, 255, 136, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 255, 136, 0.3)",
            color: "#00ff88",
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {fps} FPS
        </div>

        {/* Pause Overlay */}
        {isPaused && (
          <div
            className="position-absolute top-50 start-50 translate-middle p-3 bg-dark bg-opacity-75 rounded text-center"
            style={{
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 107, 0, 0.5)",
              color: "#ff6b00",
              fontWeight: 700,
              textShadow: "0 0 10px rgba(255, 107, 0, 0.5)",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            DETECTION PAUSED
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="d-flex gap-3 flex-wrap justify-content-center mb-3">
        <button
          onClick={handleTogglePause}
          className={`btn px-3 py-2 ${
            isPaused ? "btn-outline-warning" : "btn-outline-light"
          }`}
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

      {/* Warning Message */}
      {/* {!faceDetected && !isPaused && (
        <div 
          className="alert alert-warning d-flex align-items-center text-center small"
          style={{
            background: 'rgba(255, 107, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            color: '#ff6b00',
            maxWidth: '400px'
          }}
        >
          <span className="me-2">⚠️</span>
          No face detected - Position yourself in front of the camera
        </div>
      )} */}
    </div>
  );
};

export default WebcamDetector;
