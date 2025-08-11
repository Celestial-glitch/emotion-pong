import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emotion Pong Game",
  description: "Make expressions to play the game.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
