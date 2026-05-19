"use client";
import { Search, ChevronRight, Crown, ShieldCheck, MapPin, Car, UserCheck, Sparkles, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cars, experiences } from "@/lib/mock";
import CarCard from "@/components/CarCard";
import ExperienceCard from "@/components/ExperienceCard";
import PullToRefresh from "@/components/PullToRefresh";
import { flags } from "@/lib/flags";

const SERVICE_TILES = [
  { href: "/browse?driver=self-drive", label: "Self-drive", Icon: Car, bg: "bg-white/15" },
  { href: "/browse?driver=with-driver", label: "With Driver", Icon: UserCheck, bg: "bg-white/15" },
  { href: "/black", label: "Black", Icon: Crown, bg: "bg-black", text: "text-white" },
  { href: "/browse", label: "More", Icon: MoreHorizontal, bg: "bg-white/15" },
];

export default function HomePage() {
  const featured = experiences[0];
  const motorcycles = cars.filter((c) => c.category === "motorcycle");
  const nearby = cars.filter((c) => c.category !== "motorcycle");
  const trending = nearby.slice(0, 6);

  return (
    <div>
      <PullToRefresh />
      {/* HERO (desktop) */}
      <section className="hidden md:block">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="grid grid-cols-12 gap-10 items-center">
            <div className="col-span-7">
              <div className="text-[12px] uppercase tracking-[0.25em] text-gray-500 font-semibold mb-3">
                Car-sharing · Philippines
              </div>
              <h1 className="text-[64px] leading-[1.02] font-bold tracking-tightest mb-5">
                Rent a car. Hail a ride.<br />
                <span className="text-gray-400">Or live a little.</span>
              </h1>
              <p className="text-[17px] text-gray-600 leading-relaxed max-w-[560px] mb-8">
                Self-drive cars, motorbikes, and vans across Metro Manila, Cabanatuan, and Siargao. With or without a driver — your call.
              </p>

              <div className="flex items-center gap-2 bg-surface border hairline rounded-full p-1.5 max-w-[560px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-2 flex-1 px-4">
                  <MapPin size={16} className="text-foreground/40" />
                  <input
                    placeholder="Where to drive?"
                    className="flex-1 outline-none text-[15px] py-2.5 bg-transparent"
                  />
                </div>
                <div className="w-px h-6 bg-foreground/10" />
                <input
                  placeholder="May 17 → 20"
                  className="w-32 outline-none text-[15px] py-2.5 px-3 bg-transparent text-foreground/60"
                />
                <Link
                  href="/browse"
                  className="bg-accent text-accent-fg rounded-full px-5 py-2.5 font-semibold text-[14px] flex items-center gap-1.5 flex-shrink-0"
                >
                  <Search size={15} /> Search
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 text-[13px] text-gray-500">
                <div className="flex items-center gap-1.5"><ShieldCheck size={15} /> ₱2M Sakay Protection</div>
                <div className="flex items-center gap-1.5">★ Hosted by vetted partners</div>
              </div>
            </div>

            <div className="col-span-5">
              <Link href={`/car/${nearby[4]?.id ?? "c5"}`} className="block relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 group">
                <img
                  src={nearby[4]?.photo ?? "/cars/mitsubishi-montero.webp"}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="text-[11px] uppercase tracking-widest opacity-80 mb-1">Trending this week</div>
                  <div className="text-[22px] font-semibold tracking-tight leading-tight">
                    Mitsubishi Montero Sport
                  </div>
                  <div className="text-[13px] opacity-90">From ₱4,500 / day</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE — colored header bleeds into status-bar zone */}
      <section
        className="md:hidden bg-accent text-accent-fg"
        style={{
          marginTop: "calc(-1 * env(safe-area-inset-top))",
          paddingTop: "calc(env(safe-area-inset-top) + 12px)",
          paddingBottom: "36px",
        }}
      >
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] opacity-80 font-semibold">Magandang araw</div>
              <div className="text-[22px] font-bold tracking-tight leading-tight">Hi, Gavin</div>
            </div>
            <button className="flex items-center gap-1 text-[12px] font-medium bg-white/15 rounded-full px-3 py-1.5">
              <MapPin size={13} /> Nueva Ecija
            </button>
          </div>

          <Link
            href="/browse"
            className="flex items-center gap-2.5 bg-white rounded-full px-4 py-3 text-[14px] text-foreground/60 shadow-sm"
          >
            <Search size={17} className="text-foreground/50" />
            <span>Where do you want to go?</span>
          </Link>
        </div>
      </section>

      {/* MOBILE — service tile grid (4 across) */}
      <section className="md:hidden px-5 -mt-5">
        <div className="bg-surface rounded-2xl border hairline p-3 grid grid-cols-4 gap-2 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.15)]">
          {SERVICE_TILES.map(({ href, label, Icon, bg, text }, i) => (
            <Link
              key={label}
              href={href}
              className={`tap float-in float-in-delay-${i + 1} flex flex-col items-center justify-center gap-1.5 py-2 rounded-xl active:bg-surface-soft`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${text ?? "text-foreground"} ${bg === "bg-white/15" ? "bg-accent/10 text-accent" : ""}`}>
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <div className="text-[11px] font-semibold tracking-tight">{label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* MOBILE — Promo banner */}
      <section className="md:hidden px-5 mt-5">
        <Link
          href="/browse?driver=self-drive"
          className="tap float-in block relative overflow-hidden rounded-2xl bg-accent text-accent-fg p-5"
        >
          <div className="text-[20px] font-bold tracking-tight leading-tight mb-1">
            Cheaper. Faster.<br />Drive yourself.
          </div>
          <div className="text-[12px] opacity-90 mb-3">Self-drive cars from ₱2,800 / day</div>
          <div className="inline-flex items-center gap-1 bg-white text-accent rounded-full px-4 py-1.5 text-[12px] font-semibold">
            Book now <ChevronRight size={13} />
          </div>
        </Link>
      </section>

      {/* MOBILE — Available in Nueva Ecija */}
      <section className="md:hidden mt-6">
        <div className="px-5 flex items-end justify-between mb-3">
          <h2 className="text-[18px] font-bold tracking-tight">Available in Nueva Ecija</h2>
          <Link href="/browse" className="text-[12px] text-foreground/60">See all</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x-mandatory px-5 pb-2">
          {trending.map((c, i) => (
            <div
              key={c.id}
              className={`tap w-[68vw] max-w-[280px] flex-shrink-0 float-in float-in-delay-${Math.min(i + 1, 4)}`}
            >
              <CarCard car={c} />
            </div>
          ))}
        </div>
      </section>

      {/* Sakay Black — desktop only (mobile already has the Black tile) */}
      {flags.black && (
        <section className="hidden md:block max-w-7xl mx-auto px-6 mt-12">
          <Link href="/black" className="block relative overflow-hidden rounded-2xl md:rounded-3xl bg-black text-white p-5 md:p-10 group">
            <div className="md:grid md:grid-cols-2 md:gap-10 md:items-center">
              <div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] opacity-70 mb-2 md:mb-3">Membership</div>
                <div className="text-[22px] md:text-[44px] font-semibold tracking-tightest leading-tight mb-1 md:mb-3">
                  Sakay Black
                </div>
                <div className="text-[13px] md:text-[16px] opacity-80 mb-3 md:mb-6 max-w-[420px]">
                  Chauffeurs, black vans, and concierge. One subscription, one number.
                </div>
                <div className="inline-flex items-center gap-1 md:bg-white md:text-black md:rounded-full md:px-5 md:py-2.5 text-[12px] md:text-[14px] font-semibold border-b border-white/40 md:border-0 pb-0.5 md:pb-0">
                  Explore membership <ChevronRight size={14} />
                </div>
              </div>
              <div className="hidden md:flex justify-end">
                <Crown size={140} strokeWidth={1} className="opacity-15" />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Featured experience */}
      {flags.experiences && featured && (
        <section className="max-w-7xl mx-auto px-5 md:px-6 mt-8 md:mt-16">
          <div className="flex items-end justify-between mb-3 md:mb-5">
            <div>
              <h2 className="text-[18px] md:text-[28px] font-semibold tracking-tightest">Featured experience</h2>
              <p className="hidden md:block text-[14px] text-gray-500 mt-1">Curated joiner tours with transport included.</p>
            </div>
            <Link href="/experiences" className="text-[12px] md:text-[14px] text-gray-500 hover:text-black">See all</Link>
          </div>
          <ExperienceCard exp={featured} featured />
        </section>
      )}

      {/* Desktop-only — Motorbikes grid */}
      <section className="hidden md:block max-w-7xl mx-auto px-6 mt-16">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tightest flex items-center gap-2">
              <Sparkles size={28} /> Motorbikes
            </h2>
            <p className="text-[14px] text-gray-500 mt-1">Beat the traffic — self-drive only.</p>
          </div>
          <Link href="/browse?cat=motorcycle" className="text-[14px] text-gray-500 hover:text-black">See all</Link>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {motorcycles.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      </section>

      {/* Available near you — desktop grid only (mobile uses the carousel above) */}
      <section className="hidden md:block max-w-7xl mx-auto px-6 mt-16 pb-24">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tightest">Available in Nueva Ecija</h2>
            <p className="text-[14px] text-gray-500 mt-1">All hosted by verified Sakay partners.</p>
          </div>
          <Link href="/browse" className="text-[14px] text-foreground/60 hover:text-foreground">See all</Link>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {nearby.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      </section>

      {/* Mobile bottom spacing so the last card clears the fixed nav */}
      <div className="md:hidden h-20" />

      {/* Footer (desktop) */}
      <footer className="hidden md:block border-t hairline">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-8 text-[13px]">
          <div>
            <div className="text-[16px] font-bold tracking-tightest mb-2">Sakay</div>
            <div className="text-gray-500">Car-sharing marketplace + lifestyle mobility, Philippines.</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Rent</div>
            <ul className="space-y-1 text-gray-500">
              <li><Link href="/browse">All vehicles</Link></li>
              <li><Link href="/browse?cat=motorcycle">Motorbikes</Link></li>
              <li><Link href="/browse?cat=van">Vans</Link></li>
              <li><Link href="/browse?cat=suv">SUVs</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Sakay</div>
            <ul className="space-y-1 text-gray-500">
              {flags.experiences && <li><Link href="/experiences">Experiences</Link></li>}
              {flags.black && <li><Link href="/black">Sakay Black</Link></li>}
              {flags.ride && <li><Link href="/ride">Hail a ride</Link></li>}
              <li><Link href="/legal/help">Help</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Hosts</div>
            <ul className="space-y-1 text-gray-500">
              <li><Link href="/host">Host dashboard</Link></li>
              <li><Link href="/profile">Become a host</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t hairline">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-[12px] text-gray-500">
            <div>© 2026 Sakay. Prototype build.</div>
            <div className="flex gap-5">
              <Link href="/legal/terms">Terms</Link>
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/legal/help">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
