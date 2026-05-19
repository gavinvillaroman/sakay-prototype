# Deploy Sakay to Vercel

## 1. Push to GitHub
The branch `claude/add-theme-colors-EuLZx` already has everything you need.
Merge it to `main` (or deploy from the branch directly).

## 2. Import on Vercel
1. Go to https://vercel.com/new.
2. Pick the `gavinvillaroman/sakay-prototype` repo.
3. Framework preset: **Next.js** (detected automatically).
4. Build command: `npm run build` (default).
5. Output directory: leave blank (Next.js default).

## 3. Set environment variables
In the Vercel project settings → **Environment Variables**, add:

| Name                 | Value                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------- |
| `AIRTABLE_API_KEY`   | Personal Access Token from https://airtable.com/create/tokens (scope: `data.records:read` on the Sakay Prototype base). |
| `AIRTABLE_BASE_ID`   | `appxxnxrfm14M9ZmV`                                                                    |

Supabase vars are optional — leave blank to run in mock-auth mode.

## 4. Deploy
Click **Deploy**. Vercel will:
1. Run `npm install`.
2. Run `prebuild` (`node scripts/sync-airtable.mjs`) — pulls the latest cars
   from Airtable into `lib/data/cars.generated.ts`.
3. Run `next build`.
4. Publish the PWA at `https://<your-project>.vercel.app`.

## 5. Updating the catalog
Edit cars/hosts in Airtable. Then either:

- **Locally**: `npm run sync && git commit && git push` → Vercel auto-deploys.
- **Hands-off**: trigger a redeploy in Vercel (Deployments → Redeploy). The
  `prebuild` step refetches from Airtable on every build.

## PWA notes
- The manifest, icons, and service worker are already configured.
- iOS Safari: tap **Share → Add to Home Screen** to install.
- Android Chrome: an install prompt appears automatically.
