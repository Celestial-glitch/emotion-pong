// // import WebcamDetector from "../components/WebcamDetector";


// // import React from "react";

// // import EmotionBlaster from "@/components/EmotionBlaster";

// // export default function Home() {
// //   return (
// //     <main className="flex flex-col items-center justify-center min-h-screen p-4">
// //       <h1 className="text-3xl font-bold mb-4">🎯 Emotion Blaster Game</h1>
// //       {/* <EmotionBlaster /> */}
// //     </main>
// //   );
// // }
// // src/app/page.tsx
// // 'use client';

// // import { useState } from 'react';
// // import EmotionBlaster from '../components/EmotionBlaster';

// // export default function HomePage() {
// //   const [started, setStarted] = useState(false);

// //   if (started) {
// //     return <EmotionBlaster />;
// //   }

// //   return (
// //     <div className="w-screen h-screen bg-black flex items-center justify-center relative">
// //       {/* Retro paddles */}
// //       <div className="absolute left-6 h-32 w-2 bg-white" />
// //       <div className="absolute right-6 h-32 w-2 bg-white" />

// //       {/* Title & Button */}
// //       <div className="flex flex-col items-center space-y-6">
// //         <h1 className="text-white text-7xl font-mono tracking-widest">PONG</h1>
// //         <button
// //           onClick={() => setStarted(true)}
// //           className="bg-white text-black font-mono px-8 py-2 text-xl hover:bg-gray-300 transition"
// //         >
// //           PLAY
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import React, { useState, useEffect } from 'react';
// import "../styles/globals.css";

// const PongHomepage = () => {
//   const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
//   const [playerName, setPlayerName] = useState('');
//   const [gameStarted, setGameStarted] = useState(false);

//   // Initialize Web Audio API
//   useEffect(() => {
//     const initAudio = () => {
//       try {
//         const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
//         setAudioContext(ctx);
//       } catch (error) {
//         console.log('Web Audio API not supported');
//       }
//     };
    
//     initAudio();
    
//     return () => {
//       if (audioContext) {
//         audioContext.close();
//       }
//     };
//   }, []);

//   // Create retro beep sound effect
//   const playBeep = () => {
//     if (!audioContext) return;
    
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();
    
//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);
    
//     oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
//     oscillator.type = 'square';
    
//     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
//     oscillator.start(audioContext.currentTime);
//     oscillator.stop(audioContext.currentTime + 0.2);
//   };

//   const handlePlayClick = () => {
//     if (!playerName.trim()) {
//       alert('Please enter your name!');
//       return;
//     }
    
//     playBeep();
//     setGameStarted(true);
//     // Add your game start logic here
//     console.log(`Starting emotion-detection Pong for player: ${playerName}`);
//   };

//   const handleInputClick = () => {
//     playBeep();
//   };

//   return (
   
//     <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono select-none relative overflow-hidden">
//       {/* Retro grid background */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
//           {Array.from({ length: 400 }).map((_, i) => (
//             <div key={i} className="border border-green-500 border-opacity-20"></div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 flex flex-col items-center">
//         {/* Pixelated PONG Title */}
//         <div className="mb-12">
//           <div className="pixel-title text-white mb-4">
//             <div className="flex gap-4">
//               {/* P */}
//               <div className="flex flex-col gap-1">
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-empty"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-empty"></div>
//                 </div>
//               </div>

//               {/* O */}
//               <div className="flex flex-col gap-1">
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//               </div>

//               {/* N */}
//               <div className="flex flex-col gap-1">
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//               </div>

//               {/* G */}
//               <div className="flex flex-col gap-1">
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-empty"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-empty"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//                 <div className="flex gap-1">
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                   <div className="pixel-block"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Subtitle */}
//           <p className="text-green-400 text-lg text-center tracking-widest font-bold animate-pulse">
//             EMOTION DETECTION MODE
//           </p>
//         </div>

//         {/* Player Name Input */}
//         <div className="mb-8 text-center">
//           <label className="block text-white text-xl mb-4 tracking-wider">
//             ENTER PLAYER NAME
//           </label>
//           <input
//             type="text"
//             value={playerName}
//             onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
//             onClick={handleInputClick}
//             onFocus={handleInputClick}
//             placeholder="YOUR NAME"
//             maxLength={12}
//             className="bg-black border-4 border-white text-white text-2xl px-6 py-3 text-center tracking-widest font-bold placeholder-gray-500 focus:border-green-400 focus:outline-none retro-input"
//           />
//         </div>

