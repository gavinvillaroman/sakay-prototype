"use client";
import { Search, SlidersHorizontal, X, Building2, Star, Zap, ChevronRight } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cars, categories, type Car } from "@/lib/mock";
import { hostSlug } from "@/lib/host";
import { useApp } from "@/lib/store";

const seater = (c: Car) => {
  const f = c.features.find((x) => /seat/i.test(x));
  return f ?? c.features[0] ?? "";
};

function CarRow({ car }: { car: Car }) {
  return (
    <Link
      href={`/car/${car.id}`}
      className="tap flex items-center gap-3 p-3 rounded-2xl border hairline hover:shadow-sm bg-surface"
    >
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-soft flex-shrink-0">
        <Image src={car.photo} alt={`${car.make} ${car.model}`} fill unoptimized className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14.5px] font-semibold tracking-tight truncate">
          {car.make} {car.model}
        </div>
        <div className="text-[12px] text-foreground/60 truncate">
          {seater(car) ? `${seater(car)} · ` : ""}{car.location}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5 text-[12px]">
            <Star size={11} strokeWidth={0} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{car.rating.toFixed(2)}</span>
            <span className="text-foreground/50">({car.trips})</span>
          </div>
          {car.instantBook && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 rounded-full px-1.5 py-0.5">
              <Zap size={10} strokeWidth={3} /> Instant
            </span>
          )}
          {car.regionTag && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
              {car.regionTag}
            </span>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[14px] font-bold tracking-tight">
          ₱{car.pricePerDay.toLocaleString()}
        </div>
        <div className="text-[10px] text-foreground/50 uppercase tracking-wider font-semibold">/ day</div>
      </div>
      <ChevronRight size={16} className="text-foreground/30 flex-shrink-0" />
    </Link>
  );
}

function BrowseInner() {
  const params = useSearchParams();
  const initial = params.get("cat");
  const initialQ = params.get("q") ?? "";
  const { filter, setFilter } = useApp();
  const [query, setQuery] = useState(initialQ);

  useEffect(() => {
    if (initial && initial !== filter) setFilter(initial as never);
  }, [initial, filter, setFilter]);

  const q = query.trim().toLowerCase();
  const byCategory = filter === "all" ? cars : cars.filter((c) => c.category === filter);

  const matches = useMemo(() => {
    if (!q) return byCategory;
    return byCategory.filter((c) => {
      const hay = [c.make, c.model, c.location, c.hostName, c.regionTag ?? "", `${c.make} ${c.model}`].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [byCategory, q]);

  const matchedHosts = useMemo(() => {
    if (!q) return [];
    const hosts = new Set<string>();
    cars.forEach((c) => {
      if (c.hostName.toLowerCase().includes(q)) hosts.add(c.hostName);
    });
    return Array.from(hosts);
  }, [q]);

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 pt-4 md:pt-8">
      <div className="flex items-end justify-between mb-3 md:mb-6">
        <div>
          <h1 className="text-[26px] md:text-[40px] font-bold tracking-tightest leading-none">Browse</h1>
          <p className="hidden md:block text-[14px] text-foreground/60 mt-2">{cars.length} vehicles · Cabanatuan City</p>
        </div>
        <button className="hidden md:flex items-center gap-2 border hairline rounded-full px-4 py-2 text-[13px] font-medium hover:shadow-sm">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2.5 bg-surface-soft rounded-full px-4 py-3 text-[14px] mb-3">
        <Search size={17} className="text-foreground/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none placeholder:text-foreground/50"
          placeholder="Search by car, host, or city"
        />
        {query && (
          <button onClick={() => setQuery("")} className="w-5 h-5 rounded-full bg-foreground/30 flex items-center justify-center" aria-label="Clear">
            <X size={12} className="text-background" strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 py-2 overflow-x-auto no-scrollbar mb-3 md:mb-5">
        {categories.map((c) => {
          const active = filter === c.id;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`tap flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[13px] font-medium ${
                active
                  ? "bg-accent text-accent-fg border-accent"
                  : "bg-surface text-foreground hairline"
              }`}
            >
              <Icon size={14} strokeWidth={2} className={active ? "opacity-90" : "text-foreground/60"} />
              {c.label}
            </button>
          );
        })}
      </div>

      {matchedHosts.length > 0 && (
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest text-foreground/50 font-semibold mb-2">Hosts</div>
          <div className="space-y-2">
            {matchedHosts.map((h) => {
              const list = cars.filter((c) => c.hostName === h);
              return (
                <Link key={h} href={`/h/${hostSlug(h)}`} className="tap flex items-center gap-3 p-3 rounded-2xl border hairline">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-fg flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold tracking-tight truncate">{h}</div>
                    <div className="text-[11px] text-foreground/60">{list.length} {list.length === 1 ? "listing" : "listings"}</div>
                  </div>
                  <ChevronRight size={16} className="text-foreground/30" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-1 pb-2 text-[12px] text-foreground/60">
        {matches.length} {matches.length === 1 ? "car" : "cars"}
        {q ? ` matching "${query}"` : " · sorted by relevance"}
      </div>

      {matches.length === 0 ? (
        <div className="py-16 text-center text-foreground/60 text-[14px]">No cars match your search.</div>
      ) : (
        <div className="pb-12 md:pb-24 space-y-2.5">
          {matches.map((c, i) => (
            <div key={c.id} className={`float-in float-in-delay-${Math.min(i + 1, 4)}`}>
              <CarRow car={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-5">Loading…</div>}>
      <BrowseInner />
    </Suspense>
  );
}
