// Feature flags for the MVP. v1 ships the slim marketplace (browse → book → pay).
// Sakay Black and Experiences are coded but gated off by default.
// Enable per-environment with NEXT_PUBLIC_ENABLE_* in .env / Vercel project settings.

const on = (v: string | undefined) => v === "1" || v === "true";

export const flags = {
  black: on(process.env.NEXT_PUBLIC_ENABLE_BLACK),
  experiences: on(process.env.NEXT_PUBLIC_ENABLE_EXPERIENCES),
  ride: on(process.env.NEXT_PUBLIC_ENABLE_RIDE),
} as const;
