"use client";
import { useRouter } from "next/navigation";
import { Crown, Car, ShieldAlert, Phone, Check, ArrowLeft } from "lucide-react";
import { useSubscription } from "@/lib/subscription";

const perks = [
  { icon: Phone, label: "Chauffeurs on demand", sub: "Uniformed pro drivers, by the hour or full day" },
  { icon: Car, label: "Black vans & fleet", sub: "Toyota Alphard, HiAce Super Grandia, Mercedes V-Class" },
  { icon: ShieldAlert, label: "VIP police escort", sub: "Routed convoys for events, airports, and provincial trips" },
  { icon: Crown, label: "Concierge", sub: "Last-minute bookings, restaurant tables, errands run for you" },
];

export default function BlackPage() {
  const router = useRouter();
  const { isBlackMember, activate, cancel } = useSubscription();

  return (
    <div className="flex-1 flex flex-col bg-black text-white">
      <div className="flex items-center justify-between px-5 h-12">
        <button onClick={() => router.back()} className="w-9 h-9 -ml-2 flex items-center justify-center">
          <ArrowLeft size={22} />
        </button>
        {isBlackMember && (
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-70 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> Active
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] opacity-70 mb-3">Membership</div>
        <h1 className="text-[40px] font-bold tracking-tightest leading-[0.95] mb-3">
          Sakay<br/>Black.
        </h1>
        <p className="text-[14px] opacity-80 leading-relaxed mb-8 max-w-[300px]">
          A subscription for how you actually move. Chauffeurs, black vans, VIP police escort, and concierge — one membership, one app.
        </p>

        <div className="space-y-3 mb-8">
          {perks.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-[15px] font-semibold tracking-tight">{p.label}</div>
                  <div className="text-[12px] opacity-70 leading-relaxed">{p.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/[0.1] p-5 mb-6">
          <div className="text-[10px] uppercase tracking-[0.25em] opacity-70 mb-1">Monthly</div>
          <div className="flex items-end gap-1 mb-3">
            <div className="text-[36px] font-bold tracking-tightest leading-none">₱14,900</div>
            <div className="text-[12px] opacity-70 pb-1.5">/ month</div>
          </div>
          <div className="text-[12px] opacity-80 leading-relaxed mb-4">
            {isBlackMember
              ? "You're a Black member. The whole app stays in Black mode while your membership is active."
              : "Cancel anytime. First month includes 2 chauffeured trips on us. Activating flips the entire app to Black."}
          </div>
          <ul className="text-[13px] space-y-1.5 mb-4 opacity-90">
            <li className="flex items-center gap-2"><Check size={14} /> 4 chauffeured hours included monthly</li>
            <li className="flex items-center gap-2"><Check size={14} /> 20% off all marketplace rentals</li>
            <li className="flex items-center gap-2"><Check size={14} /> Priority dispatch — no surge pricing</li>
            <li className="flex items-center gap-2"><Check size={14} /> Direct line to a Sakay concierge</li>
          </ul>
          {isBlackMember ? (
            <button
              onClick={cancel}
              className="w-full border border-white/30 rounded-full py-3.5 font-semibold text-[14px] active:bg-white/5"
            >
              Cancel membership
            </button>
          ) : (
            <button
              onClick={activate}
              className="w-full bg-white text-black rounded-full py-3.5 font-semibold text-[14px] active:opacity-90"
            >
              Activate membership
            </button>
          )}
        </div>

        <div className="text-[10px] opacity-50 text-center tracking-wide">
          Sakay Black is invite-friendly. Verification typically takes 1 business day.
        </div>
      </div>
    </div>
  );
}
