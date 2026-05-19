// Feature flags for the MVP. v1 ships the slim marketplace (browse → book → pay).
// Override per-environment with NEXT_PUBLIC_ENABLE_* / NEXT_PUBLIC_DISABLE_* in .env / Vercel.

const on = (v: string | undefined) => v === "1" || v === "true";
const off = (v: string | undefined) => v === "1" || v === "true";

export const flags = {
  black: !off(process.env.NEXT_PUBLIC_DISABLE_BLACK),
  experiences: on(process.env.NEXT_PUBLIC_ENABLE_EXPERIENCES),
  ride: on(process.env.NEXT_PUBLIC_ENABLE_RIDE),
} as const;
