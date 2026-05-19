"use client";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;
  startTime?: string; // e.g. "10:00 AM"
  endTime?: string;
  minDate?: string;
  monthsToShow?: number;
  onClose: () => void;
  onSave: (start: string, end: string, startTime?: string, endTime?: string) => void;
  priceLabel?: string;
};

const TIME_OPTIONS = [
  "8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM",
  "2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM",
  "5:00 PM","5:30 PM","6:00 PM","7:00 PM","8:00 PM",
];

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
  const leading = first.getDay();
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
  startTime = "10:00 AM",
  endTime = "10:00 AM",
  minDate,
  monthsToShow = 6,
  onClose,
  onSave,
  priceLabel,
}: Props) {
  const [tmpStart, setTmpStart] = useState(startDate);
  const [tmpEnd, setTmpEnd] = useState(endDate);
  const [tmpStartTime, setTmpStartTime] = useState(startTime);
  const [tmpEndTime, setTmpEndTime] = useState(endTime);
  const [pickingEnd, setPickingEnd] = useState(true);

  // Mount/unmount with animation: keep DOM around for exit transition
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Next frame so the initial translateY(100%) paints before transitioning
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    } else if (mounted) {
      setShown(false);
      const t = setTimeout(() => setMounted(false), 380);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (open) {
      setTmpStart(startDate);
      setTmpEnd(endDate);
      setTmpStartTime(startTime);
      setTmpEndTime(endTime);
      setPickingEnd(true);
    }
  }, [open, startDate, endDate, startTime, endTime]);

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
    if (!tmpStart || !pickingEnd) {
      setTmpStart(iso);
      setTmpEnd("");
      setPickingEnd(true);
      return;
    }
    if (iso <= tmpStart) {
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
      onSave(tmpStart, tmpEnd, tmpStartTime, tmpEndTime);
      onClose();
    } else if (tmpStart && !tmpEnd) {
      onSave(tmpStart, addDays(tmpStart, 1), tmpStartTime, tmpEndTime);
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
      ? `${fmtShort(tmpStart)}, ${tmpStartTime} — ${fmtShort(tmpEnd)}, ${tmpEndTime}`
      : `${fmtShort(tmpStart)} — ?`
    : "Choose your pickup and return";

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black transition-opacity duration-300 ease-out"
        style={{ opacity: shown ? 0.45 : 0 }}
      />

      {/* Sheet */}
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
        {/* Drag handle */}
        <div className="flex-shrink-0 flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-full bg-foreground/15" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 px-5 pb-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              aria-label="Close"
              className="tap w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center hover:bg-surface-soft"
            >
              <X size={20} />
            </button>
            <button
              onClick={clear}
              className="tap text-[13.5px] font-semibold underline underline-offset-4"
            >
              Clear dates
            </button>
          </div>
          <div className="mt-3">
            <div className="text-[24px] font-bold tracking-tightest leading-tight">{title}</div>
            <div className="text-[13.5px] text-foreground/60 mt-0.5">{subtitle}</div>
          </div>
        </div>

        {/* Day-of-week header */}
        <div className="flex-shrink-0 px-5 pb-2 grid grid-cols-7 text-[11px] text-foreground/40 font-semibold tracking-widest text-center">
          {DAY_LABELS.map((d, i) => <div key={i} className="py-1">{d}</div>)}
        </div>
        <div className="flex-shrink-0 mx-5 border-b hairline" />

        {/* Scrollable months */}
        <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-5 pb-32">
          {months.map(({ year, month, cells }, mi) => (
            <div
              key={`${year}-${month}`}
              className="pt-6 float-in"
              style={{ animationDelay: `${Math.min(mi * 40, 160)}ms` }}
            >
              <h3 className="text-[17px] font-bold tracking-tight mb-2">{MONTH_LABELS[month]} {year}</h3>
              <div className="grid grid-cols-7">
                {cells.map((c, i) => {
                  if (!c.iso) return <div key={i} className="h-12" />;
                  const disabled = c.iso < effectiveMin;
                  const isStart = tmpStart && sameDay(c.iso, tmpStart);
                  const isEnd = tmpEnd && sameDay(c.iso, tmpEnd);
                  const inRange = tmpStart && tmpEnd && c.iso > tmpStart && c.iso < tmpEnd;

                  // Range pill: fills the cell horizontally; rounded only at endpoints
                  const rangeBg = (isStart || isEnd || inRange) && tmpEnd ? "bg-surface-soft" : "";
                  const rangeRound =
                    isStart && tmpEnd ? "rounded-l-full" :
                    isEnd ? "rounded-r-full" :
                    "";

                  return (
                    <div key={i} className={`h-12 flex items-center justify-center ${rangeBg} ${rangeRound}`}>
                      <button
                        onClick={() => !disabled && onTap(c.iso!)}
                        disabled={disabled}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-[14.5px] font-semibold tracking-tight transition-transform duration-100
                          ${disabled
                            ? "text-foreground/25 line-through"
                            : isStart || isEnd
                              ? "bg-foreground text-background active:scale-95"
                              : "text-foreground active:bg-foreground/5 active:scale-95"
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

        {/* Time selectors — pickup + return */}
        <div className="flex-shrink-0 border-t hairline bg-background px-5 pt-3 pb-2 space-y-2.5">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-foreground/60 font-bold mb-1.5">Pickup</div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x-mandatory">
              {TIME_OPTIONS.map((t) => {
                const active = t === tmpStartTime;
                return (
                  <button
                    key={t}
                    onClick={() => setTmpStartTime(t)}
                    className={`tap flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight border whitespace-nowrap ${
                      active ? "bg-foreground text-background border-foreground" : "hairline bg-surface text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-foreground/60 font-bold mb-1.5">Return</div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x-mandatory">
              {TIME_OPTIONS.map((t) => {
                const active = t === tmpEndTime;
                return (
                  <button
                    key={t}
                    onClick={() => setTmpEndTime(t)}
                    className={`tap flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight border whitespace-nowrap ${
                      active ? "bg-foreground text-background border-foreground" : "hairline bg-surface text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky bottom bar */}
        <div
          className="flex-shrink-0 border-t hairline bg-background px-5 py-3 flex items-center justify-between gap-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <div className="min-w-0">
            {priceLabel && (
              <div className="text-[14.5px] font-bold tracking-tight underline underline-offset-2 truncate">
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
            className="tap bg-accent text-accent-fg rounded-full px-8 py-3.5 font-bold text-[14.5px] disabled:opacity-40 flex-shrink-0"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
