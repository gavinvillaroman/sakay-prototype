"use client";
import { create } from "zustand";
import { RideDriver, RidePlace, rideDrivers, ridePlaces } from "./mock";

export type RideStatus = "idle" | "searching" | "matched" | "canceled" | "ongoing";

type State = {
  status: RideStatus;
  pickup: RidePlace;
  dropoff: RidePlace | null;
  driver: RideDriver | null;
  fare: number;
  setDropoff: (p: RidePlace) => void;
  startSearch: () => void;
  matchDriver: () => void;
  cancelByDriver: () => void;
  reset: () => void;
};

export const useRide = create<State>((set) => ({
  status: "idle",
  pickup: ridePlaces[0],
  dropoff: null,
  driver: null,
  fare: 0,
  setDropoff: (p) => set({ dropoff: p, fare: Math.round(180 + Math.random() * 240) }),
  startSearch: () => set({ status: "searching", driver: null }),
  matchDriver: () => set({ status: "matched", driver: rideDrivers[0] }),
  cancelByDriver: () => set({ status: "canceled" }),
  reset: () => set({ status: "idle", driver: null, dropoff: null, fare: 0 }),
}));
