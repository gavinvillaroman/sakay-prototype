"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";

const TRIGGER = 80;
const MAX = 120;

export default function PullToRefresh({ onRefresh }: { onRefresh?: () => Promise<void> | void }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const active = useRef(false);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || refreshing) return;
      startY.current = e.touches[0].clientY;
      active.current = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!active.current || startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0) {
        // Dampened pull
        const eased = Math.min(MAX, Math.pow(dy, 0.85));
        setPull(eased);
      }
    };
    const onTouchEnd = async () => {
      if (!active.current) return;
      active.current = false;
      startY.current = null;
      if (pull >= TRIGGER) {
        setRefreshing(true);
        try {
          await Promise.resolve(onRefresh?.());
          await new Promise((r) => setTimeout(r, 600));
        } finally {
          setRefreshing(false);
          setPull(0);
          if (!onRefresh) window.location.reload();
        }
      } else {
        setPull(0);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pull, refreshing, onRefresh]);

  const ready = pull >= TRIGGER;
  const progress = Math.min(1, pull / TRIGGER);

  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-40"
      style={{
        transform: `translateY(${refreshing ? TRIGGER : pull}px)`,
        transition: refreshing || pull === 0 ? "transform 300ms cubic-bezier(0.4,0,0.2,1)" : "none",
        marginTop: "calc(env(safe-area-inset-top) - 32px)",
      }}
    >
      {refreshing ? (
        <Loader2 size={20} className="text-accent animate-spin" />
      ) : (
        <ChevronDown
          size={20}
          className={`transition ${ready ? "text-accent rotate-180" : "text-foreground/40"}`}
          style={{ opacity: progress }}
        />
      )}
    </div>
  );
}
