"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppHeader({
  title,
  right,
}: {
  title?: string;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-5 h-12 bg-background relative z-20">
      <button onClick={() => router.back()} className="w-9 h-9 -ml-2 flex items-center justify-center">
        <ArrowLeft size={22} strokeWidth={2} />
      </button>
      {title && <span className="text-[15px] font-semibold tracking-tight">{title}</span>}
      <div className="w-9 h-9 flex items-center justify-center">{right}</div>
    </div>
  );
}
