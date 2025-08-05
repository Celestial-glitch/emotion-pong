"use client";

import React, { useState } from "react";

import EmotionPong from "./EmotionPong";
import WebcamDetector from "./WebcamDetector";

interface EmotionBlasterProps {
  playerName: string;
}

const EmotionBlaster: React.FC<EmotionBlasterProps> = ({ playerName }) => {
  const [detectedEmotion, setDetectedEmotion] = useState("neutral");

  return (
    <div className="container mt-4">
      <div
        className="row justify-content-center align-items-start g-4"
        style={{
          backgroundColor: "black",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "20px",
        }}
      >
        {/* Left: Game */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <EmotionPong detectedEmotion={detectedEmotion} />
        </div>

        {/* Right: Webcam feed */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <WebcamDetector onEmotionDetected={setDetectedEmotion} />
        </div>
      </div>
    </div>
  );
};

export default EmotionBlaster;
