"use client";
import Link from "next/link";
import { Check } from "lucide-react";

export default function Confirmed() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-accent text-accent-fg flex items-center justify-center mb-6">
        <Check size={36} strokeWidth={2.5} />
      </div>
      <h1 className="text-[28px] font-bold tracking-tightest mb-2">You&apos;re booked.</h1>
      <p className="text-[14px] text-foreground/60 leading-relaxed max-w-[280px] mb-8">
        Your reservation is confirmed. You&apos;ll get a message from your host shortly with pickup details.
      </p>
      <Link
        href="/activity"
        className="w-full max-w-[280px] bg-accent text-accent-fg rounded-full py-3.5 font-semibold text-[14px] text-center"
      >
        View in Activity
      </Link>
      <Link href="/" className="mt-3 text-[13px] text-foreground/60 underline">
        Back to home
      </Link>
    </div>
  );
}
