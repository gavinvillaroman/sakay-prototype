export type Category = "all" | "sedan" | "suv" | "van" | "motorcycle" | "black";

export type DriverOption = "with-driver" | "self-drive" | "both";

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  category: Category;
  pricePerDay: number;
  rating: number;
  trips: number;
  location: string;
  hostName: string;
  hostPhoto: string;
  hostSuperhost: boolean;
  photo: string;
  features: string[];
  instantBook: boolean;
  driverOption: DriverOption;
  blackOnly?: boolean;
  regionTag?: string;
};

export type Experience = {
  id: string;
  title: string;
  host: string;
  hostPhoto: string;
  pricePerPerson: number;
  unit: string;
  rating: number;
  reviews: number;
  duration: string;
  location: string;
  photo: string;
  tags: string[];
  description: string;
};

export type Review = {
  id: string;
  carId: string;
  reviewerName: string;
  reviewerPhoto: string;
  rating: number;
  date: string;
  text: string;
};

export type Activity = {
  id: string;
  type: "rental" | "experience" | "ride";
  title: string;
  subtitle: string;
  date: string;
  status: "upcoming" | "active" | "completed" | "canceled";
  amount: number;
  photo: string;
};

import { Sparkles, Bike, Car, CarFront, Bus, type LucideIcon } from "lucide-react";

export const categories: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "motorcycle", label: "Motorbike", icon: Bike },
  { id: "sedan", label: "Sedan", icon: Car },
  { id: "suv", label: "SUV", icon: CarFront },
  { id: "van", label: "Van", icon: Bus },
];

// Unsplash source URLs (real photos, no API key needed)
const u = (q: string, w = 800) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=${w}&q=80`;

// Source of truth: Airtable base appxxnxrfm14M9ZmV → lib/data/*.generated.ts.
// Edit in Airtable, run `npm run sync`, commit the regenerated files.
import { cars as carsGenerated } from "./data/cars.generated";
import { reviews as reviewsGenerated } from "./data/reviews.generated";
import { activity as activityGenerated } from "./data/activity.generated";

export const cars = carsGenerated;
export const reviews = reviewsGenerated;
export const activity = activityGenerated;

export const experiences: Experience[] = [
  {
    id: "e1",
    title: "Horseback ride with Drei Parker",
    host: "Drei Parker",
    hostPhoto: "https://i.pravatar.cc/150?img=22",
    pricePerPerson: 999,
    unit: "/ hour",
    rating: 5.0,
    reviews: 38,
    duration: "1 hour",
    location: "Tagaytay Highlands",
    photo: u("photo-1553284965-83fd3e82fa5a"),
    tags: ["Outdoor", "Featured", "Beginner-friendly"],
    description:
      "Sunset ride along the Tagaytay ridge with Drei — pro equestrian, 15 years of teaching. Helmets, gear, and transport from BGC included.",
  },
];

export function getCarReviews(carId: string): Review[] {
  return reviews.filter((r) => r.carId === carId);
}

export function getHostReviews(hostName: string): Review[] {
  const carIds = cars.filter((c) => c.hostName === hostName).map((c) => c.id);
  return reviews.filter((r) => carIds.includes(r.carId));
}

export function avgRating(rs: Review[]): number {
  if (rs.length === 0) return 0;
  return rs.reduce((a, b) => a + b.rating, 0) / rs.length;
}

export type RideDriver = {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  photo: string;
};

export type RidePlace = { label: string; address: string; lat: number; lng: number };

export const CITY_CENTER = { lat: 14.5547, lng: 121.0244 }; // BGC

export const rideDrivers: RideDriver[] = [
  { id: "rd1", name: "Andrei Mercado", rating: 0.69, vehicle: "Toyota HiAce", plate: "ABC 1234", photo: "https://i.pravatar.cc/150?img=12" },
  { id: "rd2", name: "Marco Reyes", rating: 4.92, vehicle: "Mitsubishi Mirage", plate: "XYZ 5678", photo: "https://i.pravatar.cc/150?img=33" },
];

export const ridePlaces: RidePlace[] = [
  { label: "Home", address: "Forbeswood Heights, BGC", lat: 14.5497, lng: 121.0510 },
  { label: "Work", address: "One Ayala, Makati", lat: 14.5512, lng: 121.0247 },
  { label: "NAIA Terminal 3", address: "Pasay City", lat: 14.5126, lng: 121.0182 },
  { label: "Shot Corner", address: "Cabanatuan City, Nueva Ecija", lat: 15.4895, lng: 120.9712 },
];

export const user = {
  firstName: "Gavin",
  lastName: "Villaroman",
  email: "gavin@sakay.ph",
  phone: "+63 917 555 0123",
  photo: "",
  joined: "2024",
  rating: 4.97,
  trips: 12,
  isHost: true,
  isBlack: true,
};

export const hostStats = {
  monthlyEarnings: 184500,
  activeListings: 2,
  upcomingTrips: 5,
  responseRate: 100,
  earningsTrend: [12000, 18500, 22000, 16800, 28400, 31200, 35600, 42100, 38900, 45200, 51800, 48600],
};
