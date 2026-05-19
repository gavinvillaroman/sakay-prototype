"use client";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { cars, getCarReviews, avgRating } from "@/lib/mock";
import { hostSlug } from "@/lib/host";
import Avatar from "@/components/Avatar";
import Reviews from "@/components/Reviews";
import { useApp } from "@/lib/store";
import { useReviewStore } from "@/lib/reviewStore";
import { Star, Zap, ShieldCheck, Car as CarIcon, Heart, Share, ArrowLeft, BadgeCheck } from "lucide-react";

export default function CarDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const car = cars.find((c) => c.id === id);
  const { startBooking } = useApp();
  const allUserReviews = useReviewStore((s) => s.userReviews);
  const userReviews = allUserReviews.filter((r) => r.carId === id);
  if (!car) notFound();

  const book = () => {
    startBooking({ car });
    router.push("/booking/checkout");
  };

  const mergedReviews = [...userReviews, ...getCarReviews(car.id)];
  const rating = avgRating(mergedReviews) || car.rating;

  return (
    <div>
      {/* Mobile back button overlay */}
      <button
        onClick={() => router.back()}
        className="md:hidden absolute top-3 left-4 z-20 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Hero image */}
      <div className="relative bg-gray-100">
        <div className="max-w-7xl mx-auto md:px-6 md:pt-6">
          <div className="aspect-[4/3] md:aspect-[16/9] relative md:rounded-3xl overflow-hidden bg-gray-100">
            <Image src={car.photo} alt={`${car.make} ${car.model}`} fill unoptimized className="object-cover" />
            {car.blackOnly && (
              <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Sakay Black only
              </div>
            )}
            {car.regionTag && !car.blackOnly && (
              <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                {car.regionTag}
              </div>
            )}
            <div className="absolute top-4 right-4 hidden md:flex gap-2">
              <button className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"><Share size={16} /></button>
              <button className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"><Heart size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-5 md:px-6 md:py-10 grid md:grid-cols-3 md:gap-10">
        {/* Left column: details */}
        <div className="md:col-span-2 pt-4 md:pt-0">
          <div className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">
            {car.year} · {car.location}
          </div>
          <h1 className="text-[24px] md:text-[36px] font-bold tracking-tightest leading-tight">
            {car.make} {car.model}
          </h1>
          <div className="flex items-center gap-3 mt-2 md:mt-3 text-[13px] md:text-[14px]">
            <div className="flex items-center gap-1">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating.toFixed(2)}</span>
              <span className="text-gray-500">({car.trips} trips)</span>
            </div>
            {car.instantBook && (
              <div className="flex items-center gap-1 text-black">
                <Zap size={13} strokeWidth={3} />
                <span className="font-medium">Instant book</span>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100 my-5 md:my-7" />

          {/* Driver options */}
          <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Driver</div>
          <div className="flex gap-2 md:max-w-md">
            {(car.driverOption === "with-driver" || car.driverOption === "both") && (
              <div className="flex-1 border-2 border-black rounded-2xl p-3">
                <div className="text-[13px] md:text-[14px] font-semibold tracking-tight">With driver</div>
                <div className="text-[11px] md:text-[12px] text-gray-500">Pro driver included</div>
              </div>
            )}
            {(car.driverOption === "self-drive" || car.driverOption === "both") && (
              <div className="flex-1 border hairline rounded-2xl p-3">
                <div className="text-[13px] md:text-[14px] font-semibold tracking-tight">Self-drive</div>
                <div className="text-[11px] md:text-[12px] text-gray-500">You drive · license required</div>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100 my-5 md:my-7" />

          {/* Host */}
          <Link href={`/h/${hostSlug(car.hostName)}`} className="flex items-center gap-3 py-2 -mx-2 px-2 rounded-xl hover:bg-surface-soft">
            <Avatar name={car.hostName} photo={car.hostPhoto} size={48} />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] md:text-[16px] font-semibold flex items-center gap-1">
                Hosted by {car.hostName}
                {car.hostSuperhost && <BadgeCheck size={15} className="text-accent" />}
              </div>
              <div className="text-[12px] md:text-[13px] text-foreground/60">
                {car.hostSuperhost ? "Verified fleet · 100% response rate" : "Verified host"}
              </div>
            </div>
            <span className="text-foreground/40">›</span>
          </Link>

          <div className="h-px bg-gray-100 my-5 md:my-7" />

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 md:max-w-lg">
            {car.features.map((f) => (
              <div key={f} className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-1.5">
                  <CarIcon size={16} />
                </div>
                <div className="text-[11px] md:text-[12px] text-gray-700 leading-tight">{f}</div>
              </div>
            ))}
          </div>

          <div className="h-px bg-gray-100 my-5 md:my-7" />

          {/* Protection */}
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[14px] md:text-[16px] font-semibold mb-0.5">Sakay Protection included</div>
              <div className="text-[12px] md:text-[13.5px] text-gray-500 leading-relaxed">
                ₱2,000,000 liability coverage, 24/7 roadside assistance, and a free swap if the host cancels.
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-5 md:my-7" />

          <div className="text-[12px] uppercase tracking-widest text-gray-500 font-semibold mb-2">About this car</div>
          <p className="text-[14px] md:text-[15px] text-gray-700 leading-relaxed max-w-2xl">
            Pristine {car.make} {car.model} kept in {car.location}. Recently serviced, full tank, and meticulously detailed before every trip. Pet-free, smoke-free.
          </p>

          <div className="h-px bg-gray-100 my-5 md:my-7" />

          <Reviews reviews={mergedReviews} rating={rating} />
        </div>

        {/* Right column: sticky booking card (desktop only) */}
        <aside className="hidden md:block">
          <div className="sticky top-24 border hairline rounded-2xl p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[28px] font-bold tracking-tightest">₱{car.pricePerDay.toLocaleString()}</span>
              <span className="text-[14px] text-gray-500">/ day</span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-5">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              {rating.toFixed(2)} · {mergedReviews.length} {mergedReviews.length === 1 ? "review" : "reviews"}
            </div>

            <div className="border hairline rounded-2xl overflow-hidden mb-3">
              <div className="grid grid-cols-2 divide-x hairline">
                <div className="p-3">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Pickup</div>
                  <div className="text-[13px] font-semibold">May 17, 2026</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Return</div>
                  <div className="text-[13px] font-semibold">May 20, 2026</div>
                </div>
              </div>
            </div>

            {car.blackOnly ? (
              <Link href="/black" className="block w-full bg-black text-white rounded-full py-3.5 font-semibold text-[14px] text-center">
                Join Sakay Black to book
              </Link>
            ) : (
              <button onClick={book} className="w-full bg-accent text-accent-fg rounded-full py-3.5 font-semibold text-[14px]">
                Reserve
              </button>
            )}

            <div className="mt-4 space-y-2 text-[12px] text-gray-600">
              <div className="flex justify-between"><span>3 days × ₱{car.pricePerDay.toLocaleString()}</span><span>₱{(car.pricePerDay * 3).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Service fee</span><span>₱{Math.round(car.pricePerDay * 3 * 0.08).toLocaleString()}</span></div>
              <div className="flex justify-between pt-2 border-t hairline mt-2 font-bold text-[14px] text-black"><span>Total</span><span>₱{(car.pricePerDay * 3 + Math.round(car.pricePerDay * 3 * 0.08)).toLocaleString()}</span></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTA — sits above the bottom nav + iOS safe area */}
      <div className="md:hidden fixed inset-x-0 z-20 border-t hairline bg-background px-5 py-3 flex items-center justify-between" style={{ bottom: "calc(env(safe-area-inset-bottom) + 56px)" }}>
        <div>
          <div className="text-[18px] font-bold tracking-tight">
            ₱{car.pricePerDay.toLocaleString()}
            <span className="text-[13px] text-foreground/50 font-normal"> / day</span>
          </div>
          <span className="text-[11px] text-foreground/50">May 17 – May 20</span>
        </div>
        {car.blackOnly ? (
          <Link href="/black" className="bg-black text-white rounded-full px-6 py-3 font-semibold text-[14px]">Join Sakay Black</Link>
        ) : (
          <button onClick={book} className="bg-accent text-accent-fg rounded-full px-6 py-3 font-semibold text-[14px]">Reserve</button>
        )}
      </div>
      <div className="md:hidden h-20" />
    </div>
  );
}
