# AI Workforce landing page

Served at `https://brandmintai.io/ai-workforce/`, linked from **Solutions → AI Workforce**.
Ported from the ChatGPT Sites project `brandmint-ai-workforce` (Vinext + Cloudflare Worker + D1), which cannot run on Hostinger.

| Path | What it is |
|---|---|
| `ai-workforce/index.html` | Page entry: title, SEO, GA4 |
| `src/ai-workforce/App.tsx` | The page and the 4-step enquiry form |
| `src/ai-workforce/workforce.css` | Its own CSS, loaded only on this page |
| `public/ai-workforce/privacy/index.html` | Enquiry privacy notice |
| `public/api/workforce-enquiry.php` | Validates and stores enquiries, emails the team |

## How it fits the main site

- It is a second Vite entry (`vite.config.ts`), not a React Router route, so its global CSS cannot affect the main site.
- The menu item needs `isExternal: true` in `src/lib/constants.ts` so it does a real page load. Without it, React Router shows a blank page.
- `npm run build` runs `tsc` first and also type-checks this page. The deploy fails if it does not pass.

## Enquiries

The original used a Cloudflare D1 database and a ChatGPT-login admin page. Here:

- Each enquiry is appended to `workforce-enquiries.jsonl` in the folder that contains `public_html`
  (the same folder as `razorpay-config.php`). It cannot be opened from the web. Read it in Hostinger File Manager.
- A copy is emailed to `connect@brandmintai.io` (`NOTIFY_EMAIL` in the PHP file) using PHP `mail()`.
- The visitor sees success if at least one of the two worked. If both fail, they see an error and keep their answers.
- Failures go to the PHP error log.

The endpoint accepts only same-site `POST` JSON up to 16 KB, re-checks every field on the server, requires consent,
and silently discards submissions that fill the hidden bot field.

There is no admin page. If enquiries become frequent, add one behind the main site's authentication.

## Before relying on it

- Send one real test enquiry after deploying and confirm both the file and the email arrive.
- The booking link still uses the Vision Impact Calendly account name (`calendly.com/visionimpacttechnologies/new-meeting`).
