"use client";
import Link from "next/link";
import { useEffect } from "react";

const CONFETTI_COLORS = ["#00b14f", "#000000", "#ffd60a", "#ff453a", "#5e5ce6"];

const spawnConfetti = () => {
  if (typeof window === "undefined") return;
  const total = 80;
  for (let i = 0; i < total; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const x = Math.random() * 100;
    const dx = (Math.random() - 0.5) * 60;
    const dur = 1.6 + Math.random() * 1.4;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.left = `${x}vw`;
    piece.style.background = color;
    piece.style.setProperty("--dx", `${dx}vw`);
    piece.style.setProperty("--dur", `${dur}s`);
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), (dur + 0.5) * 1000);
  }
};

export default function Confirmed() {
  useEffect(() => {
    spawnConfetti();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-accent text-accent-fg flex items-center justify-center mb-6 check-pop">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12.5l4.5 4.5L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-stroke"
          />
        </svg>
      </div>
      <h1 className="text-[28px] font-bold tracking-tightest mb-2 float-in">You&apos;re booked.</h1>
      <p className="text-[14px] text-foreground/60 leading-relaxed max-w-[280px] mb-8 float-in float-in-delay-1">
        Your reservation is confirmed. You&apos;ll get a message from your host shortly with pickup details.
      </p>
      <Link
        href="/activity"
        className="tap w-full max-w-[280px] bg-accent text-accent-fg rounded-full py-3.5 font-semibold text-[14px] text-center float-in float-in-delay-2"
      >
        View in Activity
      </Link>
      <Link href="/" className="mt-3 text-[13px] text-foreground/60 underline float-in float-in-delay-3">
        Back to home
      </Link>
    </div>
  );
}
