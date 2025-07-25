import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emotion Type Racer",
  description: "Typing speed meets facial emotion detection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
