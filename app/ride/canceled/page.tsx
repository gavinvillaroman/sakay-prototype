"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { XCircle, Search, Crosshair, MapPin, BadgeCheck, Star } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useRide } from "@/lib/ride";

export default function Canceled() {
  const router = useRouter();
  const { pickup, dropoff, driver, startSearch } = useRide();

  useEffect(() => {
    if (!driver || !dropoff) router.replace("/ride");
  }, [driver, dropoff, router]);

  if (!driver || !dropoff) return null;

  const findNew = () => {
    startSearch();
    router.push("/ride/searching");
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <AppHeader title="Ride canceled" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-6">
        <div className="inline-flex items-center gap-2 bg-red-50 rounded-full px-3 py-1.5 mb-4">
          <XCircle size={15} className="text-red-500" />
          <span className="text-[11px] font-bold text-red-500 tracking-widest uppercase">
            Ride canceled · 2 min ago
          </span>
        </div>

        <h1 className="text-[32px] leading-[1.05] font-bold tracking-tightest mb-3">
          Your ride was canceled.
        </h1>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
          No stress — we&apos;re already matching you with a new driver nearby.
        </p>

        <div className="border hairline rounded-2xl p-4 flex items-center gap-3 mb-6">
          <div className="relative flex-shrink-0">
            <Image
              src={driver.photo}
              alt={driver.name}
              width={52}
              height={52}
              unoptimized
              className="rounded-full object-cover"
              style={{ width: 52, height: 52 }}
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold tracking-tight">{driver.name}</div>
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mt-0.5">
              <Star size={11} className="fill-black" />
              {driver.rating}
              <span className="text-gray-400">·</span>
              <span className="truncate">{driver.vehicle} · {driver.plate}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase flex-shrink-0">
            Canceled
          </span>
        </div>

        <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">
          Trip details
        </div>
        <div className="border hairline rounded-2xl overflow-hidden mb-5">
          <div className="flex items-start gap-3 p-4">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
              <Crosshair size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-0.5">Pickup</div>
              <div className="text-[14px] font-semibold tracking-tight truncate">{pickup.label}</div>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Now</div>
          </div>
          <div className="border-t hairline" />
          <div className="flex items-start gap-3 p-4">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-0.5">Drop-off</div>
              <div className="text-[14px] font-semibold tracking-tight truncate">{dropoff.label}</div>
              <div className="text-[11px] text-gray-500 truncate">{dropoff.address}</div>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">9 min</div>
          </div>
        </div>

        <div className="border hairline rounded-2xl p-4 flex items-start gap-3 mb-6">
          <BadgeCheck size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[14px] font-semibold tracking-tight">No penalty on your end</div>
            <div className="text-[12px] text-gray-500 leading-relaxed">
              Your request stays active while we look for another driver.
            </div>
          </div>
        </div>

        <button
          onClick={findNew}
          className="w-full bg-black text-white rounded-full py-3.5 font-semibold text-[14px] flex items-center justify-center gap-2"
        >
          <Search size={16} /> Find new ride
        </button>
        <button className="w-full text-center py-3 text-[13px] font-medium text-gray-800">
          View cancellation details
        </button>
      </div>
    </div>
  );
}
