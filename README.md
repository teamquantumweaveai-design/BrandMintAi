# BrandMint AI Website

Official source for https://brandmintai.io/.

## Architecture

- React 19, TypeScript, React Router and Vite 5 for the primary website.
- Standalone static landing pages and PHP APIs under `public/`.
- Supabase for website lead storage and newsletter records.
- Hostinger serves built assets and PHP endpoints.
- `ai-workforce/index.html` is an independent Vite entry point.

This project is **not Next.js**. Avoid Next.js-only APIs and conventions.

## Setup

Use Node.js 20 and npm.

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
```

Output: `dist/`. The prebuild step generates a voice knowledge index.

For browser Supabase configuration, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in an untracked `.env.local`. `VITE_` values are public in the bundled JavaScript. **Never put privileged Supabase service-role keys, API secrets or payment secrets in client environment variables.** PHP secrets require private server-side configuration.

The Vite dev server does not run PHP. Test voice, checkout, subscriptions and form backend workflows using a PHP-enabled staging environment.

## Repository guide

- `src/App.tsx` — React Router route definitions
- `src/pages/` — React website pages
- `src/components/SEOManager.tsx` — client-side route SEO tags
- `public/` — static pages, sitemap, robots, Apache configuration and PHP APIs
- `public/api/` — server-side integrations
- `supabase/migrations/` — database schema changes
- `docs/` — service-specific implementation documentation
- `.github/workflows/deploy.yml` — build and publish compiled output to the `deploy` branch

Pushing to `main` triggers an automatic deployment build. Work in a branch and review the pull request before merging. The deployment workflow currently uses `clean: false`, which can retain old files on the deploy branch; review production dependencies before changing this behavior.

## Security notes

- `/admin/leads` is a **client-side route**, not an authorization boundary. A proper admin experience needs enforced authentication, authorization and **server-side/database access rules**.
- Verify live Supabase row-level security and grants before making policy changes. The repository's initial leads migration does not show RLS configuration.
- Do not commit credentials, customer records or operational secrets.
- The existing browser-side lead submission is not a substitute for server-side abuse protection.
- Keep checkout, voice, scheduling and CRM behavior unchanged unless their integrations are tested in staging.

## Quality checklist

1. Run `npm ci && npm run build`.
2. Test desktop and mobile navigation.
3. Check `/about`, `/solutions`, `/whatsapp-automation-bangalore`, `/ai-agents-bangalore` and standalone `/meta-growth/`.
4. Check canonical tags, social previews, `/robots.txt` and `/sitemap.xml`.
5. Test forms, cookies and integrations on staging.
6. Check GitHub Actions before merging to `main`.

## SEO distinction

React's `SEOManager` changes metadata in the browser **after JavaScript loads**. For reliable crawler and social-preview behavior on individual React routes, use server rendering, prerendering or route-specific static HTML in a future SEO enhancement. Standalone HTML pages already control their own head metadata.
