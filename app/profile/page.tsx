"use client";
import Link from "next/link";
import { user } from "@/lib/mock";
import {
  Star,
  CreditCard,
  MapPin,
  Shield,
  HelpCircle,
  Settings,
  ChevronRight,
  Crown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const items = [
  { icon: CreditCard, label: "Payment methods", sub: "GCash · ending 4823" },
  { icon: MapPin, label: "Saved addresses", sub: "Home, Work, 2 more" },
  { icon: Shield, label: "Verification", sub: "Driver's license verified" },
  { icon: HelpCircle, label: "Help & support", sub: "FAQs, chat with Sakay" },
  { icon: Settings, label: "Settings", sub: "Notifications, language" },
];

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto bg-white pb-12">
      <div className="px-5 md:px-6 pt-4 md:pt-10 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-[20px] font-semibold tracking-tight flex-shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold tracking-tightest leading-tight truncate">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center gap-1.5 text-[12px] text-gray-600 mt-0.5">
              <Star size={11} className="fill-black" />
              <span className="font-medium">{user.rating}</span>
              <span className="text-gray-400">·</span>
              <span>{user.trips} trips</span>
              <span className="text-gray-400">·</span>
              <span>Joined {user.joined}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sakay Black membership */}
      <div className="mx-5 mb-4 relative overflow-hidden rounded-2xl bg-black text-white p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Crown size={16} />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] opacity-70">Member</div>
            <div className="text-[16px] font-semibold tracking-tight">Sakay Black</div>
          </div>
          <Link href="/black" className="text-[12px] underline opacity-90">Manage</Link>
        </div>
        <div className="text-[12px] opacity-80 leading-relaxed">
          Chauffeur service, VIP escort, and concierge unlocked. Renews June 12.
        </div>
      </div>

      {/* Host dashboard */}
      {user.isHost && (
        <Link
          href="/host"
          className="mx-5 mb-5 flex items-center gap-3 p-4 rounded-2xl border hairline active:bg-gray-50"
        >
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            <LayoutDashboard size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold tracking-tight">Host dashboard</div>
            <div className="text-[12px] text-gray-500">2 listings · ₱184,500 earned this month</div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
      )}

      <div className="px-5 mb-2">
        <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
          Account
        </div>
      </div>
      <div className="px-5 space-y-0.5 mb-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.label}
              className="w-full flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg active:bg-gray-100 text-left"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Icon size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px]">{it.label}</div>
                <div className="text-[11px] text-gray-500 truncate">{it.sub}</div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          );
        })}
      </div>

      <button className="mx-5 flex items-center justify-center gap-2 text-red-500 font-semibold text-[13px] py-3 mb-6">
        <LogOut size={15} /> Log out
      </button>

      <div className="text-center text-[10px] text-gray-400 pb-6 tracking-wide">
        Sakay v2 · {user.email}
      </div>
    </div>
  );
}
