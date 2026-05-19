"use client";
import { experiences } from "@/lib/mock";
import ExperienceCard from "@/components/ExperienceCard";
import { Search } from "lucide-react";

export default function ExperiencesPage() {
  const featured = experiences[0];

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-6 pt-4 md:pt-10 pb-12 md:pb-24">
      <h1 className="text-[26px] md:text-[44px] font-bold tracking-tightest mb-2 md:mb-3">Experiences</h1>
      <p className="hidden md:block text-[15px] text-gray-500 mb-6 max-w-2xl">
        Curated joiner tours with transport included — small-group rides hosted by locals.
      </p>

      <div className="flex items-center gap-2.5 bg-gray-100 rounded-full px-4 py-3 text-[14px] mb-5 md:max-w-md">
        <Search size={17} className="text-gray-500" />
        <input className="flex-1 bg-transparent outline-none placeholder:text-gray-500" placeholder="Surf, food crawl, day trip…" />
      </div>

      <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Featured</div>
      <ExperienceCard exp={featured} featured />

      <div className="mt-6 text-[12px] md:text-[14px] text-gray-500">
        More experiences are coming soon — we&apos;re curating each one in person.
      </div>
    </div>
  );
}
