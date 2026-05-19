import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sakay — Car-sharing for the Philippines",
    short_name: "Sakay",
    description:
      "Rent a car, motorbike, or van — with or without a driver. Browse listings, book, pay, drive.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#000000",
    lang: "en",
    categories: ["travel", "transportation", "lifestyle"],
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon2", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon3", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
