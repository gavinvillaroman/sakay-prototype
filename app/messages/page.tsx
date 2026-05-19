"use client";
import { Search, Settings, MessageSquare } from "lucide-react";
import { useState } from "react";

const FILTERS = ["All", "Booking", "Support"] as const;

export default function MessagesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 pt-5 md:pt-10 pb-12">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-[28px] md:text-[40px] font-bold tracking-tightest leading-none">
          Messages
        </h1>
        <div className="flex items-center gap-2">
          <button
            aria-label="Search messages"
            className="tap w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center"
          >
            <Search size={17} />
          </button>
          <button
            aria-label="Message settings"
            className="tap w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 py-4 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tap flex-shrink-0 px-5 py-2.5 rounded-full text-[14px] font-semibold tracking-tight ${
                active
                  ? "bg-accent text-accent-fg"
                  : "bg-surface-soft text-foreground"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center text-center py-24 md:py-36 float-in">
        <div className="w-16 h-16 rounded-2xl bg-surface-soft flex items-center justify-center mb-5">
          <MessageSquare size={28} strokeWidth={1.75} className="text-foreground/70" />
        </div>
        <div className="text-[18px] font-bold tracking-tight mb-1">You don&apos;t have any messages</div>
        <p className="text-[14px] text-foreground/60 max-w-[300px] leading-relaxed">
          When you book a vehicle, you&apos;ll be able to chat with your host here.
        </p>
      </div>
    </div>
  );
}
