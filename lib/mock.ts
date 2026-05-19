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

// Source of truth: Airtable base appxxnxrfm14M9ZmV → lib/data/cars.generated.ts.
// Edit cars in Airtable, run `npm run sync`, commit the regenerated file.
import { cars } from "./data/cars.generated";
export { cars };

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

export const activity: Activity[] = [
  {
    id: "a1",
    type: "experience",
    title: "Horseback with Drei Parker",
    subtitle: "Sat, May 17 · 4:00 PM",
    date: "Upcoming",
    status: "upcoming",
    amount: 1998,
    photo: u("photo-1553284965-83fd3e82fa5a", 200),
  },
  {
    id: "a5",
    type: "ride",
    title: "Ride to Shot Corner",
    subtitle: "Andrei Mercado · Toyota HiAce",
    date: "May 9 · 2:34 PM",
    status: "canceled",
    amount: 0,
    photo: u("photo-1502877338535-766e1452684a", 200),
  },
  {
    id: "a6",
    type: "ride",
    title: "Ride to NAIA T3",
    subtitle: "Marco Reyes · Mirage",
    date: "May 7 · 6:15 AM",
    status: "completed",
    amount: 420,
    photo: u("photo-1502877338535-766e1452684a", 200),
  },
  {
    id: "a2",
    type: "rental",
    title: "Mitsubishi Montero Sport",
    subtitle: "SHOTCORNER CORP. · 3 days",
    date: "May 4 – May 7",
    status: "completed",
    amount: 13500,
    photo: "/cars/mitsubishi-montero.webp",
  },
  {
    id: "a3",
    type: "rental",
    title: "Toyota HiAce GL Grandia",
    subtitle: "SHOTCORNER CORP. · 1 day",
    date: "Apr 18",
    status: "canceled",
    amount: 0,
    photo: "/cars/toyota-hiace.jpg",
  },
];

export const reviews: Review[] = [
  // Toyota HiAce (c1) — Shotcorner Corp
  { id: "r1", carId: "c1", reviewerName: "Patricia L.", reviewerPhoto: "https://i.pravatar.cc/150?img=20", rating: 5, date: "April 2026", text: "Shotcorner team was super organized — van was spotless on pickup and the AC was strong even with 10 of us. Used it for a Tagaytay trip, no issues at all." },
  { id: "r2", carId: "c1", reviewerName: "Miguel T.", reviewerPhoto: "https://i.pravatar.cc/150?img=11", rating: 5, date: "March 2026", text: "Booked the HiAce for an out-of-town funeral. Driver was professional and got us there safely. Salamat po Shotcorner." },
  { id: "r3", carId: "c1", reviewerName: "Reese M.", reviewerPhoto: "https://i.pravatar.cc/150?img=45", rating: 4, date: "March 2026", text: "Comfortable ride, USB ports were a nice touch. Slight delay on pickup but they communicated well." },
  { id: "r4", carId: "c1", reviewerName: "Joel C.", reviewerPhoto: "https://i.pravatar.cc/150?img=53", rating: 5, date: "February 2026", text: "Used multiple times for company outings. Reliable every time." },

  // Nissan NV350 (c2) — Shotcorner Corp
  { id: "r5", carId: "c2", reviewerName: "Anna G.", reviewerPhoto: "https://i.pravatar.cc/150?img=32", rating: 5, date: "April 2026", text: "Captain's chairs make this so much more comfortable than a regular Urvan. 15 of us fit no problem." },
  { id: "r6", carId: "c2", reviewerName: "Karlo D.", reviewerPhoto: "https://i.pravatar.cc/150?img=17", rating: 5, date: "March 2026", text: "Big group, long drive, zero complaints from anyone. Will book again." },
  { id: "r7", carId: "c2", reviewerName: "Mika S.", reviewerPhoto: "https://i.pravatar.cc/150?img=29", rating: 4, date: "January 2026", text: "Solid van. Interior was clean and recliners actually recline. Took one star for fuel — diesel is on you, fyi." },

  // Nissan Almera (c3)
  { id: "r8", carId: "c3", reviewerName: "Beatrice R.", reviewerPhoto: "https://i.pravatar.cc/150?img=41", rating: 5, date: "April 2026", text: "Perfect city car. Easy to park, sips fuel, and the Shotcorner team was super accommodating on pickup time." },
  { id: "r9", carId: "c3", reviewerName: "Marvin O.", reviewerPhoto: "https://i.pravatar.cc/150?img=52", rating: 5, date: "March 2026", text: "Daily driver for a week — felt brand new. No drama." },
  { id: "r10", carId: "c3", reviewerName: "Ysa P.", reviewerPhoto: "https://i.pravatar.cc/150?img=38", rating: 5, date: "February 2026", text: "First time using Sakay and Almera was a great intro. Push start is a nice touch for the price." },

  // Honda BR-V (c4)
  { id: "r11", carId: "c4", reviewerName: "Don N.", reviewerPhoto: "https://i.pravatar.cc/150?img=60", rating: 5, date: "April 2026", text: "7-seater that actually fits adults in row 3. Took it to Subic, ~22 km/L on the trip. Shotcorner is a great host." },
  { id: "r12", carId: "c4", reviewerName: "Sheila K.", reviewerPhoto: "https://i.pravatar.cc/150?img=49", rating: 5, date: "March 2026", text: "Family of 6, perfect size. Honda Sensing made the long drive way less stressful." },
  { id: "r13", carId: "c4", reviewerName: "Ryan A.", reviewerPhoto: "https://i.pravatar.cc/150?img=14", rating: 5, date: "February 2026", text: "Pickup in Cabanatuan was a breeze. Shotcorner even threw in a baby seat I asked for last minute." },

  // Mitsubishi Montero Sport (c5)
  { id: "r14", carId: "c5", reviewerName: "Chris F.", reviewerPhoto: "https://i.pravatar.cc/150?img=58", rating: 5, date: "April 2026", text: "Diesel torque is unreal. Took it to Baguio without breaking a sweat. Shotcorner knows their fleet well." },
  { id: "r15", carId: "c5", reviewerName: "Trisha L.", reviewerPhoto: "https://i.pravatar.cc/150?img=22", rating: 5, date: "March 2026", text: "Spacious, powerful, immaculate interior. Paddle shifters were a fun bonus on mountain roads." },
  { id: "r16", carId: "c5", reviewerName: "Bryan H.", reviewerPhoto: "https://i.pravatar.cc/150?img=68", rating: 5, date: "January 2026", text: "Used for a province wedding. Held our luggage + 6 adults comfortably. Shotcorner is responsive AF." },

  // Vespa Justin Bieber (c7)
  { id: "r17", carId: "c7", reviewerName: "Sam V.", reviewerPhoto: "https://i.pravatar.cc/150?img=42", rating: 5, date: "April 2026", text: "Insanely fun to ride around General Luna on this. Felt like a vacation movie. Shotcorner's Siargao crew is a legend." },
  { id: "r18", carId: "c7", reviewerName: "Hannah W.", reviewerPhoto: "https://i.pravatar.cc/150?img=46", rating: 5, date: "March 2026", text: "Vespa is in mint condition. Bieber stickers + Siargao = the most photogenic trip of my life." },
  { id: "r19", carId: "c7", reviewerName: "Jake R.", reviewerPhoto: "https://i.pravatar.cc/150?img=64", rating: 5, date: "March 2026", text: "Smooth, easy to ride even if you've only been on automatics. Bring sunblock — open ride." },
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
