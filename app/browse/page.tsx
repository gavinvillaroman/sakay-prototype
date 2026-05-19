"use client";
import { Search, SlidersHorizontal, X, Building2 } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cars, categories } from "@/lib/mock";
import { hostSlug } from "@/lib/host";
import CarCard from "@/components/CarCard";
import { useApp } from "@/lib/store";

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
    <div className="max-w-7xl mx-auto px-5 md:px-6 pt-4 md:pt-8">
      <div className="flex items-end justify-between mb-3 md:mb-6">
        <div>
          <h1 className="text-[26px] md:text-[40px] font-bold tracking-tightest leading-none">Browse</h1>
          <p className="hidden md:block text-[14px] text-gray-500 mt-2">{cars.length} vehicles · Metro Manila, Cabanatuan, Siargao</p>
        </div>
        <button className="hidden md:flex items-center gap-2 border hairline rounded-full px-4 py-2 text-[13px] font-medium hover:shadow-sm">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="flex items-center gap-2.5 bg-gray-100 rounded-full px-4 py-3 text-[14px] mb-3 md:max-w-2xl">
        <Search size={17} className="text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
          placeholder="Search by car, host, or city"
        />
        {query && (
          <button onClick={() => setQuery("")} className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center" aria-label="Clear">
            <X size={12} className="text-white" strokeWidth={3} />
          </button>
        )}
      </div>

      <div className="flex gap-2 py-2 overflow-x-auto no-scrollbar mb-2 md:mb-6">
        {categories.map((c) => {
          const active = filter === c.id;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition ${
                active
                  ? "bg-accent text-accent-fg border-accent"
                  : "bg-surface text-foreground hairline hover:shadow-sm"
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
          <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Hosts</div>
          <div className="grid md:grid-cols-2 gap-2">
            {matchedHosts.map((h) => {
              const list = cars.filter((c) => c.hostName === h);
              return (
                <Link key={h} href={`/h/${hostSlug(h)}`} className="flex items-center gap-3 p-3 rounded-2xl border hairline hover:shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-fg flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold tracking-tight truncate">{h}</div>
                    <div className="text-[11px] text-gray-500">{list.length} {list.length === 1 ? "listing" : "listings"}</div>
                  </div>
                  <span className="text-gray-400">›</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-1 pb-2 text-[12px] text-gray-500">
        {matches.length} {matches.length === 1 ? "car" : "cars"}
        {q ? ` matching "${query}"` : " · sorted by relevance"}
      </div>

      {matches.length === 0 ? (
        <div className="py-16 text-center text-gray-500 text-[14px]">No cars match your search.</div>
      ) : (
        <div className="pb-12 md:pb-24 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {matches.map((c) => <CarCard key={c.id} car={c} />)}
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
