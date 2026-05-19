import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Sakay — Car-sharing for the Philippines",
  description: "Rent a car, motorbike, or van — with or without a driver. Joined by curated experiences and Sakay Black membership.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 with-mobile-nav">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
