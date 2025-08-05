"use client";

import React, { useEffect, useRef, useState } from "react";

const EMOTIONS = ["happy", "sad", "angry", "surprised", "neutral"];
const EMOJI_MAP: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
  neutral: "😐",
};

type FallingEmotion = {
  id: number;
  emotion: string;
  y: number;
};

const EmotionGame = ({ detectedEmotion }: { detectedEmotion: string }) => {
  const [fallingEmotions, setFallingEmotions] = useState<FallingEmotion[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Create falling emotions
  useEffect(() => {
    const interval = setInterval(() => {
      const newEmotion: FallingEmotion = {
        id: Date.now(),
        emotion: EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)],
        y: 0,
      };
      setFallingEmotions((prev) => [...prev, newEmotion]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Move emotions down
  useEffect(() => {
    const interval = setInterval(() => {
      setFallingEmotions((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + 5 }))
          .filter((item) => item.y < 400) // height limit
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Check for match with detected emotion
  useEffect(() => {
    setFallingEmotions((prev) => {
      const updated = prev.filter((item) => {
        const isMatch = item.emotion === detectedEmotion;
        const isClose = item.y > 300; // near bottom
        if (isMatch && isClose) {
          setScore((s) => s + 1);
          return false;
        }
        return true;
      });
      return updated;
    });
  }, [detectedEmotion]);

  // Lose lives when emotion reaches bottom
  useEffect(() => {
    setFallingEmotions((prev) => {
      const filtered = prev.filter((item) => {
        if (item.y >= 400) {
          setLives((l) => l - 1);
          return false;
        }
        return true;
      });
      return filtered;
    });
  }, [fallingEmotions]);

  return (
    <div className="mt-6 text-center">
      <div className="border border-gray-300 rounded-md p-4 inline-block bg-white shadow-lg">
        <h2 className="text-xl font-semibold">Emotion Blaster 🎯</h2>
        <p>Match your face with the falling emoji to blast it!</p>
        <div
          ref={gameAreaRef}
          className="relative w-[300px] h-[400px] bg-gray-100 mt-4 overflow-hidden rounded-md"
        >
          {fallingEmotions.map((item) => (
            <div
              key={item.id}
              className="absolute left-1/2 transform -translate-x-1/2 text-2xl transition-all"
              style={{ top: item.y }}
            >
              {EMOJI_MAP[item.emotion]}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-lg">
            Your Expression: {EMOJI_MAP[detectedEmotion]} {detectedEmotion}
          </p>
          <p className="mt-2">Score: {score} | Lives: {lives}</p>
          {lives <= 0 && <p className="text-red-500 mt-2">Game Over 😢</p>}
        </div>
      </div>
    </div>
  );
};

export default EmotionGame;

