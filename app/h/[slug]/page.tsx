"use client";
import { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import CarCard from "@/components/CarCard";
import Reviews from "@/components/Reviews";
import { hostByName, hostCars } from "@/lib/host";
import { avgRating, getHostReviews } from "@/lib/mock";
import { ShieldCheck, BadgeCheck, MapPin } from "lucide-react";

export default function HostProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const host = hostByName(slug);
  if (!host) notFound();

  const cars = hostCars(host.name);
  const reviews = getHostReviews(host.name);
  const totalTrips = cars.reduce((a, c) => a + c.trips, 0);
  const rating = avgRating(reviews);
  const isSuperhost = cars.some((c) => c.hostSuperhost);
  const photo = cars[0]?.hostPhoto ?? "https://i.pravatar.cc/150";

  return (
    <div className="max-w-5xl mx-auto bg-background pb-12">
      <div className="md:hidden"><AppHeader title="Host" /></div>
      <div className="md:pt-8">
        {/* Hero */}
        <div className="px-5 pt-3 pb-5 flex flex-col items-center text-center">
          <div className="relative">
            <Image
              src={photo}
              alt={host.name}
              width={88}
              height={88}
              unoptimized
              className="w-22 h-22 rounded-full"
              style={{ width: 88, height: 88 }}
            />
            {isSuperhost && (
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent text-accent-fg flex items-center justify-center border-2 border-background">
                <BadgeCheck size={15} strokeWidth={2.5} />
              </span>
            )}
          </div>
          <h1 className="text-[24px] font-bold tracking-tightest mt-3">{host.name}</h1>
          <div className="text-[12px] text-gray-500 mt-1">
            {isSuperhost ? "Superhost" : "Verified host"} · Joined 2024
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 mb-5 grid grid-cols-3 gap-2">
          <Stat value={String(cars.length)} label="Listings" />
          <Stat value={String(totalTrips)} label="Trips" />
          <Stat value={rating ? rating.toFixed(2) : "—"} label="Rating" />
        </div>

        {/* Bio */}
        <div className="px-5 pb-5">
          <p className="text-[14px] text-gray-700 leading-relaxed">
            {host.name === "Shotcorner Corporation"
              ? "Shotcorner Corporation operates a small fleet of well-maintained vans in Metro Manila and Nueva Ecija. Every vehicle is sanitized between trips and serviced on a strict schedule."
              : `${host.name} is a verified Sakay host. Each booking includes responsive support, on-time pickup, and Sakay's standard ₱2M protection plan.`}
          </p>
        </div>

        <div className="px-5 mb-4 grid grid-cols-2 gap-2 text-[12px]">
          <Badge icon={ShieldCheck} label="Identity verified" />
          <Badge icon={MapPin} label={`Based in ${cars[0]?.location ?? "Philippines"}`} />
        </div>

        <div className="h-px bg-gray-100 mx-5 mb-5" />

        {/* Listings */}
        <div className="px-5 mb-5">
          <h2 className="text-[16px] font-semibold tracking-tight mb-3">
            {cars.length === 1 ? "Listing" : `${cars.length} listings`}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {cars.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100 mx-5" />

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="px-5 py-5">
            <Reviews reviews={reviews} rating={rating || 5} />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border hairline p-3 text-center">
      <div className="text-[20px] font-bold tracking-tight">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mt-0.5">
        {label}
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 border hairline rounded-full px-3 py-2">
      <Icon size={14} className="text-gray-700" />
      <span className="truncate">{label}</span>
    </div>
  );
}
