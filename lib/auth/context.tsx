"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient, hasSupabase } from "@/lib/supabase/client";

const MOCK_KEY = "sakay-mock-user";

type MockUser = { email: string; fullName: string };

type AuthUser = User | (MockUser & { id: string; isMock: true }) | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readMockUser(): AuthUser {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockUser;
    return { ...parsed, id: `mock:${parsed.email}`, isMock: true as const };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!hasSupabase()) {
      setUser(readMockUser());
      setLoading(false);
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setLoading(false);
      return;
    }

    client.auth
      .getUser()
      .then(({ data }) => {
        if (mounted) {
          setUser(data.user ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) return { error: "Email required" };

    if (!hasSupabase()) {
      const mock: MockUser = { email: trimmed, fullName: "Guest" };
      window.localStorage.setItem(MOCK_KEY, JSON.stringify(mock));
      setUser({ ...mock, id: `mock:${trimmed}`, isMock: true });
      return { error: null };
    }

    const client = getSupabaseClient();
    if (!client) return { error: "Auth unavailable" };

    const { error } = await client.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    if (!hasSupabase()) {
      window.localStorage.removeItem(MOCK_KEY);
      setUser(null);
      return;
    }
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signInWithEmail, signOut }),
    [user, loading, signInWithEmail, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
