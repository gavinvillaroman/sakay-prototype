"use client";
import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { cars, getCarReviews, avgRating } from "@/lib/mock";
import { hostSlug } from "@/lib/host";
import Avatar from "@/components/Avatar";
import Reviews from "@/components/Reviews";
import DateRangeSheet from "@/components/DateRangeSheet";
import { useApp } from "@/lib/store";
import { useReviewStore } from "@/lib/reviewStore";
import {
  Star, Zap, ShieldCheck, Heart, Share, ArrowLeft, BadgeCheck,
  Award, KeyRound, Snowflake, CalendarDays, MapPin, Flag, Camera, Leaf, Pencil,
  Car as CarIcon, Users, Clock, Sparkles, LifeBuoy, Headphones,
  Cigarette, Fuel, MountainSnow,
} from "lucide-react";
import FeaturesSheet, { type FeatureGroup } from "@/components/FeaturesSheet";

const today = () => new Date().toISOString().slice(0, 10);
const plusDaysISO = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const daysBetween = (a: string, b: string) => {
  const ms = new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
};
const fmtShort = (iso: string) => {
  const [, m, d] = iso.split("-");
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(m) - 1];
  return `${month} ${Number(d)}`;
};
const categoryLabel = (cat: string) => ({
  sedan: "Sedan",
  suv: "SUV",
  van: "Van",
  motorcycle: "Motorbike",
  black: "Sakay Black",
  all: "Vehicle",
}[cat] ?? "Vehicle");

const HIGHLIGHTS = (instantBook: boolean, superhost: boolean) => [
  instantBook && {
    Icon: Zap,
    title: "Instant booking",
    sub: "No waiting — your reservation is confirmed the moment you tap Reserve.",
  },
  superhost && {
    Icon: Award,
    title: "Verified fleet operator",
    sub: "Hosted by a top-rated Sakay partner with consistent 5-star service.",
  },
  {
    Icon: KeyRound,
    title: "Smooth pickup",
    sub: "Most renters get the keys within 10 minutes of arriving.",
  },
  {
    Icon: Snowflake,
    title: "Cleaned between every trip",
    sub: "Interior detailed, full tank, sanitized before you take the wheel.",
  },
].filter(Boolean) as { Icon: typeof Zap; title: string; sub: string }[];

