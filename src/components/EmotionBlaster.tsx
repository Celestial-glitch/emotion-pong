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
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      
      <div 
        className="container-fluid p-0"
        style={{
          backgroundColor: "black",
          minHeight: "100vh",
          width: "100vw",
          overflow: "hidden"
        }}
      >
        {/* Mobile: Game on top, Webcam on bottom */}
        {/* Desktop: Side by side */}
        <div className="row g-0 h-100">
          
          {/* Game Section - First on mobile (top), Left on desktop */}
          <div className="col-12 col-lg-6 order-1 order-lg-1 d-flex justify-content-center align-items-center p-2">
            <div className="w-100 d-flex justify-content-center">
              <EmotionPong detectedEmotion={detectedEmotion} />
            </div>
          </div>

          {/* Webcam Section - Second on mobile (bottom), Right on desktop */}
          <div className="col-12 col-lg-6 order-2 order-lg-2 d-flex justify-content-center align-items-center p-2">
            <div className="w-100 d-flex justify-content-center">
              <WebcamDetector onEmotionDetected={setDetectedEmotion} />
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default EmotionBlaster;