"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { hasSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseEnabled = hasSupabase();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signInWithEmail(email);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (!supabaseEnabled) {
      router.push("/");
      return;
    }
    setSent(true);
  }

  return (
    <div className="max-w-md mx-auto px-5 md:px-6 pt-10 md:pt-16 pb-16">
      <h1 className="text-[32px] md:text-[40px] font-bold tracking-tightest leading-[1.05] mb-2">
        Sign in to Sakay
      </h1>
      <p className="text-[14px] text-gray-600 mb-8 tracking-tight">
        We&apos;ll email you a magic link. No password needed.
      </p>

      {sent ? (
        <div className="rounded-2xl border hairline p-5">
          <div className="text-[15px] font-semibold tracking-tight mb-1">
            Check your email
          </div>
          <div className="text-[13px] text-gray-600">
            We sent a link to <span className="font-medium text-black">{email}</span>.
            Open it on this device to finish signing in.
          </div>
          <button
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="mt-4 text-[12px] underline text-gray-600"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
              Email
            </span>
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border hairline px-4 py-3 text-[15px] tracking-tight focus:outline-none focus:border-black"
            />
          </label>

          {error && (
            <div className="text-[12px] text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-black text-white font-semibold text-[15px] py-3 tracking-tight active:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Sending…" : supabaseEnabled ? "Send magic link" : "Continue"}
          </button>

          {!supabaseEnabled && (
            <div className="text-[11px] text-gray-500 text-center tracking-tight">
              Mock mode — no email will actually be sent.
            </div>
          )}
        </form>
      )}

      <div className="mt-8 text-[11px] text-gray-500 text-center tracking-tight leading-relaxed">
        By continuing you agree to our{" "}
        <Link href="/legal/terms" className="underline text-gray-700">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline text-gray-700">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
