import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Experience } from "@/lib/mock";

export default function ExperienceCard({
  exp,
  featured = false,
}: {
  exp: Experience;
  featured?: boolean;
}) {
  return (
    <Link href={`/experience/${exp.id}`} className="block">
      <div className={`relative ${featured ? "aspect-[16/10]" : "aspect-[4/5]"} bg-gray-100 rounded-2xl overflow-hidden`}>
        <Image src={exp.photo} alt={exp.title} fill unoptimized className="object-cover" />
        {featured && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
            <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              Featured
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 text-white">
              <div className="text-[11px] uppercase tracking-widest opacity-80 mb-1">
                {exp.location}
              </div>
              <div className="text-[20px] font-semibold leading-tight tracking-tight mb-1">
                {exp.title}
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="opacity-90">
                  with {exp.host}
                </span>
                <span className="font-semibold">
                  ₱{exp.pricePerPerson.toLocaleString()}
                  <span className="font-normal opacity-80"> {exp.unit}</span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      {!featured && (
        <div className="pt-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[14px] font-semibold tracking-tight leading-tight">
                {exp.title}
              </div>
              <div className="text-[12px] text-gray-500 truncate mt-0.5">
                {exp.location} · {exp.duration}
              </div>
            </div>
            <div className="flex items-center gap-1 text-[12px] flex-shrink-0">
              <Star size={11} strokeWidth={2.5} className="fill-black" />
              <span className="font-medium">{exp.rating}</span>
            </div>
          </div>
          <div className="mt-1 text-[13px]">
            <span className="font-semibold">₱{exp.pricePerPerson.toLocaleString()}</span>
            <span className="text-gray-500"> {exp.unit}</span>
          </div>
        </div>
      )}
    </Link>
  );
}
