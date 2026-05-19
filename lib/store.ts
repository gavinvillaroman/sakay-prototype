"use client";
import { create } from "zustand";
import type { Car, Experience, Category } from "./mock";

type State = {
  filter: Category;
  setFilter: (c: Category) => void;
  cart: { car?: Car; experience?: Experience; addons: string[]; days: number; guests: number } | null;
  startBooking: (item: { car?: Car; experience?: Experience }) => void;
  toggleAddon: (id: string) => void;
  clearCart: () => void;
};

export const useApp = create<State>((set, get) => ({
  filter: "all",
  setFilter: (c) => set({ filter: c }),
  cart: null,
  startBooking: (item) =>
    set({
      cart: {
        car: item.car,
        experience: item.experience,
        addons: [],
        days: 1,
        guests: 2,
      },
    }),
  toggleAddon: (id) => {
    const c = get().cart;
    if (!c) return;
    const has = c.addons.includes(id);
    set({ cart: { ...c, addons: has ? c.addons.filter((x) => x !== id) : [...c.addons, id] } });
  },
  clearCart: () => set({ cart: null }),
}));
