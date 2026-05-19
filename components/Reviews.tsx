"use client";
import Image from "next/image";
import { Star } from "lucide-react";
import { useState } from "react";
import type { Review } from "@/lib/mock";

export default function Reviews({
  reviews,
  rating,
  initialCount = 3,
}: {
  reviews: Review[];
  rating: number;
  initialCount?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  if (reviews.length === 0) return null;

  const visible = showAll ? reviews : reviews.slice(0, initialCount);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Star size={18} className="fill-black" />
        <span className="text-[18px] font-bold tracking-tight">
          {rating.toFixed(2)}
        </span>
        <span className="text-[14px] text-gray-500">
          · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="space-y-5">
        {visible.map((r) => (
          <div key={r.id}>
            <div className="flex items-center gap-3 mb-1.5">
              {r.reviewerPhoto ? (
                <Image
                  src={r.reviewerPhoto}
                  alt={r.reviewerName}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[13px] font-semibold">
                  {r.reviewerName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[14px] font-semibold tracking-tight truncate">
                  {r.reviewerName}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={i < r.rating ? "fill-black" : "fill-gray-300 stroke-gray-300"}
                      />
                    ))}
                  </span>
                  <span>·</span>
                  <span>{r.date}</span>
                </div>
              </div>
            </div>
            <p className="text-[13.5px] text-gray-800 leading-relaxed">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      {reviews.length > initialCount && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-5 w-full border hairline rounded-full py-2.5 text-[13px] font-semibold"
        >
          {showAll ? "Show fewer" : `Show all ${reviews.length} reviews`}
        </button>
      )}
    </div>
  );
}
