# BrandMint AI contributor instructions

This repository uses **React + TypeScript + Vite + React Router**, not Next.js.

- Use Node.js 20, `npm ci`, and `npm run build` before proposing deployment.
- Main React routes are in `src/App.tsx`. Update `src/components/SEOManager.tsx` and `public/sitemap.xml` when adding indexable routes.
- `public/` contains standalone HTML pages, PHP endpoints, Apache rules and static assets. Vite cannot execute its PHP endpoints.
- Keep browser `VITE_` settings public-only; never commit privileged credentials or customer data.
- Preserve voice, calendar, payment, customer forms and email integrations unless they can be tested end to end on staging.
- The `/admin/leads` route is not secured merely because it is called admin. Confirm server-side authorization and Supabase RLS before handling live customer data.
- Work on a feature branch and open a PR. Changes merged to `main` trigger the deployment workflow.
