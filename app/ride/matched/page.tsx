"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, MessageSquare, Star } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import MapView from "@/components/MapClient";
import { useRide } from "@/lib/ride";

export default function Matched() {
  const router = useRouter();
  const { pickup, dropoff, driver, cancelByDriver } = useRide();

  useEffect(() => {
    if (!driver || !dropoff) { router.replace("/ride"); return; }
    const t = setTimeout(() => {
      cancelByDriver();
      router.push("/ride/canceled");
    }, 5000);
    return () => clearTimeout(t);
  }, [driver, dropoff, cancelByDriver, router]);

  if (!driver || !dropoff) return null;

  const driverPos = { lat: pickup.lat + 0.004, lng: pickup.lng - 0.004 };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <AppHeader title="On the way" />
      <div className="flex-1 relative">
        <MapView pickup={pickup} dropoff={dropoff} driver={driverPos} showRoute />
        <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl px-5 pt-5 pb-5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-center mb-3">
            <div className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest">
              Driver arriving in 4 min
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Image src={driver.photo} alt={driver.name} width={52} height={52} unoptimized className="rounded-full w-13 h-13 object-cover" style={{ width: 52, height: 52 }} />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold tracking-tight">{driver.name}</div>
              <div className="flex items-center gap-1 text-[12px] text-gray-500">
                <Star size={11} className="fill-black" />
                {driver.rating}
                <span className="mx-1">·</span>
                {driver.vehicle} · {driver.plate}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Phone size={17} />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquare size={17} />
              </button>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-black flex-shrink-0" />
              <div className="text-[13px] font-medium truncate">{pickup.label}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-black flex-shrink-0" />
              <div className="text-[13px] font-medium truncate">{dropoff.label}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
