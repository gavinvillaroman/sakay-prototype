"use client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[12px] text-gray-400">
      Loading map…
    </div>
  ),
});

export default MapView;
