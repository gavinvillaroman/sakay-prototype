"use client";
import { useEffect } from "react";
import { useSubscription } from "@/lib/subscription";

export default function ThemeApplier() {
  const { isBlackMember, hydrated, hydrate } = useSubscription();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("theme-black", isBlackMember);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isBlackMember ? "#000000" : "#00b14f");
  }, [isBlackMember, hydrated]);

  return null;
}
