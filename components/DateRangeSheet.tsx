"use client";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;
  minDate?: string;
  monthsToShow?: number;
  onClose: () => void;
  onSave: (start: string, end: string) => void;
  priceLabel?: string; // e.g. "₱5,500 / day"
};

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const fromISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const sameDay = (a: string, b: string) => a === b;
const daysBetween = (a: string, b: string) => {
  const ms = fromISO(b).getTime() - fromISO(a).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
};
const addDays = (iso: string, n: number) => {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const fmtShort = (iso: string) => {
  const d = fromISO(iso);
  const wd = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  return `${wd}, ${mo} ${d.getDate()}`;
};

type DayCell = { iso?: string; day: number | null };

function monthGrid(year: number, month: number): DayCell[] {
  const first = new Date(year, month, 1);
  const leading = first.getDay(); // 0..6 (Sun..Sat)
  const daysIn = new Date(year, month + 1, 0).getDate();
  const cells: DayCell[] = [];
  for (let i = 0; i < leading; i++) cells.push({ day: null });
  for (let d = 1; d <= daysIn; d++) {
    cells.push({ day: d, iso: toISO(new Date(year, month, d)) });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null });
  return cells;
}

export default function DateRangeSheet({
  open,
  startDate,
  endDate,
  minDate,
  monthsToShow = 6,
  onClose,
  onSave,
  priceLabel,
}: Props) {
  const [tmpStart, setTmpStart] = useState(startDate);
  const [tmpEnd, setTmpEnd] = useState(endDate);
  // Track whether the next tap should set start (fresh selection) or end.
  const [pickingEnd, setPickingEnd] = useState(true);

  // Reset internal state when opening
  useEffect(() => {
    if (open) {
      setTmpStart(startDate);
      setTmpEnd(endDate);
      setPickingEnd(true);
    }
  }, [open, startDate, endDate]);

  // Lock body scroll while open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const today = useMemo(() => toISO(new Date()), []);
  const effectiveMin = minDate ?? today;

  const months = useMemo(() => {
    const out: { year: number; month: number; cells: DayCell[] }[] = [];
    const base = fromISO(effectiveMin);
    base.setDate(1);
    for (let i = 0; i < monthsToShow; i++) {
      const y = base.getFullYear();
      const m = base.getMonth() + i;
      const ny = y + Math.floor(m / 12);
      const nm = ((m % 12) + 12) % 12;
      out.push({ year: ny, month: nm, cells: monthGrid(ny, nm) });
    }
    return out;
  }, [effectiveMin, monthsToShow]);

  const onTap = (iso: string) => {
    if (iso < effectiveMin) return;

    // Fresh selection (no start) — set start
    if (!tmpStart || !pickingEnd) {
      setTmpStart(iso);
      setTmpEnd("");
      setPickingEnd(true);
      return;
    }
    // Picking end now
    if (iso <= tmpStart) {
      // Tapping earlier or same → restart range from that day
      setTmpStart(iso);
      setTmpEnd("");
      setPickingEnd(true);
      return;
    }
    setTmpEnd(iso);
    setPickingEnd(false);
  };

  const clear = () => {
    setTmpStart("");
    setTmpEnd("");
    setPickingEnd(true);
  };

  const save = () => {
    if (tmpStart && tmpEnd) {
      onSave(tmpStart, tmpEnd);
      onClose();
    } else if (tmpStart && !tmpEnd) {
      // Default to single-day if user only tapped one date
      onSave(tmpStart, addDays(tmpStart, 1));
      onClose();
    }
  };

  const nights = tmpStart && tmpEnd ? daysBetween(tmpStart, tmpEnd) : 0;
  const title = nights > 0
    ? `${nights} ${nights === 1 ? "day" : "days"}`
    : tmpStart
      ? "Select return date"
      : "Select dates";
  const subtitle = tmpStart
    ? tmpEnd
      ? `${fmtShort(tmpStart)} – ${fmtShort(tmpEnd)}`
      : `${fmtShort(tmpStart)} – ?`
    : "Choose your pickup and return";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pb-3 border-b hairline"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            aria-label="Close"
            className="tap w-10 h-10 -ml-2 flex items-center justify-center"
          >
            <X size={22} />
          </button>
          <button
            onClick={clear}
            className="tap text-[14px] font-semibold underline underline-offset-4"
          >
            Clear dates
          </button>
        </div>
        <div className="mt-4">
          <div className="text-[24px] font-bold tracking-tightest leading-tight">{title}</div>
          <div className="text-[14px] text-foreground/60 mt-0.5">{subtitle}</div>
        </div>
      </div>

      {/* Day-of-week header */}
      <div className="flex-shrink-0 px-5 pt-3 pb-2 grid grid-cols-7 text-[11px] text-foreground/40 font-semibold tracking-widest text-center">
        {DAY_LABELS.map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="flex-shrink-0 border-b hairline" />

      {/* Scrollable months */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32">
        {months.map(({ year, month, cells }) => (
          <div key={`${year}-${month}`} className="pt-6">
            <h3 className="text-[18px] font-bold tracking-tight mb-3">{MONTH_LABELS[month]} {year}</h3>
            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((c, i) => {
                if (!c.iso) return <div key={i} className="h-12" />;
                const disabled = c.iso < effectiveMin;
                const isStart = tmpStart && sameDay(c.iso, tmpStart);
                const isEnd = tmpEnd && sameDay(c.iso, tmpEnd);
                const inRange = tmpStart && tmpEnd && c.iso > tmpStart && c.iso < tmpEnd;
                // Range pill rounding: start = rounded-l, end = rounded-r
                const rangeBg = (isStart || isEnd || inRange) && tmpEnd
                  ? "bg-surface-soft"
                  : "";
                const rangeRound =
                  isStart && tmpEnd ? "rounded-l-full" :
                  isEnd ? "rounded-r-full" :
                  "";

                return (
                  <div key={i} className={`h-12 flex items-center justify-center ${rangeBg} ${rangeRound}`}>
                    <button
                      onClick={() => !disabled && onTap(c.iso!)}
                      disabled={disabled}
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-semibold tracking-tight transition
                        ${disabled
                          ? "text-foreground/25 line-through"
                          : isStart || isEnd
                            ? "bg-foreground text-background"
                            : "text-foreground active:bg-surface-soft"
                        }`}
                    >
                      {c.day}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom bar */}
      <div
        className="flex-shrink-0 border-t hairline bg-background px-5 py-3 flex items-center justify-between gap-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      >
        <div className="min-w-0">
          {priceLabel && (
            <div className="text-[15px] font-bold tracking-tight underline underline-offset-2 truncate">
              {priceLabel}
            </div>
          )}
          <div className="text-[12px] text-foreground/60 truncate">
            {nights > 0 ? `For ${nights} ${nights === 1 ? "day" : "days"}` : "Choose your dates"}
          </div>
        </div>
        <button
          onClick={save}
          disabled={!tmpStart}
          className="tap bg-foreground text-background rounded-full px-8 py-3.5 font-semibold text-[14.5px] disabled:opacity-40 flex-shrink-0"
        >
          Save
        </button>
      </div>
    </div>
  );
}
