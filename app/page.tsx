"use client";
import { Search, Bike, Car as CarIcon, ChevronRight, Crown, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { cars, experiences, categories } from "@/lib/mock";
import CarCard from "@/components/CarCard";
import ExperienceCard from "@/components/ExperienceCard";

export default function HomePage() {
  const featured = experiences[0];
  const motorcycles = cars.filter((c) => c.category === "motorcycle");
  const nearby = cars.filter((c) => c.category !== "motorcycle");

  return (
    <div>
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

              <div className="flex items-center gap-2 bg-white border hairline rounded-full p-1.5 max-w-[560px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-2 flex-1 px-4">
                  <MapPin size={16} className="text-gray-400" />
                  <input
                    placeholder="Where to drive?"
                    className="flex-1 outline-none text-[15px] py-2.5 bg-transparent"
                  />
                </div>
                <div className="w-px h-6 bg-gray-200" />
                <input
                  placeholder="May 17 → 20"
                  className="w-32 outline-none text-[15px] py-2.5 px-3 bg-transparent text-gray-500"
                />
                <Link
                  href="/browse"
                  className="bg-black text-white rounded-full px-5 py-2.5 font-semibold text-[14px] flex items-center gap-1.5 flex-shrink-0"
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

      {/* MOBILE HEADER */}
      <section className="md:hidden px-5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Sakay</div>
            <div className="text-[22px] font-bold tracking-tightest leading-tight">Good morning, Gavin</div>
          </div>
        </div>
        <Link href="/browse" className="flex items-center gap-2.5 bg-gray-100 rounded-full px-4 py-3 text-[14px]">
          <Search size={17} className="text-gray-500" />
          <span className="text-gray-500">Search cars, hosts, cities</span>
        </Link>
      </section>

      {/* CATEGORIES */}
      <section className="px-5 md:px-6 max-w-7xl mx-auto">
        <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.id}
                href={`/browse?cat=${c.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border hairline bg-white text-[13px] font-medium hover:shadow-sm transition"
              >
                <Icon size={14} strokeWidth={2} className="text-gray-600" />
                {c.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mobile-only ride card */}
      <section className="md:hidden px-5">
        <Link href="/ride" className="flex items-center gap-3 p-4 rounded-2xl border hairline active:bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
            <CarIcon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold tracking-tight">Need a ride now?</div>
            <div className="text-[11px] text-gray-500">Hail a driver in seconds — pay per trip.</div>
          </div>
          <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
        </Link>
      </section>

      {/* Sakay Black */}
      <section className="max-w-7xl mx-auto px-5 md:px-6 mt-5 md:mt-12">
        <Link href="/black" className="block relative overflow-hidden rounded-2xl md:rounded-3xl bg-black text-white p-5 md:p-10 group">
          <div className="md:grid md:grid-cols-2 md:gap-10 md:items-center">
            <div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] opacity-70 mb-2 md:mb-3">Membership</div>
              <div className="text-[22px] md:text-[44px] font-semibold tracking-tightest leading-tight mb-1 md:mb-3">
                Sakay Black
              </div>
              <div className="text-[13px] md:text-[16px] opacity-80 mb-3 md:mb-6 max-w-[420px]">
                Chauffeurs, black vans, VIP police escort, and concierge. One subscription, one number.
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

      {/* Featured experience */}
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

      {/* Motorbikes */}
      <section className="max-w-7xl mx-auto px-5 md:px-6 mt-8 md:mt-16">
        <div className="flex items-end justify-between mb-3 md:mb-5">
          <div>
            <h2 className="text-[18px] md:text-[28px] font-semibold tracking-tightest flex items-center gap-2">
              <Bike size={20} className="md:w-7 md:h-7" /> Motorbikes
            </h2>
            <p className="text-[12px] md:text-[14px] text-gray-500 mt-1">Beat the traffic — self-drive only.</p>
          </div>
          <Link href="/browse?cat=motorcycle" className="text-[12px] md:text-[14px] text-gray-500 hover:text-black">See all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {motorcycles.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      </section>

      {/* Nearby */}
      <section className="max-w-7xl mx-auto px-5 md:px-6 mt-8 md:mt-16 pb-12 md:pb-24">
        <div className="flex items-end justify-between mb-3 md:mb-5">
          <div>
            <h2 className="text-[18px] md:text-[28px] font-semibold tracking-tightest">Available near you</h2>
            <p className="hidden md:block text-[14px] text-gray-500 mt-1">All hosted by verified Sakay partners.</p>
          </div>
          <Link href="/browse" className="text-[12px] md:text-[14px] text-gray-500 hover:text-black">See all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {nearby.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      </section>

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
              <li><Link href="/experiences">Experiences</Link></li>
              <li><Link href="/black">Sakay Black</Link></li>
              <li><Link href="/ride">Hail a ride</Link></li>
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
            <div className="flex gap-5"><span>Terms</span><span>Privacy</span><span>Help</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
