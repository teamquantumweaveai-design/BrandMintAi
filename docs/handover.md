# Handover: BrandMint AI / Quantum Weave website (as of 3 Nov 2026)

Read this first when continuing the project in a new Claude account. No secrets are in this file.

## 1. What this project is

- **Main site:** https://brandmintai.io, owned by BrandMint AI Pvt. Ltd. (contact: ceo@brandmintai.io).
- **Repo:** https://github.com/teamquantumweaveai-design/BrandMintAi, cloned at `C:\QW-Social\brandmint`.
  It's a Vite + React 19 + TypeScript app, with static pages and PHP endpoints under `public/`.
  - Ignore `brandmint/AGENTS.md` ("This is NOT the Next.js you know"). This is a Vite app, not Next.js.
- **Hosting:** Hostinger. Merging to `main` runs `.github/workflows/deploy.yml`, which builds and pushes `dist/` to the
  `deploy` branch that Hostinger serves. A deploy takes about 40 seconds. **Merging to main means going live.**
- **The owner's working rule:** work on a branch, open a PR, show proof (screenshots, tests), and merge only when the owner says
  "make it live". Then check the live site.

### Pages built in Claude sessions

| Page | URL | Docs |
|---|---|---|
| Meta Growth System (Quantum Weave social media service, Razorpay checkout) | `/meta-growth/` | `brandmint/docs/meta-growth.md` |
| Post-payment thank-you + onboarding form | `/meta-growth/thank-you/` | `brandmint/docs/meta-growth-onboarding.md` |
| AI Workforce landing page + 4-step enquiry form | `/ai-workforce/` | `brandmint/docs/ai-workforce.md` |
| Internal sales and trial process | — | `brandmint/docs/meta-growth-playbook.md` |
| Voice agent knowledge | `public/api/voice/knowledge.json` | `brandmint/docs/voice-agent.md` |

## 2. The Meta Growth page has TWO copies (important)

- **Source copy:** `C:\QW-Social\index.html`. It's outside the repo, and its assets live in `C:\QW-Social\assets\`.
- **Repo copy:** `brandmint/public/meta-growth/index.html`. Its asset paths point to `/meta-growth/assets/`, and it has
  `og:url` and `canonical` tags added.

Edit the source copy, then sync it into the repo with this command, run from `C:\QW-Social\brandmint`:

```bash
sed -e 's|src="assets/|src="/meta-growth/assets/|g' -e 's|href="assets/|href="/meta-growth/assets/|g' -e 's|<meta property="og:type" content="website">|<meta property="og:type" content="website">\n<meta property="og:url" content="https://brandmintai.io/meta-growth/">\n<link rel="canonical" href="https://brandmintai.io/meta-growth/">|' ../index.html > public/meta-growth/index.html
```

Then run `npm run build`. Its prebuild step regenerates `public/api/voice/knowledge.json`; commit that file too.
Check `git diff --ignore-cr-at-eol` and confirm only your intended lines changed.

When plan details change, update all of these together:
- The plan cards
- "Full plan details"
- "What you get"
- The JSON-LD offers at the top of the page
- `CAL_PLANS` and `PLAN_NAMES` in the page script
- `thank-you/index.html` names
- `docs/meta-growth.md`
- Prices only: `public/api/razorpay/lib.php` → `SOCIAL_GROWTH_PLANS`. This is the only amount Razorpay charges.

## 3. Current Meta Growth offer (live since PR #10, 31 Oct 2026)

| Plan | Price (incl. 18% GST) | Card items |
|---|---|---|
| Try Us Free | ₹0, 7 days | 2 posts + 1 Reel, captions, profile review, 7-day plan, ads/WhatsApp advice |
| Stay Active (`starter`) | ₹3,999/month | 2 AI videos (30 seconds each) · 8 social media AI image posts · 1 Meta ad campaign setup, with content and strategy |
| Reach More Customers (`growth`) | ₹6,999/month | 4 AI videos (30 seconds each) · 12 social media AI image posts, with captions · 1 Meta ad campaign setup, with content and strategy, plus optimisation · Weekly reports |

- Both paid cards show the note "Ad budget paid separately to Meta." There are no rupee ranges.
- The owner removed these on purpose: the content calendar line, all "ad creatives" lines on the cards, and "Up to 2 campaigns".
- The posters the cards were matched to say "1 Minute Each". The owner overrode that to **30 seconds** for both plans.

## 4. Payments and onboarding flow

1. A "Choose …" button posts the plan id to `api/razorpay/create-order.php`, which charges the fixed price.
2. Razorpay Checkout runs. `api/razorpay/verify-payment.php` checks the HMAC signature and sends the visitor to
   `/meta-growth/thank-you/?plan=…&payment=pay_…`.
3. The thank-you page shows the "Your business" form. The 11 fields come from Shreedhar's "Customer onboarding details" spec;
   only "What do you sell?" and "Who buys from you?" are required.
4. `api/razorpay/onboarding.php` handles the form:
   - It re-checks the payment with the Razorpay API (`captured`/`authorized` only).
   - It reads the plan from the order, and email and phone from the payment.
   - It appends a backup line to `onboarding.jsonl` in the folder **above** `public_html`.
   - It POSTs the row to a **Google Apps Script web app** that appends it to the onboarding Google Sheet.
5. `api/razorpay/.htaccess` allows only `create-order`, `verify-payment` and `onboarding`, and blocks `lib.php` and error logs.

### Secrets and config (never commit, never print)