//         {/* Game Area Preview - Single Player */}
//         <div className="relative mb-12 border-2 border-white border-opacity-30 p-8">
//           {/* Player Paddle (Bottom) */}
//           <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-green-400 shadow-lg shadow-green-400/50"></div>
          
//           {/* Blocks/Targets at top */}
//           <div className="absolute top-4 left-1/4 w-4 h-3 bg-red-400 shadow-sm shadow-red-400/50"></div>
//           <div className="absolute top-4 left-1/3 w-4 h-3 bg-yellow-400 shadow-sm shadow-yellow-400/50"></div>
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-blue-400 shadow-sm shadow-blue-400/50"></div>
//           <div className="absolute top-4 right-1/3 w-4 h-3 bg-purple-400 shadow-sm shadow-purple-400/50"></div>
//           <div className="absolute top-4 right-1/4 w-4 h-3 bg-orange-400 shadow-sm shadow-orange-400/50"></div>
          
//           {/* Ball */}
//           <div className="absolute left-1/3 bottom-16 w-3 h-3 bg-white animate-bounce-diagonal shadow-lg shadow-white/50"></div>
          
//           {/* Playing Field */}
//           <div className="w-80 h-48 bg-transparent"></div>
//         </div>

//         {/* Play Button */}
//         <button
//           onClick={handlePlayClick}
//           disabled={!playerName.trim()}
//           className={`px-16 py-4 text-2xl font-bold tracking-widest transition-all duration-150 retro-button ${
//             playerName.trim() 
//               ? 'bg-white text-black hover:bg-green-400 hover:text-black active:scale-95' 
//               : 'bg-gray-600 text-gray-400 cursor-not-allowed'
//           }`}
//         >
//           START GAME
//         </button>

//         {/* Game Info */}
//         <div className="mt-12 text-center">
//           <div className="text-white text-lg mb-4">
//             <span className="text-green-400">PLAYER</span> VS <span className="text-red-400">TARGETS</span>
//           </div>
//           <div className="text-gray-400 text-sm max-w-md">
//             Break all the blocks using your emotions to control paddle movement!
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="absolute bottom-4 text-white text-xs opacity-40 text-center">
//           <p>Camera access required for emotion detection | Be expressive to play better!</p>
//         </div>
//       </div>

//       <style jsx>{`
//         .pixel-block {
//           width: 16px;
//           height: 16px;
//           background-color: white;
//           box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
//         }
        
//         .pixel-empty {
//           width: 16px;
//           height: 16px;
//           background-color: transparent;
//         }
        
//         .retro-button {
//           border: none;
//           box-shadow: 
//             0 6px 0 #666,
//             0 8px 0 #444,
//             0 10px 20px rgba(0, 0, 0, 0.5);
//           image-rendering: pixelated;
//         }
        
//         .retro-button:active:not(:disabled) {
//           transform: translateY(4px) scale(0.95);
//           box-shadow: 
//             0 2px 0 #666,
//             0 4px 0 #444,
//             0 6px 15px rgba(0, 0, 0, 0.3);
//         }
        
//         .retro-input {
//           image-rendering: pixelated;
//           box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
//         }
        
//         .retro-input:focus {
//           box-shadow: 
//             inset 0 0 10px rgba(34, 197, 94, 0.3),
//             0 0 20px rgba(34, 197, 94, 0.2);
//         }
        
//         @keyframes bounce-diagonal {
//           0% { 
//             transform: translate(0, 0);
//           }
//           25% { 
//             transform: translate(20px, -15px);
//           }
//           50% { 
//             transform: translate(40px, -30px);
//           }
//           75% { 
//             transform: translate(20px, -15px);
//           }
//           100% { 
//             transform: translate(0, 0);
//           }
//         }
        
//         .animate-bounce-diagonal {
//           animation: bounce-diagonal 3s infinite ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PongHomepage;

import WebcamDetector from "../components/WebcamDetector";


import React from "react";

import PongHomepage from "@/components/PongHomepage";
import EmotionBlaster from "@/components/EmotionBlaster";

export default function Home() {
  return (
    // <main className="flex flex-col items-center justify-center min-h-screen p-4">
    //   <h1 className="text-3xl font-bold mb-4">🎯 Emotion Blaster Game</h1>
    //   {/* <EmotionBlaster /> */}
    //  <EmotionBlaster />
    // </main>
    <PongHomepage/>
    
    
  );
}
