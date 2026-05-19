"use client";
import { Home, Search, Sparkles, Receipt, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { flags } from "@/lib/flags";

const allTabs = [
  { id: "home", href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { id: "browse", href: "/browse", label: "Browse", icon: Search, match: (p: string) => p.startsWith("/browse") || p.startsWith("/car") },
  { id: "experiences", href: "/experiences", label: "Experiences", icon: Sparkles, match: (p: string) => p.startsWith("/experiences") || p.startsWith("/experience") },
  { id: "activity", href: "/activity", label: "Activity", icon: Receipt, match: (p: string) => p.startsWith("/activity") },
  { id: "profile", href: "/profile", label: "Profile", icon: User, match: (p: string) => p.startsWith("/profile") || p.startsWith("/host") },
];

export default function BottomNav() {
  const pathname = usePathname();
  const tabs = allTabs.filter((t) => t.id !== "experiences" || flags.experiences);

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t hairline pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-stretch pt-1.5">
        {tabs.map((t) => {
          const active = t.match(pathname);
          const Icon = t.icon;
          return (
            <Link
              key={t.id}
              href={t.href}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 flex-1"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.4 : 1.6}
                className={active ? "text-black" : "text-gray-400"}
              />
              <span
                className={`text-[10px] font-medium tracking-tight ${
                  active ? "text-black" : "text-gray-400"
                }`}
              >
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
