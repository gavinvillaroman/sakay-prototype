"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApp } from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import { Check, ShieldCheck, Sparkles, Car as CarIcon, UserCheck } from "lucide-react";
import { useEffect } from "react";

const ADDONS = [
  { id: "driver", label: "Add a chauffeur", price: 2500, icon: UserCheck, sub: "Pro driver, uniformed (Sakay Black)" },
  { id: "premium", label: "Premium insurance", price: 850, icon: ShieldCheck, sub: "Zero-deductible coverage" },
  { id: "delivery", label: "Doorstep delivery", price: 600, icon: CarIcon, sub: "We bring the car to you" },
  { id: "concierge", label: "Concierge add-on", price: 1500, icon: Sparkles, sub: "Itinerary, table bookings, etc." },
];

export default function Checkout() {
  const router = useRouter();
  const { cart, toggleAddon, clearCart } = useApp();

  useEffect(() => {
    if (!cart) router.replace("/");
  }, [cart, router]);

  if (!cart) return null;
  const item = cart.car ?? cart.experience;
  if (!item) return null;

  const base = cart.car ? cart.car.pricePerDay * cart.days : cart.experience!.pricePerPerson * cart.guests;
  const addonTotal = ADDONS.filter((a) => cart.addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const serviceFee = Math.round(base * 0.08);
  const total = base + addonTotal + serviceFee;

  const confirm = () => {
    clearCart();
    router.push("/booking/confirmed");
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <AppHeader title="Confirm and pay" />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* Item card */}
        <div className="px-5 py-4 flex items-center gap-3 border-b hairline">
          <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
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
            <div className="text-[12px] text-gray-500 truncate">
              {cart.car
                ? `${cart.days} ${cart.days === 1 ? "day" : "days"} · ${cart.car.location}`
                : `${cart.guests} guests · ${cart.experience!.location}`}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="px-5 py-4 border-b hairline">
          <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">
            {cart.car ? "Trip dates" : "Date"}
          </div>
          <div className="text-[15px] font-medium">May 17, 2026 → May 20, 2026</div>
          <div className="text-[12px] text-gray-500 mt-0.5">Pickup 10:00 AM · Return 10:00 AM</div>
        </div>

        {/* Upsells */}
        <div className="px-5 py-4">
          <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-3">
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
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left ${
                    selected ? "border-black bg-black/[0.02]" : "hairline"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selected ? "bg-black text-white" : "bg-gray-100 text-black"
                  }`}>
                    {selected ? <Check size={18} strokeWidth={2.5} /> : <Icon size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold tracking-tight">{a.label}</div>
                    <div className="text-[11px] text-gray-500 truncate">{a.sub}</div>
                  </div>
                  <div className="text-[13px] font-semibold">+₱{a.price.toLocaleString()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing */}
        <div className="px-5 py-4 border-t hairline space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-gray-600">Base</span><span>₱{base.toLocaleString()}</span></div>
          {addonTotal > 0 && (
            <div className="flex justify-between"><span className="text-gray-600">Add-ons</span><span>₱{addonTotal.toLocaleString()}</span></div>
          )}
          <div className="flex justify-between"><span className="text-gray-600">Service fee</span><span>₱{serviceFee.toLocaleString()}</span></div>
          <div className="flex justify-between pt-2 border-t hairline mt-2 text-[15px] font-semibold">
            <span>Total</span><span>₱{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t hairline bg-white px-5 py-3">
        <button
          onClick={confirm}
          className="w-full bg-black text-white rounded-full py-3.5 font-semibold text-[14px]"
        >
          Pay ₱{total.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
