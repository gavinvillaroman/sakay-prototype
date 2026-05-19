"use client";
import Image from "next/image";
import Link from "next/link";
import { activity, type Activity } from "@/lib/mock";
import { useEffect, useState } from "react";
import { ChevronRight, Car, Sparkles, Navigation, Star } from "lucide-react";
import { listMyBookings, type LocalBooking } from "@/lib/data/bookings";
import { useAuth } from "@/lib/auth/context";

const STATUS = ["Upcoming", "Past", "Canceled"] as const;
const TYPES = [
  { id: "all", label: "All" },
  { id: "rental", label: "Rentals" },
  { id: "experience", label: "Experiences" },
  { id: "ride", label: "Rides" },
] as const;

const bookingToActivity = (b: LocalBooking): Activity => {
  const status: Activity["status"] =
    b.status === "canceled" ? "canceled" : b.status === "completed" ? "completed" : "upcoming";
  return {
    id: b.id,
    type: "rental",
    title: b.vehicle_label || "Sakay rental",
    subtitle: `${b.driver_option === "with-driver" ? "With driver" : "Self-drive"} · ${b.vehicle_location || ""}`.trim(),
    date: `${b.start_date} → ${b.end_date}`,
    status,
    amount: Math.round(b.total_cents / 100),
    photo: b.vehicle_photo || "/cars/toyota-hiace.jpg",
  };
};

export default function ActivityPage() {
  const [status, setStatus] = useState<(typeof STATUS)[number]>("Upcoming");
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("all");
  const { user } = useAuth();
  const [myBookings, setMyBookings] = useState<Activity[]>([]);

  useEffect(() => {
    const renterId = user && "id" in user ? user.id : undefined;
    listMyBookings(renterId).then((rows) => setMyBookings(rows.map(bookingToActivity)));
  }, [user]);

  const combined = [...myBookings, ...activity];
  const list = combined.filter((a) => {
    const statusMatch =
      status === "Upcoming" ? a.status === "upcoming" || a.status === "active"
      : status === "Past" ? a.status === "completed"
      : a.status === "canceled";
    const typeMatch = type === "all" ? true : a.type === type;
    return statusMatch && typeMatch;
  });

  const iconFor = (t: string) => t === "rental" ? Car : t === "experience" ? Sparkles : Navigation;

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 pt-4 md:pt-10 pb-12">
      <div>
        <h1 className="text-[26px] md:text-[40px] font-bold tracking-tightest mb-3 md:mb-6">Activity</h1>
        <div className="flex gap-1 border-b hairline -mx-5 px-5">
          {STATUS.map((t) => (
            <button
              key={t}
              onClick={() => setStatus(t)}
              className={`text-[13px] font-medium px-3 py-2 -mb-px ${
                status === t ? "border-b-2 border-black text-black" : "text-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
          {TYPES.map((t) => {
            const active = type === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium border transition ${
                  active
                    ? "bg-accent text-accent-fg border-accent"
                    : "hairline bg-surface text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        {list.length === 0 && (
          <div className="text-center text-gray-500 text-[13px] py-16">
            Nothing here yet.
          </div>
        )}
        <div className="space-y-3">
          {list.map((a) => {
            const Icon = iconFor(a.type);
            return (
              <div key={a.id} className="rounded-2xl border hairline overflow-hidden">
                <div className="flex items-center gap-3 p-3 active:bg-gray-50">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={a.photo} alt="" fill unoptimized className="object-cover" />
                    <div className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-white/95 flex items-center justify-center">
                      <Icon size={11} strokeWidth={2.4} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        a.status === "upcoming" ? "text-black"
                        : a.status === "canceled" ? "text-red-500"
                        : "text-gray-500"
                      }`}>
                        {a.status === "upcoming" ? "Upcoming" : a.status === "canceled" ? "Canceled" : "Completed"}
                      </span>
                      <span className="text-[10px] text-gray-400">·</span>
                      <span className="text-[11px] text-gray-500 capitalize">{a.type}</span>
                    </div>
                    <div className="text-[14px] font-semibold tracking-tight truncate">{a.title}</div>
                    <div className="text-[12px] text-gray-500 truncate">{a.subtitle}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-[11px] text-gray-500">{a.date}</div>
                      <div className="text-[13px] font-semibold">
                        {a.amount > 0 ? `₱${a.amount.toLocaleString()}` : "—"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                </div>
                {a.status === "completed" && a.type !== "ride" && (
                  <Link
                    href={`/activity/${a.id}/review`}
                    className="flex items-center justify-center gap-1.5 border-t hairline py-2.5 text-[12.5px] font-semibold active:bg-gray-50"
                  >
                    <Star size={13} /> Leave a review
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
