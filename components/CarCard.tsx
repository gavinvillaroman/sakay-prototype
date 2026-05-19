"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, Zap } from "lucide-react";
import type { Car } from "@/lib/mock";

export default function CarCard({ car, variant = "grid" }: { car: Car; variant?: "grid" | "wide" }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Link href={`/car/${car.id}`} className="tap block">
      <div className={`relative ${variant === "wide" ? "aspect-[4/3]" : "aspect-[4/3]"} rounded-2xl overflow-hidden ${loaded ? "" : "shimmer"}`}>
        <Image
          src={car.photo}
          alt={`${car.make} ${car.model}`}
          fill
          unoptimized
          onLoad={() => setLoaded(true)}
          className={`object-cover img-fade ${loaded ? "loaded" : ""}`}
        />
        {car.blackOnly && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
            Sakay Black
          </div>
        )}
        {car.regionTag && !car.blackOnly && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-black text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full">
            {car.regionTag}
          </div>
        )}
        {car.instantBook && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-black text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-0.5">
            <Zap size={10} strokeWidth={3} /> Instant
          </div>
        )}
      </div>
      <div className="pt-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[15px] font-semibold tracking-tight truncate">
              {car.make} {car.model}
            </div>
            <div className="text-[12px] text-gray-500 truncate">
              {car.year} · {car.location}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[12px] flex-shrink-0">
            <Star size={11} strokeWidth={2.5} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{car.rating}</span>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="text-[13px]">
            <span className="font-semibold">₱{car.pricePerDay.toLocaleString()}</span>
            <span className="text-gray-500"> / day</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            {car.driverOption === "with-driver"
              ? "+ Driver"
              : car.driverOption === "both"
              ? "± Driver"
              : "Self-drive"}
          </span>
        </div>
      </div>
    </Link>
  );
}
