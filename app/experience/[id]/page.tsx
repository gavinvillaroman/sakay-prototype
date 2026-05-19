"use client";
import { use } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { experiences } from "@/lib/mock";
import { useApp } from "@/lib/store";
import Avatar from "@/components/Avatar";
import { Star, Clock, MapPin, Heart, Share } from "lucide-react";

export default function ExperienceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const exp = experiences.find((e) => e.id === id);
  const { startBooking } = useApp();
  if (!exp) notFound();

  const book = () => {
    startBooking({ experience: exp });
    router.push("/booking/checkout");
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="relative">
        <div className="aspect-[4/3] relative bg-gray-100">
          <Image src={exp.photo} alt={exp.title} fill unoptimized className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/20" />
        </div>
        <div className="absolute top-3 left-0 right-0 flex items-center justify-between px-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center">←</button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Share size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Heart size={16} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="text-[11px] uppercase tracking-widest opacity-90 mb-1">{exp.location}</div>
          <h1 className="text-[24px] font-semibold tracking-tightest leading-tight">{exp.title}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-5 py-4 flex items-center gap-4 text-[13px] border-b hairline">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{exp.rating}</span>
            <span className="text-gray-500">({exp.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock size={12} /> {exp.duration}
          </div>
          <div className="flex items-center gap-1 text-gray-600 truncate">
            <MapPin size={12} /> {exp.location}
          </div>
        </div>

        <div className="px-5 py-4 flex items-center gap-3 border-b hairline">
          <Avatar name={exp.host} photo={exp.hostPhoto} size={44} />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold">Hosted by {exp.host}</div>
            <div className="text-[12px] text-gray-500">Sakay verified host</div>
          </div>
        </div>

        <div className="px-5 py-4 border-b hairline">
          <div className="flex gap-2 flex-wrap mb-3">
            {exp.tags.map((t) => (
              <span key={t} className="text-[11px] border hairline rounded-full px-2.5 py-1">{t}</span>
            ))}
          </div>
          <p className="text-[14px] text-gray-700 leading-relaxed">{exp.description}</p>
        </div>

        <div className="px-5 py-4">
          <div className="text-[12px] uppercase tracking-widest text-gray-500 font-semibold mb-2">
            What&apos;s included
          </div>
          <ul className="space-y-2 text-[14px] text-gray-700">
            <li>• Round-trip transport from Manila</li>
            <li>• All gear and equipment</li>
            <li>• Insurance & guide</li>
            <li>• Light refreshments</li>
          </ul>
        </div>
      </div>

      <div className="flex-shrink-0 border-t hairline bg-white px-5 py-3 flex items-center justify-between">
        <div>
          <div className="text-[18px] font-bold tracking-tight">
            ₱{exp.pricePerPerson.toLocaleString()}
            <span className="text-[13px] text-gray-500 font-normal"> {exp.unit}</span>
          </div>
          <div className="text-[11px] text-gray-500">Sat, May 17</div>
        </div>
        <button onClick={book} className="bg-black text-white rounded-full px-6 py-3 font-semibold text-[14px]">
          Reserve
        </button>
      </div>
    </div>
  );
}
