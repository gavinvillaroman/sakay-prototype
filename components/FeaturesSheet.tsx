"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type FeatureGroup = {
  title: string;
  items: string[];
};

export default function FeaturesSheet({
  open,
  onClose,
  groups,
  count,
}: {
  open: boolean;
  onClose: () => void;
  groups: FeatureGroup[];
  count: number;
}) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    } else if (mounted) {
      setShown(false);
      const t = setTimeout(() => setMounted(false), 380);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mounted) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black transition-opacity duration-300 ease-out"
        style={{ opacity: shown ? 0.45 : 0 }}
      />
      <div
        className="absolute inset-x-0 bottom-0 bg-background rounded-t-3xl flex flex-col shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]"
        style={{
          height: "92dvh",
          maxHeight: "92dvh",
          transform: shown ? "translateY(0)" : "translateY(100%)",
          transition: "transform 380ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
      >
        <div className="flex-shrink-0 flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-full bg-foreground/15" />
        </div>
        <div className="flex-shrink-0 px-5 pb-2 flex items-center justify-between">
          <button
            onClick={onClose}
            aria-label="Close"
            className="tap w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center hover:bg-surface-soft"
          >
            <X size={20} />
          </button>
          <div className="text-[15px] font-bold tracking-tight">{count} features</div>
          <span className="w-9" />
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-5 pt-2 pb-8">
          <h2 className="text-[22px] font-bold tracking-tight mb-4">Vehicle features</h2>
          <div className="space-y-7">
            {groups.map((g, gi) => (
              <div key={g.title} className="float-in" style={{ animationDelay: `${gi * 60}ms` }}>
                <div className="text-[15px] font-bold tracking-tight mb-2">{g.title}</div>
                <ul className="divide-y divide-hairline">
                  {g.items.map((it) => (
                    <li key={it} className="py-2.5 text-[14.5px]">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