- `razorpay-config.php` holds `key_id`, `key_secret`, `sheets_url` and `sheets_token`.
  - **On Hostinger:** it's in the home folder, next to `public_html`, with live Razorpay keys.
  - **Locally:** it's at `C:\QW-Social\brandmint\razorpay-config.php`, with **test** keys (`rzp_test_…`) and the same sheet URL and token.
  - It's git-ignored.
- **Google Sheet:** "Meta Growth onboarding", https://docs.google.com/spreadsheets/d/1DRVJ9upzbOYK61i_uZVBqCVBQR2yQlbeOl91Xfo1CgM
  - The owner set it up in their own Google account.
  - An Apps Script project, separate from the sheet, uses `SpreadsheetApp.openById(SHEET_ID)`.
  - It's deployed as a web app with Execute as **Me** and access **Anyone**. HTTP 401 means access isn't "Anyone".
  - Its token is `TOKEN` in the script and must match `sheets_token`. The script code is in `docs/meta-growth-onboarding.md`.
  - If the script changes: Deploy → Manage deployments → Edit → **New version**. The URL stays the same.
- **Status:** the sheet sync was tested on 31 Oct from localhost with a past test payment (`pay_Tq5plLCUggZZAc`), and the script
  replied `ok`. **A real paid customer has not been tested yet.** After the first live order, check the sheet and `onboarding.jsonl`.

## 5. Local testing

- `.claude/launch.json` has three servers:
  - `site`: the source page on port 5173
  - `brandmint-dist`: static `dist` on port 5174
  - `brandmint-php`: XAMPP PHP serving `brandmint/dist` on port 8080. Use this one for PHP endpoints.
- Run `npm run build` before testing, because the server serves `dist/`.
- Locally, `onboarding.jsonl` and `workforce-enquiries.jsonl` are written into `brandmint/`. Both are git-ignored; delete test records afterwards.
- To list recent Razorpay test payments, use PHP with the local config and call `GET https://api.razorpay.com/v1/payments?count=10`.
  Print IDs and statuses only, never the keys.
- `gh` is authenticated. `git push` to GitHub sometimes times out, so run it with a longer timeout.
- On Windows, Python printing non-ASCII text fails with cp1252. Write output to a file or set `PYTHONIOENCODING=utf-8`.

## 6. History (PRs on teamquantumweaveai-design/BrandMintAi)

| PR | What |
|---|---|
| #7 | Fixed a blank page when opening Meta Growth from the menu. Static pages need `isExternal: true` in `src/lib/constants.ts`. |
| #8 | AI Workforce page at `/ai-workforce/` under Solutions. It's a second Vite entry; enquiries go to PHP and are saved and emailed. |
| #9 | Plan cards switched to AI videos (30 seconds each). |
| #10 | Simplified plan cards (section 3) and the post-payment onboarding form plus Google Sheet sync. |

- **After #10:** on 2 Nov 2026 the owner edited `index.html` (main site), `public/sitemap.xml` and `public/brandmint-seo.js`
  directly on `main`. Always pull `main` before branching.
- **Older context:** `PRODUCT.md` and `DESIGN.md` describe the earlier "Social Growth" version, with 26/54/82 posts and three plans.
  Those packages are **retired**. `docs/meta-growth.md` is current.
- `STAGING-RAZORPAY.md` and `staging-upload.zip` are from the first Razorpay staging test and are not needed now.

## 7. Open items (not done)

1. **Verify the first real onboarding submission:** a row in the Google Sheet, plus `onboarding.jsonl` next to `razorpay-config.php` on Hostinger.
   Nobody is notified when a form arrives. Adding an email or WhatsApp alert would be a new feature; it hasn't been asked for yet.
2. **Enquiry emails may go to spam:** emails to `connect@brandmintai.io` show Gmail's "can't verify sender" warning.
   - The owner needs to add a DNS TXT record on `@`:
     `v=spf1 include:_spf.google.com include:_spf.mail.hostinger.com ~all`. The domain had no SPF record.
   - The one-line PHP change was offered but not made: pass an envelope sender (`-f connect@brandmintai.io`) in `mail()`
     in `public/api/workforce-enquiry.php`.
   - It's still unconfirmed whether `workforce-enquiries.jsonl` exists on Hostinger.
3. **Main site Contact form is likely broken:** the live bundle contains `placeholder-url.supabase.co`, because `deploy.yml` doesn't pass
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. So `src/pages/Contact.tsx` and `/admin/leads` probably don't save anything.
   - Fix options: add GitHub secrets (the owner provides the values) and pass them in the workflow, or move the form to a PHP
     endpoint like `workforce-enquiry.php`. Not started.
4. **Cosmetic, AI Workforce form:** the "Choose an option" dropdowns look bolder and larger than the other fields, because they inherit
   the label style.
5. **Minor:** `onboarding.php` with a non-existent payment ID answers "couldn't reach the payment service" instead of "payment not found".
   It's still refused.
6. Before relying on live payments, confirm that Razorpay **Account & Settings → Payment capture** is set to automatic.

## 8. Rules the owner cares about

- Never fabricate proof: no fake metrics, logos, testimonials, or edited screenshots of other people's accounts.
  The owner once asked to inflate view counts on someone else's account; this was refused.
- The owner prefers not to do manual setup, but secrets and Google sign-ins must be done by the owner. Claude can't enter passwords.
- n8n (owner account quantumweave26@gmail.com) has Google Sheets and Drive credentials, but they **expired** as of 31 Oct. Reconnecting
  them is the owner's job. The onboarding sheet doesn't use n8n.
- Reply style: the owner's global CLAUDE.md asks for the terse "caveman" voice and careful, surgical changes.
