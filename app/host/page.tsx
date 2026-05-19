"use client";
import Image from "next/image";
import { cars, hostStats } from "@/lib/mock";
import AppHeader from "@/components/AppHeader";
import { TrendingUp, MessageSquare, Calendar, Plus } from "lucide-react";

export default function HostDashboard() {
  const myListings = cars.slice(0, 2);
  const max = Math.max(...hostStats.earningsTrend);

  return (
    <div className="max-w-4xl mx-auto bg-background pb-12">
      <div className="md:hidden"><AppHeader title="Host dashboard" /></div>
      <div className="md:pt-8">
        {/* Earnings */}
        <div className="px-5 pt-2 pb-5">
          <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
            This month
          </div>
          <div className="flex items-end gap-2">
            <div className="text-[36px] font-bold tracking-tightest leading-none">
              ₱{hostStats.monthlyEarnings.toLocaleString()}
            </div>
            <div className="flex items-center gap-0.5 text-[12px] text-green-600 font-semibold pb-1.5">
              <TrendingUp size={13} /> +24%
            </div>
          </div>
          <div className="text-[12px] text-gray-500 mt-1">Net of Sakay fee</div>

          {/* Sparkline */}
          <div className="mt-4 flex items-end gap-1.5 h-20">
            {hostStats.earningsTrend.map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t ${i === hostStats.earningsTrend.length - 1 ? "bg-accent" : "bg-foreground/15"}`}
                style={{ height: `${(v / max) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 tracking-wide">
            <span>Jun</span><span>Sep</span><span>Dec</span><span>Mar</span><span>May</span>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="px-5 grid grid-cols-3 gap-2 mb-5">
          <div className="rounded-2xl border hairline p-3">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Listings</div>
            <div className="text-[20px] font-bold tracking-tight mt-1">{hostStats.activeListings}</div>
          </div>
          <div className="rounded-2xl border hairline p-3">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Upcoming</div>
            <div className="text-[20px] font-bold tracking-tight mt-1">{hostStats.upcomingTrips}</div>
          </div>
          <div className="rounded-2xl border hairline p-3">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Response</div>
            <div className="text-[20px] font-bold tracking-tight mt-1">{hostStats.responseRate}%</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-5 grid grid-cols-3 gap-2 mb-6">
          <button className="rounded-2xl bg-accent text-accent-fg py-3 flex flex-col items-center gap-1">
            <Plus size={16} />
            <span className="text-[11px] font-semibold">New listing</span>
          </button>
          <button className="rounded-2xl border hairline py-3 flex flex-col items-center gap-1">
            <Calendar size={16} />
            <span className="text-[11px] font-semibold">Calendar</span>
          </button>
          <button className="rounded-2xl border hairline py-3 flex flex-col items-center gap-1">
            <MessageSquare size={16} />
            <span className="text-[11px] font-semibold">Inbox</span>
          </button>
        </div>

        {/* Listings */}
        <div className="px-5">
          <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">
            Your listings
          </div>
          <div className="space-y-3">
            {myListings.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl border hairline">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={c.photo} alt="" fill unoptimized className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold tracking-tight truncate">
                    {c.make} {c.model}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">{c.location} · {c.trips} trips</div>
                  <div className="text-[12px] mt-0.5">
                    <span className="font-semibold">₱{c.pricePerDay.toLocaleString()}</span>
                    <span className="text-gray-500"> /day</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Live</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
