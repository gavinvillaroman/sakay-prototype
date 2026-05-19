"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";
import { flags } from "@/lib/flags";

const allTabs = [
  { id: "home", href: "/", label: "Home", match: (p: string) => p === "/" },
  { id: "browse", href: "/browse", label: "Browse", match: (p: string) => p.startsWith("/browse") || p.startsWith("/car") },
  { id: "experiences", href: "/experiences", label: "Experiences", match: (p: string) => p.startsWith("/experiences") || p.startsWith("/experience") },
  { id: "activity", href: "/activity", label: "Activity", match: (p: string) => p.startsWith("/activity") },
  { id: "black", href: "/black", label: "Sakay Black", match: (p: string) => p.startsWith("/black") },
];

export default function TopNav() {
  const pathname = usePathname();
  const tabs = allTabs.filter(
    (t) =>
      (t.id !== "experiences" || flags.experiences) &&
      (t.id !== "black" || flags.black),
  );
  return (
    <header className="hidden md:block sticky top-0 z-30 bg-background/90 backdrop-blur border-b hairline">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[20px] font-bold tracking-tightest">Sakay</span>
        </Link>

        <nav className="flex items-center gap-1">
          {tabs.map((t) => {
            const active = t.match(pathname);
            return (
              <Link
                key={t.id}
                href={t.href}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition ${
                  active
                    ? "bg-accent text-accent-fg"
                    : "text-foreground/70 hover:bg-surface-soft"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/browse"
            className="flex items-center gap-2 px-4 py-2 rounded-full border hairline text-[13px] text-foreground/60 hover:shadow-sm"
          >
            <Search size={14} />
            <span>Search</span>
          </Link>
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-surface-soft hover:opacity-80 flex items-center justify-center"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
