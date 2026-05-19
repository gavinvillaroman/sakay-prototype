"use client";
import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { activity, cars } from "@/lib/mock";
import { useReviewStore } from "@/lib/reviewStore";
import { Star } from "lucide-react";

const PROMPTS = ["Awful", "Bad", "Okay", "Good", "Loved it"];

export default function WriteReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const addReview = useReviewStore((s) => s.addReview);

  const item = activity.find((a) => a.id === id);
  if (!item) notFound();

  // Try to match the activity to a car by title
  const car = cars.find(
    (c) => `${c.make} ${c.model}`.toLowerCase().includes(item.title.toLowerCase().split(" ")[0])
      || item.title.toLowerCase().includes(c.model.toLowerCase()),
  ) ?? cars[0];

  const [carRating, setCarRating] = useState(0);
  const [hostRating, setHostRating] = useState(0);
  const [text, setText] = useState("");

  const submit = () => {
    if (!carRating || !text.trim()) return;
    addReview({
      carId: car.id,
      rating: carRating,
      text: text.trim(),
    });
    router.push(`/car/${car.id}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <AppHeader title="Leave a review" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
        <div className="flex items-center gap-3 py-4 border-b hairline">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <Image src={item.photo} alt="" fill unoptimized className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold tracking-tight truncate">{item.title}</div>
            <div className="text-[12px] text-gray-500 truncate">{item.subtitle}</div>
            <div className="text-[11px] text-gray-500">{item.date}</div>
          </div>
        </div>

        <RatingRow
          label="How was the car?"
          rating={carRating}
          setRating={setCarRating}
        />
        <RatingRow
          label={`How was ${car.hostName} as a host?`}
          rating={hostRating}
          setRating={setHostRating}
        />

        <div className="pt-2">
          <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">
            Tell other riders what you think
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="The HiAce was spotless, AC was strong, and pickup was right on time…"
            className="w-full rounded-2xl border hairline p-3 text-[14px] outline-none resize-none focus:border-black"
          />
          <div className="text-[11px] text-gray-500 mt-1.5">
            {text.length}/600 · public review on the listing
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t hairline px-5 py-3 bg-white">
        <button
          onClick={submit}
          disabled={!carRating || !text.trim()}
          className="w-full bg-black text-white rounded-full py-3.5 font-semibold text-[14px] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Post review
        </button>
      </div>
    </div>
  );
}

function RatingRow({
  label,
  rating,
  setRating,
}: {
  label: string;
  rating: number;
  setRating: (n: number) => void;
}) {
  return (
    <div className="py-5 border-b hairline">
      <div className="text-[14px] font-semibold mb-3">{label}</div>
      <div className="flex justify-between items-center mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className="p-1 -mx-1"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              size={34}
              strokeWidth={1.5}
              className={n <= rating ? "fill-black text-black" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
      <div className="text-[12px] text-gray-500 text-center h-4">
        {rating > 0 ? PROMPTS[rating - 1] : "Tap to rate"}
      </div>
    </div>
  );
}
