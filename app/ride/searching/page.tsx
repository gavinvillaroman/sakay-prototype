"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import MapView from "@/components/MapClient";
import { useRide } from "@/lib/ride";

export default function Searching() {
  const router = useRouter();
  const { pickup, dropoff, matchDriver, reset } = useRide();

  useEffect(() => {
    if (!dropoff) {
      router.replace("/ride");
      return;
    }
    const t = setTimeout(() => {
      matchDriver();
      router.push("/ride/matched");
    }, 3500);
    return () => clearTimeout(t);
  }, [dropoff, matchDriver, router]);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <AppHeader title="Finding a driver" />
      <div className="flex-1 relative">
        <MapView pickup={pickup} dropoff={dropoff ?? undefined} searching />
        <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl pt-6 px-6 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-black/15 pulse-ring" />
              <div className="absolute inset-0 rounded-full bg-black/10 pulse-ring" style={{ animationDelay: "0.6s" }} />
              <div className="w-6 h-6 rounded-full bg-black relative" />
            </div>
          </div>
          <h2 className="text-[22px] font-bold tracking-tightest text-center mb-1">
            Finding your driver…
          </h2>
          <p className="text-[13px] text-gray-500 text-center mb-5">
            Matching you with a Sakay driver nearby.
          </p>
          <button
            onClick={() => { reset(); router.replace("/"); }}
            className="w-full border hairline rounded-full py-3 font-semibold text-[14px] flex items-center justify-center gap-2"
          >
            <X size={16} /> Cancel request
          </button>
        </div>
      </div>
    </div>
  );
}
