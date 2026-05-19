import { cars } from "./mock";

export function hostSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function hostByName(slug: string): { name: string } | null {
  const allNames = Array.from(new Set(cars.map((c) => c.hostName)));
  const match = allNames.find((n) => hostSlug(n) === slug);
  return match ? { name: match } : null;
}

export function hostCars(name: string) {
  return cars.filter((c) => c.hostName === name);
}
