"use client";
import { create } from "zustand";

const STORAGE_KEY = "sakay-black-member";

type SubscriptionState = {
  isBlackMember: boolean;
  hydrated: boolean;
  hydrate: () => void;
  activate: () => void;
  cancel: () => void;
};

export const useSubscription = create<SubscriptionState>((set) => ({
  isBlackMember: false,
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) === "1";
    set({ isBlackMember: stored, hydrated: true });
  },
  activate: () => {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, "1");
    set({ isBlackMember: true });
  },
  cancel: () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    set({ isBlackMember: false });
  },
}));
