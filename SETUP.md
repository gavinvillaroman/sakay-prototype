# Sakay MVP — Setup (when you wake up)

The app already ships as a working PWA on Vercel without a backend (mock mode). To turn it into a real MVP with real auth and bookings, follow these steps in order.

## TL;DR — what was done overnight

1. **PWA**: Manifest, service worker, install prompt, app icons (192/512/maskable + apple-touch). Installable from iOS Safari + Android Chrome.
2. **Slim scope**: Sakay Black + Experiences + ride-hailing gated behind `NEXT_PUBLIC_ENABLE_*` flags (off by default). MVP nav shows Home / Browse / Activity / Profile only.
3. **Supabase ready**: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/auth/context.tsx`, `/auth/login`, `/auth/callback`, `/auth/signout` all wired. **Falls back to mock-auth when env vars are unset** — so deploy works without a backend.
4. **Schema**: `supabase/migrations/0001_init.sql` — 7 tables (profiles, hosts, vehicles, vehicle_photos, bookings, reviews, sakay_black_members) + RLS + auth trigger + `vehicles_with_host` view. Not deployed yet.
5. **Bookings**: Checkout writes to `bookings` table when backend is wired, otherwise to localStorage. Activity page lists both.
6. **Legal**: `/legal/privacy`, `/legal/terms`, `/legal/help` with real Sakay-specific content (not Lorem Ipsum).
7. **GitHub**: Public repo at https://github.com/gavinvillaroman/sakay-prototype
8. **Vercel**: Deployed to https://sakay-prototype-v3.vercel.app

## Step 1 — Create the Supabase project (5 min)

⚠️ **Ask Claude which email to use first.** Don't auto-default to publishexperts.com (that's for PE/sub-client work only).

1. Go to https://supabase.com/dashboard → New project.
2. Name: `sakay`. Region: `Southeast Asia (Singapore)`. Generate a strong DB password and save it.
3. Wait ~2 min for the project to provision.

## Step 2 — Set Site URL + Redirect URLs **before any sign-in** (2 min)

⚠️ **Critical** — memory burn: Site URL defaults to `localhost:3000` on new projects. The first magic link goes there, dies silently, and burns the OTP. Set this FIRST.

In Supabase dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `https://sakay-prototype-v3.vercel.app`
- **Redirect URLs** (add all of these):
  - `https://sakay-prototype-v3.vercel.app/**`
  - `http://localhost:3001/**`
  - `http://localhost:3000/**`

Save.

## Step 3 — Run the schema migration (3 min)

In Supabase dashboard → **SQL Editor** → New query.

Paste the contents of `supabase/migrations/0001_init.sql` and Run.

⚠️ The file ends with `notify pgrst, 'reload schema';` — required after DDL or PostgREST keeps rejecting writes with "couldn't save" while direct SQL still works (memory burn).

Verify in **Table Editor**: you should see `profiles`, `hosts`, `vehicles`, `vehicle_photos`, `bookings`, `reviews`, `sakay_black_members`.

## Step 4 — Get the keys (1 min)

In Supabase dashboard → **Project Settings** → **API**:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY` *(do not expose to browser)*

## Step 5 — Add env vars to Vercel (3 min)

```bash
cd ~/Projects/sakay-prototype-v3
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
# paste URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# paste anon key
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
# paste service role
```

Repeat for `preview` and `development` if desired. Or just add via the Vercel dashboard.

Also create `.env.local` for your machine:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Step 6 — Redeploy (1 min)

```bash
cd ~/Projects/sakay-prototype-v3
npx vercel --prod
```

## Step 7 — Test the magic link

Open https://sakay-prototype-v3.vercel.app/auth/login in incognito, enter your email, click "Send magic link." Check inbox, click link. Should redirect to `/` signed in. Visit `/profile` to confirm.

If the magic link goes to `localhost:3000`, you skipped Step 2 — go back.

## Known gaps (Phase 2)

- **Payments**: Stripe / Xendit not wired. Checkout writes a booking row but doesn't charge. Add Stripe Checkout Session or Xendit InvoiceLink as the next milestone.
- **Real listings**: `lib/mock.ts` still seeds the browse page. Migrate to `select * from vehicles_with_host` once you onboard your first 5 hosts. Replace `useVehicles` (TODO) and remove mock fallback.
- **Booking-conflict prevention**: No DB-level overlap constraint. Add `EXCLUDE USING gist (vehicle_id WITH =, tstzrange(start_date, end_date, '[)') WITH &&)` before going live.
- **Account deletion**: `/profile` shows Sign out but not "Delete account." Required for App Store; not yet for PWA. Add a simple `supabase.rpc('delete_account')` later.
- **Real photography**: Cards still use `/cars/*.jpg`. Replace with host-uploaded photos once hosts are onboarded — `vehicle_photos` table exists for this.
- **Mapbox**: Map is mocked (Leaflet). Swap to Mapbox once volume justifies the $0.50/1k loads cost.
- **Expo native build**: Optional. PWA is installable from iOS 16.4+ home screen and supports push notifications. Real native build can come after App Store research above.

## Re-enabling Sakay Black / Experiences / Ride

Add to Vercel env (or `.env.local`):
```
NEXT_PUBLIC_ENABLE_BLACK=1
NEXT_PUBLIC_ENABLE_EXPERIENCES=1
NEXT_PUBLIC_ENABLE_RIDE=1
```

Redeploy. ⚠️ Strip the "VIP police escort" line from `/black` before enabling for real users — it's a known App Store rejection trigger and not a real product.

## File map of what changed

```
app/
  layout.tsx                          # wrapped in Providers + SW + InstallPrompt
  manifest.ts                         # PWA manifest
  icon.tsx, icon2.tsx, icon3.tsx      # 192, 512, 512-maskable
  apple-icon.tsx                      # iOS home-screen
  offline/page.tsx                    # offline fallback for SW
  auth/login/page.tsx                 # magic-link login
  auth/callback/route.ts              # Supabase code-exchange
  auth/signout/route.ts               # POST sign-out
  legal/privacy/page.tsx              # legal stubs
  legal/terms/page.tsx
  legal/help/page.tsx
  page.tsx                            # gated Black + Experiences + footer legal links
  profile/page.tsx                    # sign-in CTA + sign-out form
  booking/checkout/page.tsx           # writes via createBooking()
  activity/page.tsx                   # surfaces real bookings
  car/[id]/page.tsx                   # safe-area sticky CTA
components/
  Providers.tsx                       # client wrapper for AuthProvider
  ServiceWorkerRegistration.tsx       # registers /sw.js in production
  InstallPrompt.tsx                   # beforeinstallprompt CTA
  BottomNav.tsx, TopNav.tsx           # flag-gated tabs
lib/
  flags.ts                            # NEXT_PUBLIC_ENABLE_* feature flags
  supabase/client.ts, server.ts       # SSR + browser clients
  auth/context.tsx                    # useAuth() — real or mock
  data/bookings.ts                    # createBooking / listMyBookings
public/
  sw.js                               # offline shell + asset cache
supabase/
  migrations/0001_init.sql            # full schema + RLS
.env.example                          # template for env vars
```

## Quick commands

```bash
# Dev (running on http://localhost:3001 already; restart if needed)
npm run dev

# Build (verify before deploy)
npm run build

# Deploy production
npx vercel --prod

# Push to GitHub
git push origin main
```
