import type { Metadata, Viewport } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Providers from "@/components/Providers";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "Sakay — Car-sharing for the Philippines",
  description:
    "Rent a car, motorbike, or van — with or without a driver. Browse listings, book, pay, drive.",
  applicationName: "Sakay",
  appleWebApp: {
    capable: true,
    title: "Sakay",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen flex flex-col">
        <Providers>
          <TopNav />
          <main className="flex-1 with-mobile-nav">{children}</main>
          <BottomNav />
          <InstallPrompt />
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
