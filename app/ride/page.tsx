"use client";
import { useRouter } from "next/navigation";
import { ridePlaces } from "@/lib/mock";
import { useRide } from "@/lib/ride";
import MapView from "@/components/MapClient";
import AppHeader from "@/components/AppHeader";
import { MapPin, Home, Briefcase, Plane, Star } from "lucide-react";

export default function RideEntry() {
  const router = useRouter();
  const { setDropoff, startSearch } = useRide();

  const pick = (i: number) => {
    setDropoff(ridePlaces[i]);
    startSearch();
    router.push("/ride/searching");
  };

  const iconFor = (label: string) => {
    if (label === "Home") return Home;
    if (label === "Work") return Briefcase;
    if (label.includes("NAIA")) return Plane;
    return Star;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <AppHeader title="Hail a ride" />
      <div className="h-56 relative flex-shrink-0">
        <MapView />
      </div>
      <div className="flex-1 -mt-6 bg-white rounded-t-3xl pt-5 px-5 pb-4 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] overflow-y-auto no-scrollbar">
        <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
          Saan tayo?
        </div>
        <h1 className="text-[24px] font-bold tracking-tightest mb-4">Pick a destination</h1>

        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3.5 mb-5">
          <MapPin size={16} className="text-gray-500" />
          <input
            placeholder="Where to?"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-gray-500"
          />
        </div>

        <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
          Saved places
        </div>
        <div>
          {ridePlaces.map((p, i) => {
            const Icon = iconFor(p.label);
            return (
              <button
                key={p.label}
                onClick={() => pick(i)}
                className="w-full flex items-center gap-3 py-3 active:bg-gray-50 rounded-lg text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold tracking-tight truncate">{p.label}</div>
                  <div className="text-[12px] text-gray-500 truncate">{p.address}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
