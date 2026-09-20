# Edufly

Free, structured DevOps learning roadmap and interview guide.

- Live site: https://edufly.dev (also aliased at https://tekops.vercel.app)
- 14 tracks, 95 topics, 22 hands-on projects, 62 interview questions with model answers, 12 technology comparisons, AI mock interviews, progress tracking with cloud sync, and a public leaderboard.

## Stack

- React 19 + TypeScript + Vite, Tailwind CSS
- React Router (path-based routing, all routes prerendered to static HTML at build time)
- Supabase (Google auth, progress cloud sync, leaderboard)
- One Vercel serverless function (`api/interview.ts`) for AI mock interviews and answer grading
- Hosted on Vercel

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase project values
npm run dev            # app on http://localhost:5173
```

To also run the AI interview API locally: `node scripts/dev-api.mjs` (serves `/api/interview` alongside Vite).

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | client | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | client | Supabase anon (public) key |
| `ANTHROPIC_API_KEY` | server (Vercel) | powers AI mock interviews; `api/interview.ts` also accepts `OPENAI_API_KEY`, and degrades to a scripted fallback with no key at all |

The app works without any of these: progress falls back to localStorage and the interview falls back to scripted mode.

## Project layout

```
api/interview.ts     serverless AI interview + grader (provider auto-detect)
src/data/            all content: tracks, topics, projects, questions, comparisons
src/pages/           one file per route
src/store/           progress (localStorage), auth + cloud sync (Supabase)
src/lib/             supabase client, AI client, per-page meta helper
scripts/routes-entry.ts   enumerates every route from the data files
scripts/postbuild.mjs     writes sitemap.xml and prerenders all routes to static HTML
```

## Build and deploy

```bash
npm run build      # tsc + vite build + sitemap + prerender (needs Playwright/Chromium)
npm run build:spa  # skip prerendering (CI environments without Chromium)
```

`npm run build` prerenders all 147 routes to `dist/<route>/index.html` using a local headless Chromium. The prerender is hermetic (external requests are blocked) and skips itself gracefully when Chromium is unavailable or `PRERENDER=0` is set, so the build never hard-fails on it.

Deploying on Vercel: because the remote build image has no Chromium, build locally and deploy prebuilt to keep the prerendered HTML:

```bash
npx vercel pull --yes --environment=production
npx vercel build --prod
npx vercel deploy --prebuilt --prod
```

`vercel.json` handles SPA fallback for any route that is not prerendered, and legacy `/#/...` links are redirected to real paths by an inline script in `index.html`.

## Supabase

Tables (all with RLS: public select, authenticated insert/update of own rows):

- `user_progress` — synced progress blob per user
- `interview_attempts` — AI interview scores
- `leaderboard_entries` — public leaderboard (name, topics done, XP, streak)

Auth: Google OAuth. The site redirect URL allow-list must include the production origin root (`https://edufly.dev/`).

## Content conventions

- No fabricated numbers or fake social proof; every stat shown comes from the data files.
- No emdashes in copy. Use real Unicode apostrophes and quotes in strings (`\u2019`, `\u201c`, `\u201d`); a bare `·` in JSX text goes inside `{'...'}`.
- Brand: gradient `linear-gradient(135deg, #10b981, #84cc16)`, solid accent `#10b981`.
- SEO: every page sets its own title, description and canonical via `usePageMeta`; `sitemap.xml` and `robots.txt` are generated at build.
