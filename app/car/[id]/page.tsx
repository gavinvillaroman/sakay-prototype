"use client";
import { use, useState } from "react";
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
  Award, KeyRound, Snowflake, CalendarDays, MapPin, Flag, Camera, Leaf,
} from "lucide-react";

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
  const [sheetOpen, setSheetOpen] = useState(false);
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
  const subtotal = car.pricePerDay * days;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  return (
    <div>
      {/* Hero with floating Airbnb-style chips */}
      <div className="relative bg-surface-soft">
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

          {/* Trip dates — opens Airbnb-style calendar sheet */}
          <div id="trip-dates" className="md:hidden mt-6 scroll-mt-20">
            <h2 className="text-[18px] font-bold tracking-tight mb-3">
              {days} {days === 1 ? "day" : "days"} in {car.location.split(",")[0]}
            </h2>
            <button
              onClick={() => setSheetOpen(true)}
              className="tap w-full rounded-2xl border hairline overflow-hidden text-left"
            >
              <div className="grid grid-cols-2 divide-x hairline">
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold mb-1">Pickup</div>
                  <div className="text-[15px] font-bold tracking-tight">{fmtShort(startDate)}</div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold mb-1">Return</div>
                  <div className="text-[15px] font-bold tracking-tight">{fmtShort(endDate)}</div>
                </div>
              </div>
              <div className="border-t hairline px-4 py-2.5 text-[12px] text-foreground/60 flex items-center justify-between">
                <span><span className="font-semibold text-foreground">Tap to change</span></span>
                <span className="text-accent font-semibold">Free cancellation &gt; 24h</span>
              </div>
            </button>
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

          {/* What this vehicle offers */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-4">What this {car.category === "motorcycle" ? "bike" : "car"} offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6 md:max-w-xl">
            {car.features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <ShieldCheck size={18} strokeWidth={1.5} className="text-foreground/70 flex-shrink-0" />
                <div className="text-[14.5px] md:text-[15px]">{f}</div>
              </div>
            ))}
          </div>

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Where you'll pick up */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-2">Where you&apos;ll pick up</h2>
          <div className="text-[14.5px] text-foreground/70 mb-3">{car.location}</div>
          <div className="aspect-[16/9] md:aspect-[2/1] rounded-2xl bg-surface-soft flex items-center justify-center text-foreground/40">
            <MapPin size={28} strokeWidth={1.5} />
          </div>

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Reviews */}
          <Reviews reviews={mergedReviews} rating={rating} />

          <div className="h-px bg-hairline my-6 md:my-7" />

          {/* Things to know */}
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-4">Things to know</h2>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            <div>
              <div className="flex items-center gap-2 text-[15px] font-bold tracking-tight">
                <CalendarDays size={17} /> Cancellation
              </div>
              <ul className="mt-2 space-y-1 text-[13.5px] text-foreground/70 leading-relaxed">
                <li>Free cancellation &gt; 24h before pickup</li>
                <li>50% refund 12–24h before</li>
                <li>No refund under 12h</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[15px] font-bold tracking-tight">
                <KeyRound size={17} /> Pickup &amp; return
              </div>
              <ul className="mt-2 space-y-1 text-[13.5px] text-foreground/70 leading-relaxed">
                <li>Pickup at 10:00 AM</li>
                <li>Return at 10:00 AM</li>
                <li>Bring driver&apos;s license + 1 ID</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[15px] font-bold tracking-tight">
                <ShieldCheck size={17} /> Safety &amp; protection
              </div>
              <ul className="mt-2 space-y-1 text-[13.5px] text-foreground/70 leading-relaxed">
                <li>₱2M Sakay liability coverage</li>
                <li>24/7 roadside assistance</li>
                <li>Pet-free, smoke-free</li>
              </ul>
            </div>
          </div>

          <div className="h-px bg-hairline my-6 md:my-7" />

          <Link href="/legal/help" className="tap inline-flex items-center gap-2 text-[14px] text-foreground/70 underline underline-offset-4">
            <Flag size={14} /> Report this listing
          </Link>
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
        minDate={minDate}
        priceLabel={`₱${car.pricePerDay.toLocaleString()} / day`}
        onClose={() => setSheetOpen(false)}
        onSave={(s, e) => { setStartDate(s); setEndDate(e); }}
      />
    </div>
  );
}