export default function CarDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const car = cars.find((c) => c.id === id);
  const { startBooking } = useApp();
  const allUserReviews = useReviewStore((s) => s.userReviews);
  const userReviews = allUserReviews.filter((r) => r.carId === id);

  const minDate = plusDaysISO(today(), 1);
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState(plusDaysISO(minDate, 3));
  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("10:00 AM");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [featuresSheetOpen, setFeaturesSheetOpen] = useState(false);
  const [stickyShown, setStickyShown] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Sticky header fades in when user scrolls past the hero image
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStickyShown(!entry.isIntersecting),
      { rootMargin: "-60px 0px 0px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  if (endDate <= startDate) {
    const fixed = plusDaysISO(startDate, 1);
    if (fixed !== endDate) setTimeout(() => setEndDate(fixed), 0);
  }
  const days = daysBetween(startDate, endDate);

  if (!car) notFound();

  const book = () => {
    startBooking({ car, startDate, endDate });
    router.push("/booking/checkout");
  };

  const mergedReviews = [...userReviews, ...getCarReviews(car.id)];
  const rating = avgRating(mergedReviews) || car.rating;
  const highlights = HIGHLIGHTS(car.instantBook, car.hostSuperhost).slice(0, 3);

  // Group features for the "Vehicle features" section. Categorize by simple
  // keyword match; everything that doesn't fit goes under Capacity.
  const featureGroups: FeatureGroup[] = (() => {
    const safety: string[] = ["Anti-lock brakes (ABS)", "Airbags", "Backup camera"];
    const comfort: string[] = ["Air conditioning"];
    const connectivity: string[] = ["Bluetooth", "USB charger"];
    const capacity: string[] = [];
    car.features.forEach((f) => {
      const lower = f.toLowerCase();
      if (/usb|bluetooth|aux|carplay|android/i.test(lower)) connectivity.push(f);
      else if (/4x4|turbo|diesel|paddle|push start/i.test(lower)) safety.push(f);
      else capacity.push(f);
    });
    return [
      { title: "Capacity", items: capacity },
      { title: "Safety", items: safety },
      { title: "Comfort", items: comfort },
      { title: "Connectivity", items: connectivity },
    ].filter((g) => g.items.length > 0);
  })();
  const totalFeatures = featureGroups.reduce((s, g) => s + g.items.length, 0);

  // Category rating bars — derived from the car's overall rating with small,
  // realistic variation per category. Stable per car (no random per render).
  const categoryRatings = [
    { label: "Cleanliness", val: Math.min(5, rating - 0.05) },
    { label: "Maintenance", val: Math.min(5, rating + 0.05) },
    { label: "Communication", val: Math.min(5, rating) },
    { label: "Value", val: Math.min(5, rating - 0.10) },
  ];
  const subtotal = car.pricePerDay * days;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  return (
    <div>
      {/* Sticky white header — fades in on scroll past hero */}
      <div
        className="md:hidden fixed inset-x-0 top-0 z-40 bg-background border-b hairline transition-opacity duration-200"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          opacity: stickyShown ? 1 : 0,
          pointerEvents: stickyShown ? "auto" : "none",
        }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="tap w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-[16px] font-bold tracking-tight truncate px-2">
            {car.make} {car.model}
          </div>
          <div className="flex items-center gap-1">
            <button aria-label="Share" className="tap w-10 h-10 flex items-center justify-center">
              <Share size={18} />
            </button>
            <button aria-label="Save" className="tap w-10 h-10 flex items-center justify-center -mr-2">
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero with floating Airbnb-style chips */}
      <div ref={heroRef} className="relative bg-surface-soft">
        {/* Floating nav */}
        <div className="absolute top-3 left-0 right-0 z-20 px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="tap w-10 h-10 rounded-full bg-white/95 backdrop-blur shadow-md flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex gap-2">
            <button aria-label="Share" className="tap w-10 h-10 rounded-full bg-white/95 backdrop-blur shadow-md flex items-center justify-center">
              <Share size={16} />
            </button>
            <button aria-label="Save" className="tap w-10 h-10 rounded-full bg-white/95 backdrop-blur shadow-md flex items-center justify-center">
              <Heart size={16} />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto md:px-6 md:pt-6">
          <div className="aspect-[4/3] md:aspect-[16/9] relative md:rounded-3xl overflow-hidden">
            <Image src={car.photo} alt={`${car.make} ${car.model}`} fill unoptimized className="object-cover" />
            {car.regionTag && (
              <div className="absolute top-16 left-4 md:top-4 bg-white/95 backdrop-blur text-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                {car.regionTag}
              </div>
            )}
            {/* Photo counter chip */}
            <div className="absolute bottom-4 right-4 bg-black/65 text-white text-[11px] font-semibold tracking-tight px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Camera size={11} /> 1 / 1
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-6 md:py-10 grid md:grid-cols-3 md:gap-10">
        {/* LEFT — content */}
        <div className="md:col-span-2 pt-5 md:pt-0">
          {/* Title */}
          <h1 className="text-[26px] md:text-[36px] font-bold tracking-tightest leading-[1.1]">
            {car.make} {car.model}
          </h1>
          <div className="text-[14.5px] md:text-[15.5px] text-foreground/70 mt-1">
            {categoryLabel(car.category)} in {car.location}
          </div>
          <div className="text-[14.5px] md:text-[15.5px] text-foreground/70">
            {car.features.slice(0, 3).join(" · ")}
          </div>

          {/* Airbnb-style 3-up stats: no outer border, just vertical dividers */}
          <div className="grid grid-cols-3 mt-7 divide-x divide-hairline">
            {/* Rating */}
            <div className="text-center py-2 px-2">
              <div className="text-[22px] md:text-[26px] font-bold tracking-tight leading-none">
                {rating.toFixed(2)}
              </div>
              <div className="flex items-center justify-center gap-px mt-2">
                {[0,1,2,3,4].map((i) => (
                  <Star key={i} size={11} strokeWidth={0} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Verified fleet — laurel flanking the label */}
            <div className="py-2 px-2 flex items-center justify-center gap-2">
              <Leaf size={26} strokeWidth={1.6} className="-rotate-12 -scale-x-100" />
              <div className="text-[12.5px] md:text-[13.5px] font-bold tracking-tight leading-[1.15] text-center">
                Verified<br/>fleet
              </div>
              <Leaf size={26} strokeWidth={1.6} className="rotate-12" />
            </div>

            {/* Bookings */}
            <div className="text-center py-2 px-2">
              <div className="text-[22px] md:text-[26px] font-bold tracking-tight leading-none">
                {car.trips}
              </div>
              <div className="text-[12px] md:text-[13px] text-foreground/70 font-semibold mt-2">
                {car.trips === 1 ? "Booking" : "Bookings"}
              </div>
            </div>
          </div>

          {/* Your trip — Turo-style two-row section with pencil edits */}
          <div id="trip-dates" className="md:hidden mt-7 scroll-mt-20">
            <h2 className="text-[20px] font-bold tracking-tight mb-4">Your trip</h2>
            <div className="divide-y divide-hairline">
              {/* Trip dates */}
              <button
                onClick={() => setSheetOpen(true)}
                className="tap w-full flex items-start gap-4 py-4 text-left"
              >
                <CalendarDays size={28} strokeWidth={1.5} className="flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="text-[15.5px] font-bold tracking-tight">Trip dates</div>
                  <div className="text-[13.5px] text-foreground/70 mt-0.5">
                    {fmtShort(startDate)} at {startTime}
                  </div>
                  <div className="text-[13.5px] text-foreground/70">
                    {fmtShort(endDate)} at {endTime}
                  </div>
                </div>
                <span className="tap w-10 h-10 rounded-lg border hairline flex items-center justify-center flex-shrink-0">
                  <Pencil size={15} />
                </span>
              </button>

              {/* Pickup & return location */}
              <button
                className="tap w-full flex items-start gap-4 py-4 text-left"
                onClick={() => { /* TODO: open pickup sheet */ }}
              >
                <MapPin size={28} strokeWidth={1.5} className="flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="text-[15.5px] font-bold tracking-tight">Pickup &amp; return location</div>
                  <div className="text-[13.5px] text-foreground/80 mt-0.5">
                    Hosted by {car.hostName}
                  </div>
                  <div className="text-[13px] text-foreground/60">
                    {car.location}
                  </div>
                </div>
                <span className="tap w-10 h-10 rounded-lg border hairline flex items-center justify-center flex-shrink-0">
                  <Pencil size={15} />
                </span>
              </button>
            </div>
            <div className="text-[12px] text-accent font-semibold mt-2">
              Free cancellation &gt; 24h before pickup
            </div>
          </div>

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Host card */}
          <Link
            href={`/h/${hostSlug(car.hostName)}`}
            className="tap flex items-center gap-3 -mx-2 px-2 py-2 rounded-xl"
          >
            <Avatar name={car.hostName} photo={car.hostPhoto} size={56} />
            <div className="flex-1 min-w-0">
              <div className="text-[16px] md:text-[17px] font-bold tracking-tight flex items-center gap-1">
                Hosted by {car.hostName}
                {car.hostSuperhost && <BadgeCheck size={16} className="text-accent" />}
              </div>
              <div className="text-[13px] text-foreground/60 mt-0.5">
                {car.hostSuperhost ? "Verified fleet · 100% response rate" : "Verified host"}
              </div>
            </div>
            <span className="text-foreground/40 text-lg">›</span>
          </Link>

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Highlights (Airbnb-style icon + title + sub rows) */}
          <div className="space-y-5">
            {highlights.map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <Icon size={28} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-[15.5px] md:text-[16px] font-bold tracking-tight">{title}</div>
                  <div className="text-[13.5px] md:text-[14px] text-foreground/60 mt-0.5 leading-relaxed">
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* About */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-3">About this {car.category === "motorcycle" ? "bike" : "car"}</h2>
          <p className="text-[14.5px] md:text-[15.5px] text-foreground/80 leading-[1.65] max-w-2xl">
            Pristine {car.make} {car.model} kept in {car.location}. Recently serviced, full tank, and meticulously detailed before every trip. Pet-free, smoke-free.
          </p>

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Vehicle features — grouped, with See all sheet */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-4">Vehicle features</h2>
          <div className="space-y-6">
            {featureGroups.slice(0, 2).map((g) => (
              <div key={g.title}>
                <div className="text-[14px] font-bold tracking-tight mb-2">{g.title}</div>
                <ul className="divide-y divide-hairline">
                  {g.items.map((it) => (
                    <li key={it} className="py-2.5 text-[14.5px]">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {totalFeatures > featureGroups.slice(0, 2).reduce((s, g) => s + g.items.length, 0) && (
            <button
              onClick={() => setFeaturesSheetOpen(true)}
              className="tap mt-5 w-full border hairline rounded-2xl py-3 text-[14px] font-bold tracking-tight"
            >
              See all {totalFeatures} features
            </button>
          )}

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Included in the price */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-4">Included in the price</h2>

          <div className="text-[14px] font-bold tracking-tight mb-3">Convenience</div>
          <div className="space-y-4 mb-7">
            <div className="flex items-start gap-4">
              <CarIcon size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold tracking-tight">Skip the rental counter</div>
                <div className="text-[13.5px] text-foreground/60 mt-0.5">
                  Use the app for pickup and return instructions.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold tracking-tight">Add additional drivers for free</div>
                <div className="text-[13.5px] text-foreground/60 mt-0.5">
                  Up to 2 extra licensed drivers can be added at no charge.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold tracking-tight">30-minute return grace period</div>
                <div className="text-[13.5px] text-foreground/60 mt-0.5">
                  No need to extend your trip unless you&apos;re running more than 30 minutes late.
                </div>
              </div>
            </div>
          </div>

          <div className="text-[14px] font-bold tracking-tight mb-3">Peace of mind</div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Sparkles size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px]">No car wash necessary, but keep the vehicle tidy</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <LifeBuoy size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px]">Free access to 24/7 roadside assistance</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Headphones size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px]">24/7 customer support</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Where you'll pick up */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-2">Where you&apos;ll pick up</h2>
          <div className="text-[14.5px] text-foreground/70 mb-3">{car.location}</div>
          <div className="aspect-[16/9] md:aspect-[2/1] rounded-2xl bg-surface-soft flex items-center justify-center text-foreground/40">
            <MapPin size={28} strokeWidth={1.5} />
          </div>

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Ratings and reviews */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-3">Ratings and reviews</h2>
          <div className="flex items-center gap-1.5 mb-5">
            <span className="text-[22px] md:text-[26px] font-bold tracking-tight leading-none">{rating.toFixed(1)}</span>
            <Star size={18} strokeWidth={0} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[14px] text-foreground/60">({mergedReviews.length} {mergedReviews.length === 1 ? "rating" : "ratings"})</span>
          </div>
          <div className="space-y-2.5 mb-7 max-w-md">
            {categoryRatings.map(({ label, val }) => (
              <div key={label} className="flex items-center gap-3 text-[13.5px]">
                <div className="w-28 text-foreground/80">{label}</div>
                <div className="flex-1 h-1.5 rounded-full bg-surface-soft overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${(val / 5) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right font-semibold tabular-nums">{val.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <Reviews reviews={mergedReviews} rating={rating} />

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Rules of the road — Turo pattern */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-4">Rules of the road</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Cigarette size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold tracking-tight">No smoking allowed</div>
                <div className="text-[13.5px] text-foreground/60 mt-0.5">
                  Smoking in any Sakay vehicle will result in a ₱5,000 cleaning fee.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Sparkles size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold tracking-tight">Keep the vehicle tidy</div>
                <div className="text-[13.5px] text-foreground/60 mt-0.5">
                  Unreasonably dirty vehicles may result in a ₱2,000 cleaning fee.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Fuel size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold tracking-tight">Refuel the vehicle</div>
                <div className="text-[13.5px] text-foreground/60 mt-0.5">
                  Return with the same fuel level. Missing fuel may result in a refueling fee.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MountainSnow size={26} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold tracking-tight">No off-roading</div>
              </div>
            </div>
          </div>
          <div className="text-[12px] text-foreground/50 mt-5 leading-relaxed">
            Vehicle may have a device that collects driving and location data. Data may be shared with third parties for vehicle recovery or protection purposes.
          </div>

          <div className="h-px bg-hairline my-6 md:my-7" />

          <div className="flex flex-col items-center gap-3">
            <Link href="/legal/help" className="tap text-[14px] font-semibold text-accent underline underline-offset-4">
              Report listing
            </Link>
            <Link href="/legal/terms" className="tap text-[14px] font-semibold text-accent underline underline-offset-4">
              Cancellation policy
            </Link>
          </div>
        </div>

        {/* RIGHT — desktop sticky booking card */}
        <aside className="hidden md:block">
          <div className="sticky top-24 border hairline rounded-3xl p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[26px] font-bold tracking-tightest">₱{car.pricePerDay.toLocaleString()}</span>
              <span className="text-[14px] text-foreground/60">/ day</span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-foreground/60 mb-5">
              <Star size={11} strokeWidth={0} className="fill-yellow-400 text-yellow-400" />
              {rating.toFixed(2)} · {car.trips} {car.trips === 1 ? "booking" : "bookings"}
            </div>

            <button
              onClick={() => setSheetOpen(true)}
              className="tap w-full border hairline rounded-2xl overflow-hidden mb-3 text-left"
            >
              <div className="grid grid-cols-2 divide-x hairline">
                <div className="p-3">
                  <div className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold mb-0.5">Pickup</div>
                  <div className="text-[13px] font-semibold">{fmtShort(startDate)}</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold mb-0.5">Return</div>
                  <div className="text-[13px] font-semibold">{fmtShort(endDate)}</div>
                </div>
              </div>
            </button>

            {car.blackOnly ? (
              <Link href="/black" className="tap block w-full bg-black text-white rounded-full py-3.5 font-semibold text-[14px] text-center">
                Join Sakay Black to book
              </Link>
            ) : (
              <button onClick={book} className="tap w-full bg-accent text-accent-fg rounded-full py-3.5 font-semibold text-[14px]">
                Reserve
              </button>
            )}

            <div className="text-center text-[11px] text-foreground/60 mt-2">You won&apos;t be charged yet</div>

            <div className="mt-4 space-y-2 text-[13px] text-foreground/70">
              <div className="flex justify-between underline-offset-2">
                <span className="underline">₱{car.pricePerDay.toLocaleString()} × {days} {days === 1 ? "day" : "days"}</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between"><span className="underline">Service fee</span><span>₱{serviceFee.toLocaleString()}</span></div>
              <div className="flex justify-between pt-3 border-t hairline mt-2 font-bold text-[15px] text-foreground"><span>Total</span><span>₱{total.toLocaleString()}</span></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky booking bar — Airbnb pattern: total + dates on left, Reserve on right */}
      <div
        className="md:hidden fixed inset-x-0 z-20 border-t hairline bg-background px-5 py-3 flex items-center justify-between gap-3"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 56px)" }}
      >
        <button
          onClick={() => setSheetOpen(true)}
          className="min-w-0 flex-1 tap text-left"
        >
          <div className="text-[16px] font-bold tracking-tight underline underline-offset-2">
            ₱{total.toLocaleString()}
          </div>
          <div className="text-[11.5px] text-foreground/60 truncate">
            For {days} {days === 1 ? "day" : "days"} · {fmtShort(startDate)} – {fmtShort(endDate)} <span className="text-accent">· change</span>
          </div>
          <div className="text-[10.5px] text-accent font-semibold mt-0.5">Free cancellation</div>
        </button>
        {car.blackOnly ? (
          <Link href="/black" className="tap bg-black text-white rounded-full px-7 py-3.5 font-semibold text-[14.5px] flex-shrink-0">
            Join Black
          </Link>
        ) : (
          <button onClick={book} className="tap bg-accent text-accent-fg rounded-full px-7 py-3.5 font-semibold text-[14.5px] flex-shrink-0">
            Reserve
          </button>
        )}
      </div>
      <div className="md:hidden h-24" />

      <DateRangeSheet
        open={sheetOpen}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        minDate={minDate}
        priceLabel={`₱${car.pricePerDay.toLocaleString()} / day`}
        onClose={() => setSheetOpen(false)}
        onSave={(s, e, st, et) => {
          setStartDate(s);
          setEndDate(e);
          if (st) setStartTime(st);
          if (et) setEndTime(et);
        }}
      />

      <FeaturesSheet
        open={featuresSheetOpen}
        onClose={() => setFeaturesSheetOpen(false)}
        groups={featureGroups}
        count={totalFeatures}
      />
    </div>
  );
}
