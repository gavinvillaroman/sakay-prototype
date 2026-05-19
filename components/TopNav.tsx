"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/browse", label: "Browse", match: (p: string) => p.startsWith("/browse") || p.startsWith("/car") },
  { href: "/experiences", label: "Experiences", match: (p: string) => p.startsWith("/experiences") || p.startsWith("/experience") },
  { href: "/activity", label: "Activity", match: (p: string) => p.startsWith("/activity") },
  { href: "/black", label: "Sakay Black", match: (p: string) => p.startsWith("/black") },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <header className="hidden md:block sticky top-0 z-30 bg-white/90 backdrop-blur border-b hairline">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[20px] font-bold tracking-tightest">Sakay</span>
        </Link>

        <nav className="flex items-center gap-1">
          {tabs.map((t) => {
            const active = t.match(pathname);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition ${
                  active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
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
            className="flex items-center gap-2 px-4 py-2 rounded-full border hairline text-[13px] text-gray-600 hover:shadow-sm"
          >
            <Search size={14} />
            <span>Search</span>
          </Link>
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
