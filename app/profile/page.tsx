"use client";
import Link from "next/link";
import { user } from "@/lib/mock";
import { useAuth } from "@/lib/auth/context";
import { useSubscription } from "@/lib/subscription";
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
  LogOut,
  Plus,
  Mail,
  Phone,
  Pencil,
} from "lucide-react";

const items = [
  { icon: CreditCard, label: "Payment methods", sub: "GCash · ending 4823" },
  { icon: MapPin, label: "Saved addresses", sub: "Home, Work, 2 more" },
  { icon: Shield, label: "Verification", sub: "Driver's license verified" },
  { icon: HelpCircle, label: "Help & support", sub: "FAQs, chat with Sakay" },
  { icon: Settings, label: "Settings", sub: "Notifications, language" },
];

export default function ProfilePage() {
  const { signOut } = useAuth();
  const isBlackMember = useSubscription((s) => s.isBlackMember);

  return (
    <div className="max-w-3xl mx-auto bg-background pb-12">
      <div className="px-5 md:px-6 pt-6 md:pt-10 pb-5">
        <div className="flex items-center gap-4 float-in">
          <div className="w-20 h-20 rounded-full bg-accent text-accent-fg flex items-center justify-center text-[26px] font-semibold tracking-tight flex-shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[24px] font-bold tracking-tightest leading-tight truncate">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center gap-1.5 text-[12.5px] text-foreground/60 mt-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{user.rating}</span>
              <span className="text-foreground/40">·</span>
              <span>{user.trips} trips</span>
              <span className="text-foreground/40">·</span>
              <span>Joined {user.joined}</span>
            </div>
          </div>
          <button
            aria-label="Edit profile"
            className="tap w-9 h-9 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0"
          >
            <Pencil size={15} />
          </button>
        </div>

        {/* Contact rows — confirms the profile feels real */}
        <div className="mt-4 space-y-1.5 text-[13px] text-foreground/70">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-foreground/40" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-foreground/40" />
            <span>{user.phone}</span>
          </div>
        </div>
      </div>

      {/* Sakay Black membership */}
      {flags.black && (
        <Link
          href="/black"
          className="mx-5 mb-4 block relative overflow-hidden rounded-2xl bg-black text-white p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Crown size={16} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-70">
                {isBlackMember ? "Member" : "Upgrade"}
              </div>
              <div className="text-[16px] font-semibold tracking-tight">Sakay Black</div>
            </div>
            <span className="text-[12px] underline opacity-90">
              {isBlackMember ? "Manage" : "Explore"}
            </span>
          </div>
          <div className="text-[12px] opacity-80 leading-relaxed">
            {isBlackMember
              ? "Chauffeur service and concierge unlocked. Renews June 12."
              : "Chauffeurs, black vans, and concierge. Flip the app to Black mode."}
          </div>
        </Link>
      )}

      {/* Host dashboard — visible when already a host */}
      {user.isHost ? (
        <Link
          href="/host"
          className="mx-5 mb-3 flex items-center gap-3 p-4 rounded-2xl border hairline active:bg-surface-soft"
        >
          <div className="w-10 h-10 rounded-full bg-accent text-accent-fg flex items-center justify-center">
            <LayoutDashboard size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold tracking-tight">Host dashboard</div>
            <div className="text-[12px] text-foreground/60">2 listings · ₱184,500 earned this month</div>
          </div>
          <ChevronRight size={18} className="text-foreground/40" />
        </Link>
      ) : (
        <Link
          href="/host"
          className="mx-5 mb-3 flex items-center gap-3 p-4 rounded-2xl bg-accent text-accent-fg active:opacity-90"
        >
          <div className="w-10 h-10 rounded-full bg-accent-fg text-accent flex items-center justify-center">
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
        <Link href="/browse" className="rounded-xl border hairline p-3 text-center active:bg-surface-soft">
          <div className="font-semibold tracking-tight">Rent a vehicle</div>
          <div className="text-foreground/60 text-[11px]">Browse listings</div>
        </Link>
        <Link href="/host" className="rounded-xl border hairline p-3 text-center active:bg-surface-soft">
          <div className="font-semibold tracking-tight">Host mode</div>
          <div className="text-foreground/60 text-[11px]">{user.isHost ? "Manage listings" : "Become a host"}</div>
        </Link>
      </div>

      <div className="px-5 mb-2">
        <div className="text-[11px] uppercase tracking-widest text-foreground/50 font-semibold mb-1">
          Account
        </div>
      </div>
      <div className="px-5 space-y-0.5 mb-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.label}
              className="w-full flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg active:bg-surface-soft text-left"
            >
              <div className="w-9 h-9 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0">
                <Icon size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px]">{it.label}</div>
                <div className="text-[11px] text-foreground/60 truncate">{it.sub}</div>
              </div>
              <ChevronRight size={16} className="text-foreground/40" />
            </button>
          );
        })}
      </div>

      <div className="text-center text-[10px] text-foreground/40 pt-4 pb-6 tracking-wide">
        Sakay ·{" "}
        <Link href="/legal/terms" className="underline">Terms</Link>{" "}·{" "}
        <Link href="/legal/privacy" className="underline">Privacy</Link>
      </div>

      {/* Sign out at the very bottom */}
      <form
        action="/auth/signout"
        method="post"
        onSubmit={() => { void signOut(); }}
        className="px-5 pb-8"
      >
        <button
          type="submit"
          className="tap w-full flex items-center justify-center gap-2 text-red-500 font-semibold text-[14px] py-3.5 rounded-2xl border border-red-500/30 hover:bg-red-500/5"
        >
          <LogOut size={16} /> Sign out
        </button>
      </form>
    </div>
  );
}
