"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApp } from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import { Check, ShieldCheck, Sparkles, Car as CarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createBooking } from "@/lib/data/bookings";
import { useAuth } from "@/lib/auth/context";

const DRIVER_FEE = 2500;

// Driver-option choice is its own decision, separate from optional add-ons.
const ADDONS = [
  { id: "premium", label: "Premium insurance", price: 850, icon: ShieldCheck, sub: "Zero-deductible coverage" },
  { id: "delivery", label: "Doorstep delivery", price: 600, icon: CarIcon, sub: "We bring the car to you" },
  { id: "concierge", label: "Concierge add-on", price: 1500, icon: Sparkles, sub: "Itinerary, table bookings, etc." },
];

const fmtLong = (iso: string) => {
  const [y, m, d] = iso.split("-");
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"][Number(m) - 1];
  return `${month} ${Number(d)}, ${y}`;
};

export default function Checkout() {
  const router = useRouter();
  const { cart, toggleAddon, clearCart } = useApp();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!cart) router.replace("/");
  }, [cart, router]);

  if (!cart) return null;
  const item = cart.car ?? cart.experience;
  if (!item) return null;

  const car = cart.car;
  const driverChoice: "with-driver" | "self-drive" = cart.addons.includes("driver") ? "with-driver" : "self-drive";

  // Lock to the only valid option if the car doesn't offer a choice.
  // (Auto-sets the addon so totals + booking payload are correct.)
  if (car) {
    if (car.driverOption === "with-driver" && driverChoice !== "with-driver") {
      setTimeout(() => toggleAddon("driver"), 0);
    } else if (car.driverOption === "self-drive" && driverChoice !== "self-drive") {
      setTimeout(() => toggleAddon("driver"), 0);
    }
  }

  const driverLocked = car ? car.driverOption !== "both" : true;
  const driverFee = driverChoice === "with-driver" && car ? DRIVER_FEE * cart.days : 0;

  const base = car ? car.pricePerDay * cart.days : cart.experience!.pricePerPerson * cart.guests;
  const addonTotal = ADDONS.filter((a) => cart.addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const serviceFee = Math.round(base * 0.08);
  const total = base + driverFee + addonTotal + serviceFee;

  const setDriver = (choice: "with-driver" | "self-drive") => {
    if (driverLocked) return;
    const has = cart.addons.includes("driver");
    if (choice === "with-driver" && !has) toggleAddon("driver");
    if (choice === "self-drive" && has) toggleAddon("driver");
  };

  const confirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (car) {
        await createBooking({
          vehicleId: car.id,
          vehicleLabel: `${car.make} ${car.model}`,
          vehiclePhoto: car.photo,
          vehicleLocation: car.location,
          startDate: cart.startDate,
          endDate: cart.endDate,
          driverOption: driverChoice,
          totalCents: total * 100,
          renterId: user && "id" in user ? user.id : undefined,
        });
      }
      clearCart();
      router.push("/booking/confirmed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <AppHeader title="Confirm and pay" />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* Item card */}
        <div className="px-5 py-4 flex items-center gap-3 border-b hairline">
          <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-surface-soft flex-shrink-0">
            <Image
              src={cart.car?.photo ?? cart.experience!.photo}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold tracking-tight truncate">
              {cart.car ? `${cart.car.make} ${cart.car.model}` : cart.experience!.title}
            </div>
            <div className="text-[12px] text-foreground/60 truncate">
              {cart.car
                ? `${cart.days} ${cart.days === 1 ? "day" : "days"} · ${cart.car.location}`
                : `${cart.guests} guests · ${cart.experience!.location}`}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="px-5 py-4 border-b hairline">
          <div className="text-[11px] uppercase tracking-widest text-foreground/60 font-semibold mb-2">
            {cart.car ? "Trip dates" : "Date"}
          </div>
          <div className="text-[15px] font-semibold">
            {fmtLong(cart.startDate)} → {fmtLong(cart.endDate)}
          </div>
          <div className="text-[12px] text-foreground/60 mt-0.5">
            Pickup 10:00 AM · Return 10:00 AM
          </div>
        </div>

        {/* Driver option — only shown for car bookings */}
        {car && (
          <div className="px-5 py-4 border-b hairline">
            <div className="text-[11px] uppercase tracking-widest text-foreground/60 font-semibold mb-3">
              Driver
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(car.driverOption === "self-drive" || car.driverOption === "both") && (
                <button
                  onClick={() => setDriver("self-drive")}
                  disabled={driverLocked}
                  className={`tap text-left p-3 rounded-2xl border transition ${
                    driverChoice === "self-drive" ? "border-accent border-2 bg-accent/5" : "hairline"
                  } ${driverLocked ? "opacity-100" : ""}`}
                >
                  <div className="text-[14px] font-semibold tracking-tight">Self-drive</div>
                  <div className="text-[11px] text-foreground/60 mt-0.5">You drive · license required</div>
                  <div className="text-[11px] text-foreground/40 mt-1">Included</div>
                </button>
              )}
              {(car.driverOption === "with-driver" || car.driverOption === "both") && (
                <button
                  onClick={() => setDriver("with-driver")}
                  disabled={driverLocked}
                  className={`tap text-left p-3 rounded-2xl border transition ${
                    driverChoice === "with-driver" ? "border-accent border-2 bg-accent/5" : "hairline"
                  } ${driverLocked ? "opacity-100" : ""}`}
                >
                  <div className="text-[14px] font-semibold tracking-tight">With driver</div>
                  <div className="text-[11px] text-foreground/60 mt-0.5">Pro driver included</div>
                  <div className="text-[11px] text-foreground/40 mt-1">
                    +₱{DRIVER_FEE.toLocaleString()} / day
                  </div>
                </button>
              )}
            </div>
            {driverLocked && (
              <div className="text-[11px] text-foreground/50 mt-2">
                This vehicle is {car.driverOption === "with-driver" ? "driver-only." : "self-drive only."}
              </div>
            )}
          </div>
        )}

        {/* Upsells */}
        <div className="px-5 py-4">
          <div className="text-[11px] uppercase tracking-widest text-foreground/60 font-semibold mb-3">
            Add-ons
          </div>
          <div className="space-y-2">
            {ADDONS.map((a) => {
              const selected = cart.addons.includes(a.id);
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAddon(a.id)}
                  className={`tap w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left ${
                    selected ? "border-accent border-2 bg-accent/5" : "hairline"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selected ? "bg-accent text-accent-fg" : "bg-surface-soft text-foreground"
                  }`}>
                    {selected ? <Check size={18} strokeWidth={2.5} /> : <Icon size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold tracking-tight">{a.label}</div>
                    <div className="text-[11px] text-foreground/60 truncate">{a.sub}</div>
                  </div>
                  <div className="text-[13px] font-semibold">+₱{a.price.toLocaleString()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing */}
        <div className="px-5 py-4 border-t hairline space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-foreground/70">Base ({cart.days} {cart.days === 1 ? "day" : "days"})</span><span>₱{base.toLocaleString()}</span></div>
          {driverFee > 0 && (
            <div className="flex justify-between"><span className="text-foreground/70">Driver ({cart.days} {cart.days === 1 ? "day" : "days"})</span><span>₱{driverFee.toLocaleString()}</span></div>
          )}
          {addonTotal > 0 && (
            <div className="flex justify-between"><span className="text-foreground/70">Add-ons</span><span>₱{addonTotal.toLocaleString()}</span></div>
          )}
          <div className="flex justify-between"><span className="text-foreground/70">Service fee</span><span>₱{serviceFee.toLocaleString()}</span></div>
          <div className="flex justify-between pt-2 border-t hairline mt-2 text-[15px] font-semibold">
            <span>Total</span><span>₱{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t hairline bg-background px-5 py-3">
        <button
          onClick={confirm}
          disabled={submitting}
          className="tap w-full bg-accent text-accent-fg rounded-full py-3.5 font-semibold text-[14px] disabled:opacity-60"
        >
          {submitting ? "Confirming…" : `Reserve · ₱${total.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}
