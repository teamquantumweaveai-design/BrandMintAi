# Meta Growth System page and Razorpay checkout

The Quantum Weave Meta Growth System landing page is a static page served at
`https://brandmintai.io/meta-growth/`, separate from the React app (same pattern as `/ai-business-faq/`).

| Path | What it is |
|---|---|
| `public/meta-growth/index.html` | The landing page (free trial, plans, calendar, FAQ, checkout buttons) |
| `public/meta-growth/assets/clients/` | Client logos for the scrolling strip |
| `public/meta-growth/thank-you/index.html` | Shown after a verified payment |
| `public/api/razorpay/create-order.php` | Creates a Razorpay order for the chosen plan |
| `public/api/razorpay/verify-payment.php` | Verifies Razorpay's signature, returns the plan |
| `public/api/razorpay/lib.php` | Shared helpers and the price table |

## Packages (Oct 2026 offer)

| Plan id | Public name (service name) | Price | Each month |
|---|---|---|---|
| `trial` | Try Us Free (Free Social Media Sprint) | ₹0, 7 days, once per business | 2 posts, 1 short Reel, captions + publishing with approval, profile review, 7-day plan, Meta ads / WhatsApp recommendation. No live ads, no ad spend. |
| `starter` | Stay Active (Starter + Ads) | ₹3,999 incl. GST | 8 posts, 2 AI videos (30 seconds each), 4 Story reshares, planning and scheduling, setup + basic management of 1 Click-to-WhatsApp campaign, up to 2 ad creatives, 1 optimisation round, simple report. Suggested ad budget ₹3,000–₹6,000 paid to Meta. |
| `growth` | Reach More Customers (Growth + Ads), "Best for Growth" | ₹6,999 incl. GST | 12 posts, 4 AI videos (30 seconds each), 8 Story reshares, promotions/offer planning, up to 2 Meta campaigns, up to 4 ad creatives, light weekly monitoring, WhatsApp Business greeting + quick replies, report + monthly strategy review. Suggested ad budget ₹6,000–₹15,000 paid to Meta. |

The old Starter/Growth/Scale (26/54/82 posts) packages are retired. `scale` is no longer accepted by the server.

Package rules shown on the page ("What's included and what isn't"): post counts are unique designs (one design on
Instagram + Facebook counts once); Story reshares and ad creatives reuse the included content; Reels use client footage;
one revision round per design; ad spend is always separate and depends on Meta approval and client access; quick replies
are not a chatbot or WhatsApp API; no shoots, custom photography, advanced animation, unlimited revisions, daily message
handling, CRM or custom automation. No guarantees of leads, sales or followers.

## Where to change prices and plan details

The page is static HTML, so plan details live in a few places. Change them together:

1. **Amount charged:** `public/api/razorpay/lib.php` → `SOCIAL_GROWTH_PLANS` (paise, GST included). This is the only
   number the payment uses; the browser cannot change it.
2. **Plan cards, FAQ, structured data:** `public/meta-growth/index.html` (the source copy is `C:\QW-Social\index.html`,
   synced into the repo with asset paths rewritten to `/meta-growth/assets/`).
3. **Sample-month calendar:** `CAL_PLANS` in the page script (posts, Reels, Story reshares, offers).
4. **Plan names after payment:** `PLAN_NAMES` in the page script and `names` in `thank-you/index.html`.

| Plan | Charged (incl. GST) | Before GST | GST (18%) |
|---|---|---|---|
| Stay Active | ₹3,999 | ₹3,388.98 | ₹610.02 |
| Reach More Customers | ₹6,999 | ₹5,931.35 | ₹1,067.65 |

## Payment flow

1. A paid plan's "Choose …" button sends only the plan id to `create-order.php`; the server creates a Razorpay order
   for the fixed price and stores plan, before-GST and GST amounts in the order notes.
2. Razorpay Checkout collects the payment (UPI, cards, net banking). The trial never opens checkout.
3. `verify-payment.php` checks Razorpay's HMAC signature and reads the plan back from the order. Only then does the
   page record the payment and open `/meta-growth/thank-you/`.
4. Later months: we send a Razorpay payment link each month. No auto-debit, no subscription.

## WhatsApp behaviour

