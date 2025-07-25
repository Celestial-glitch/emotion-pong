"use client";

import React, { useState } from "react";

import EmotionPong from "./EmotionPong";
import WebcamDetector from "./WebcamDetector";

interface EmotionBlasterProps {
  playerName: string;
}

const EmotionBlaster: React.FC<EmotionBlasterProps> = ({ playerName }) => {
  const [detectedEmotion, setDetectedEmotion] = useState("neutral");

  // const EmotionBlaster = () => {
  //   const [detectedEmotion, setDetectedEmotion] = useState("neutral");

  //   return (
  //   <div className="flex flex-row justify-center items-start gap-8 w-full max-w-6xl mx-auto mt-6">
  //     {/* Left: Game */}
  //     <div className="flex-1 flex justify-center">
  //       <EmotionPong detectedEmotion={detectedEmotion} />
  //     </div>

  //     {/* Right: Webcam feed */}
  //     <div className="flex-1 flex justify-center">
  //       <WebcamDetector onEmotionDetected={setDetectedEmotion} />
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className="flex w-full h-screen">
  //     {/* Left: Game */}
  //     <div className="w-1/2 flex justify-center items-center bg-gray-100">
  //       <EmotionPong detectedEmotion={detectedEmotion} />
  //     </div>

  //     {/* Right: Webcam feed */}
  //     <div className="w-1/2 flex justify-center items-center bg-gray-200">
  //       <WebcamDetector onEmotionDetected={setDetectedEmotion} />
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className="d-flex w-100 vh-100">
  //     {/* Left: Game */}
  //     <div className="w-50 d-flex justify-content-center align-items-center bg-light">
  //       <EmotionPong detectedEmotion={detectedEmotion} />
  //     </div>

  //     {/* Right: Webcam feed */}
  //     <div className="w-50 d-flex justify-content-center align-items-center bg-secondary bg-opacity-25">
  //       <WebcamDetector onEmotionDetected={setDetectedEmotion} />
  //     </div>
  //   </div>
  // );

  return (
    <div className="container mt-4">
      <div
        className="row justify-content-center align-items-start g-4"
        style={{
          display: "flex",
          width: "100vw",
          justifyContent: "center",
          // alignItems: "center",
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
