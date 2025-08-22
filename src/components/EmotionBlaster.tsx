// "use client";

// import React, { useState } from "react";
// import EmotionPong from "./EmotionPong";
// import WebcamDetector from "./WebcamDetector";

// interface EmotionBlasterProps {
//   playerName: string;
// }

// const EmotionBlaster: React.FC<EmotionBlasterProps> = ({ playerName }) => {
//   const [detectedEmotion, setDetectedEmotion] = useState("neutral");

//   return (
//     <>
//       {/* Bootstrap CSS */}
//       <link
//         href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
//         rel="stylesheet"
//       />

//       <div
//         className="container-fluid p-0"
//         style={{
//           backgroundColor: "black",
//           minHeight: "100vh",
//           width: "100vw",
//           overflow: "hidden"
//         }}
//       >
//         {/* Mobile: Game on top, Webcam on bottom */}
//         {/* Desktop: Side by side */}
//         <div className="row g-0 h-100">

//           {/* Game Section - First on mobile (top), Left on desktop */}
//           <div className="col-12 col-lg-6 order-1 order-lg-1 d-flex justify-content-center align-items-center p-2">
//             <div className="w-100 d-flex justify-content-center">
//               <EmotionPong detectedEmotion={detectedEmotion} />
//             </div>
//           </div>

//           {/* Webcam Section - Second on mobile (bottom), Right on desktop */}
//           <div className="col-12 col-lg-6 order-2 order-lg-2 d-flex justify-content-center align-items-center p-2">
//             <div className="w-100 d-flex justify-content-center">
//               <WebcamDetector onEmotionDetected={setDetectedEmotion} />
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default EmotionBlaster;

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
        className="container-fluid p-0 vh-100 vw-100 emotion-blaster-main"
        style={{
          backgroundColor: "black",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        {/* Mobile: Stacked vertically, Desktop: Side by side */}
        <div className="row g-0 h-100 flex-column flex-lg-row emotion-blaster-flex">
          {/* Game Section */}
          <div className="col-12 col-lg-6 order-1 order-lg-1 d-flex justify-content-center align-items-center p-1 emotion-blaster-section emotion-blaster-pong">
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <div
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <EmotionPong detectedEmotion={detectedEmotion} />
              </div>
            </div>
          </div>

          {/* Webcam Section */}
          <div className="col-12 col-lg-6 order-2 order-lg-2 d-flex justify-content-center align-items-center p-1 emotion-blaster-section emotion-blaster-webcam">
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <div
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                }}
              >
                <WebcamDetector onEmotionDetected={setDetectedEmotion} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .emotion-blaster-flex {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .emotion-blaster-section {
          min-height: 0;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .emotion-blaster-section::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 991.98px) {
          .emotion-blaster-section {
            height: 50vh !important;
            max-height: 50vh !important;
          }
        }
        @media (min-width: 992px) {
          .emotion-blaster-flex {
            flex-direction: row;
          }
          .emotion-blaster-section {
            height: 100vh;
            max-height: 100vh;
          }
        }
        /* Ensure canvas elements scale properly and fill parent */
        canvas {
          max-width: 100% !important;
          max-height: 100% !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
          display: block;
        }
      `}</style>
    </>
  );
};

export default EmotionBlaster;
