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
        className="container-fluid p-0 vh-100 vw-100"
        style={{
          backgroundColor: "black",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0
        }}
      >
        {/* Mobile: Stacked vertically, Desktop: Side by side */}
        <div className="row g-0 h-100">
          
          {/* Game Section */}
          <div className="col-12 col-lg-6 order-1 order-lg-1 d-flex justify-content-center align-items-center p-1"
               style={{ height: "50vh" }} // 50% height on mobile
               // On large screens, use full height
               onLoad={(e) => {
                 if (window.innerWidth >= 992) {
                   e.currentTarget.style.height = "100vh";
                 }
               }}>
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <div style={{ 
                maxWidth: "100%", 
                maxHeight: "100%",
                width: "auto",
                height: "auto"
              }}>
                <EmotionPong detectedEmotion={detectedEmotion} />
              </div>
            </div>
          </div>

          {/* Webcam Section */}
          <div className="col-12 col-lg-6 order-2 order-lg-2 d-flex justify-content-center align-items-center p-1"
               style={{ height: "50vh" }} // 50% height on mobile
               // On large screens, use full height
               onLoad={(e) => {
                 if (window.innerWidth >= 992) {
                   e.currentTarget.style.height = "100vh";
                 }
               }}>
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <div style={{ 
                maxWidth: "100%", 
                maxHeight: "100%",
                width: "auto",
                height: "auto"
              }}>
                <WebcamDetector onEmotionDetected={setDetectedEmotion} />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <style jsx>{`
        /* Responsive adjustments */
        @media (max-width: 991.98px) {
          .col-12 {
            height: 50vh !important;
          }
        }
        
        @media (min-width: 992px) {
          .col-lg-6 {
            height: 100vh !important;
          }
        }

        /* Ensure canvas elements scale properly */
        canvas {
          max-width: 100% !important;
          max-height: 100% !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain;
        }

        /* Hide scrollbars completely */
        body {
          overflow: hidden !important;
        }
        
        html {
          overflow: hidden !important;
        }
      `}</style>
    </>
  );
};

export default EmotionBlaster;