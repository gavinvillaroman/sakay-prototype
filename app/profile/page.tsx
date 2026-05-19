"use client";
import Link from "next/link";
import { user } from "@/lib/mock";
import { useAuth } from "@/lib/auth/context";
import { flags } from "@/lib/flags";
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
  LogIn,
  LogOut,
  Plus,
} from "lucide-react";

const items = [
  { icon: CreditCard, label: "Payment methods", sub: "GCash · ending 4823" },
  { icon: MapPin, label: "Saved addresses", sub: "Home, Work, 2 more" },
  { icon: Shield, label: "Verification", sub: "Driver's license verified" },
  { icon: HelpCircle, label: "Help & support", sub: "FAQs, chat with Sakay" },
  { icon: Settings, label: "Settings", sub: "Notifications, language" },
];

export default function ProfilePage() {
  const { user: authUser, loading, signOut } = useAuth();
  const isSignedIn = !loading && !!authUser;

  return (
    <div className="max-w-3xl mx-auto bg-white pb-12">
      {!loading && !isSignedIn && (
        <div className="mx-5 md:mx-6 mt-4 md:mt-10 mb-2 rounded-2xl border hairline p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
            <LogIn size={17} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold tracking-tight">Sign in to book</div>
            <div className="text-[12px] text-gray-500">Save trips, payment methods, and host listings.</div>
          </div>
          <Link
            href="/auth/login"
            className="rounded-full bg-black text-white text-[12px] font-semibold tracking-tight px-4 py-2"
          >
            Sign in
          </Link>
        </div>
      )}
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
      {flags.black && (
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
            Chauffeur service and concierge unlocked. Renews June 12.
          </div>
        </div>
      )}

      {/* Host dashboard — visible when already a host */}
      {user.isHost ? (
        <Link
          href="/host"
          className="mx-5 mb-3 flex items-center gap-3 p-4 rounded-2xl border hairline active:bg-gray-50"
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
      ) : (
        <Link
          href="/host"
          className="mx-5 mb-3 flex items-center gap-3 p-4 rounded-2xl bg-black text-white active:opacity-90"
        >
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
            <Plus size={18} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold tracking-tight">List your vehicle</div>
            <div className="text-[12px] opacity-80">Earn from your car, motorbike, or van when you're not using it.</div>
          </div>
          <ChevronRight size={18} className="opacity-60" />
        </Link>
      )}

      {/* Quick switcher: rent ↔ host */}
      <div className="mx-5 mb-5 grid grid-cols-2 gap-2 text-[12px]">
        <Link href="/browse" className="rounded-xl border hairline p-3 text-center active:bg-gray-50">
          <div className="font-semibold tracking-tight">Rent a vehicle</div>
          <div className="text-gray-500 text-[11px]">Browse listings</div>
        </Link>
        <Link href="/host" className="rounded-xl border hairline p-3 text-center active:bg-gray-50">
          <div className="font-semibold tracking-tight">Host mode</div>
          <div className="text-gray-500 text-[11px]">{user.isHost ? "Manage listings" : "Become a host"}</div>
        </Link>
      </div>

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

      {isSignedIn && (
        <form action="/auth/signout" method="post" onSubmit={() => { void signOut(); }}>
          <button
            type="submit"
            className="mx-5 flex items-center justify-center gap-2 text-red-500 font-semibold text-[13px] py-3 mb-6 w-[calc(100%-2.5rem)]"
          >
            <LogOut size={15} /> Sign out
          </button>
        </form>
      )}

      <div className="text-center text-[10px] text-gray-400 pb-6 tracking-wide">
        Sakay · {user.email} ·{" "}
        <Link href="/legal/terms" className="underline">Terms</Link>{" "}·{" "}
        <Link href="/legal/privacy" className="underline">Privacy</Link>
      </div>
    </div>
  );
}