- One number for the page: `WA_NUMBER` in the page script (+91 99729 65677).
- Every "Start My Free Trial" button (`data-trial`) opens WhatsApp with:
  "Hi Quantum Weave AI! I'd like to start the free 7-day social media trial for my business. Please share the next steps."
- With `?industry=<slug>` in the URL (from the Meta ads), the message names the business type, e.g.
  "I run a yoga business…". Slugs: `INDUSTRIES` in the page script; they match `marketing/meta-ads/landing-urls.csv`.
- Other WhatsApp links (`data-wa`) carry their own message (plan questions, footer).
- Nothing is sent automatically. Visitors start the chat; the team replies.

## Analytics

GA4 property `G-Z1HB1R50YF` (same as the main site). Events sent from the page, with no personal details:

| Event | When |
|---|---|
| `free_trial_cta_click` | A "Start My Free Trial" link is clicked (`cta_location`, `industry`) |
| `whatsapp_contact_click` | Any WhatsApp link is clicked (`cta_location`) |
| `plan_selected` | A paid plan button is clicked (`plan`) |
| `checkout_initiated` | Razorpay Checkout opens (`plan`, `value`) |
| `payment_success` | Only after the server verified the signature (`plan`, `transaction_id`, `value`) |
| `industry_landing_visit` | Page opened with a known `?industry=` value |

UTM parameters on ad links are picked up by GA4 automatically. Mark `payment_success` and `free_trial_cta_click`
as key events in GA4 if you want them in conversion reports.

## Meta ad creatives

`marketing/meta-ads/` (not deployed with the site):

- `portrait-1080x1350/` and `square-1080x1080/`: 15 free-trial posters per size, one per industry.
- `contact-sheet.png`: preview of all 15.
- `landing-urls.csv`: the landing URL with `industry` and UTM parameters to use as each ad's destination.
- `src/`: `creatives.json` (copy), `poster.html` (design), `generate.py` (renders with headless Chrome) and `og.html`
  (the page's social share image). Edit `creatives.json`, then run `python generate.py` in `src/`.

The internal sales and trial process is in `docs/meta-growth-playbook.md`.

## One-time setup on Hostinger (do this yourself; never commit keys)

1. In the Razorpay dashboard, go to **Account & Settings → API Keys** and generate keys
   (start with **Test mode**).
2. In Hostinger **File Manager**, open the folder that *contains* `public_html` (one level above it).
3. Create `razorpay-config.php` there:

   ```php
   <?php
   return [
       'key_id' => 'rzp_test_xxxxxxxxxxxx',
       'key_secret' => 'xxxxxxxxxxxxxxxxxxxx',
   ];
   ```

   Because it sits outside `public_html`, it can't be downloaded from the web.
   If your site lives somewhere else, set the `RAZORPAY_CONFIG` environment variable to the file's full path.
4. Open `/meta-growth/`, click **Choose Stay Active** and complete a test payment with
   Razorpay's test UPI ID `success@razorpay` or a test card.
5. When test payments work, replace the test keys with **Live** keys in the same file.

Until the config file exists, the paid plan buttons show "Online payment isn't available right now" and point
people to WhatsApp, so nothing breaks.

## Security checks (tested)

- Price comes only from `lib.php`; a tampered `amount` from the browser is ignored.
- Payment is confirmed only by Razorpay's HMAC signature (`hash_equals`), and the plan is read back from the order.
- Endpoints accept only `POST` with a JSON body under 4 KB; requests from other sites (foreign `Origin`) get 403.
- `public/api/razorpay/.htaccess` blocks everything in that folder except the two endpoints (including `lib.php` and PHP `error_log` files).
- Razorpay errors go to the server log, never to the visitor.
- GSAP and Lenis load with Subresource Integrity hashes; Razorpay's `checkout.js` cannot be pinned (Razorpay updates it).
- Keys live outside the web root and `razorpay-config.php` is git-ignored.

Before going live, check in Razorpay **Account & Settings → Payment capture** that live payments are captured **automatically**.
Otherwise payments stay "authorized" and are refunded after a few days.

## Later

- Add a Razorpay webhook (`payment.captured`) if you want payments recorded in Supabase or announced on WhatsApp.
- If you move to auto-renewing billing, switch to Razorpay Subscriptions.
