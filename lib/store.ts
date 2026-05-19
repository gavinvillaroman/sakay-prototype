"use client";
import { create } from "zustand";
import type { Car, Experience, Category } from "./mock";

const todayISO = () => new Date().toISOString().slice(0, 10);
const plusDays = (iso: string, days: number) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const diffDays = (a: string, b: string) => {
  const ms = new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
};

type Cart = {
  car?: Car;
  experience?: Experience;
  addons: string[];
  days: number;
  guests: number;
  startDate: string;
  endDate: string;
};

type State = {
  filter: Category;
  setFilter: (c: Category) => void;
  cart: Cart | null;
  startBooking: (item: { car?: Car; experience?: Experience; startDate?: string; endDate?: string }) => void;
  toggleAddon: (id: string) => void;
  setDates: (startDate: string, endDate: string) => void;
  clearCart: () => void;
};

export const useApp = create<State>((set, get) => ({
  filter: "all",
  setFilter: (c) => set({ filter: c }),
  cart: null,
  startBooking: (item) => {
    const startDate = item.startDate ?? plusDays(todayISO(), 1);
    const endDate = item.endDate ?? plusDays(startDate, 3);
    set({
      cart: {
        car: item.car,
        experience: item.experience,
        addons: [],
        days: diffDays(startDate, endDate),
        guests: 2,
        startDate,
        endDate,
      },
    });
  },
  toggleAddon: (id) => {
    const c = get().cart;
    if (!c) return;
    const has = c.addons.includes(id);
    set({ cart: { ...c, addons: has ? c.addons.filter((x) => x !== id) : [...c.addons, id] } });
  },
  setDates: (startDate, endDate) => {
    const c = get().cart;
    if (!c) return;
    set({ cart: { ...c, startDate, endDate, days: diffDays(startDate, endDate) } });
  },
  clearCart: () => set({ cart: null }),
}));
