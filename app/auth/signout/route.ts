import { NextResponse } from "next/server";
import { createClient, hasSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);

  if (hasSupabase()) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }
  // Mock mode is cleared client-side via the auth context.

  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
