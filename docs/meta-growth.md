# Meta Growth System page and Razorpay checkout

The Quantum Weave Meta Growth System landing page is a static page served at
`https://brandmintai.io/meta-growth/`, separate from the React app (same pattern as `/ai-business-faq/`).

| Path | What it is |
|---|---|
| `public/meta-growth/index.html` | The landing page (packages, comparison table, FAQ, checkout buttons) |
| `public/meta-growth/assets/clients/` | Client logos for the scrolling strip |
| `public/meta-growth/thank-you/index.html` | Shown after a verified payment, with the onboarding form |
| `public/api/razorpay/create-order.php` | Creates a Razorpay order for the chosen plan |
| `public/api/razorpay/verify-payment.php` | Verifies Razorpay's signature, returns the plan |
| `public/api/razorpay/lib.php` | Shared helpers and the price table |
| `public/api/razorpay/onboarding.php` | Saves the post-payment onboarding form to the Google Sheet (see `docs/meta-growth-onboarding.md`) |

## Packages (Nov 2026, master report v2.0)

AI-powered Meta ads: AI images, 30-second AI videos and Meta ad campaign setup (the page says "setup", never "managed").
The free 7-day trial and the Stay Active / Reach More Customers plans were retired on 5 Nov 2026.

| Plan id | Name | Agency fee (incl. GST) | Shown struck through | Each month | Meta ad budget (paid by client to Meta) |
|---|---|---|---|---|---|
| `starter` | Starter | ₹9,750 | ₹13,650 | 15 AI images (4:5), 2 AI videos (30 s), 1 campaign, 1 revision round | ₹15,000 |
| `growth` | Growth ("Recommended") | ₹15,870 | ₹20,750 | 25 AI images, 4 AI videos, 2 campaigns, 2 revision rounds | ₹21,000 |
| `premium` | Premium | ₹24,950 | ₹32,850 | 40 AI images, 6 AI videos, 3 campaigns, 3 revision rounds | ₹30,000 |

- The agency fee is charged GST-inclusive (owner's decision), although the master report lists fees "excluding taxes".
- The struck-through reference prices are shown at the owner's request. Never call them a previous price, MRP or a saving.
- The page shows only the ad budget amount (₹15,000 / ₹21,000 / ₹30,000): no "per campaign", no ×2 / ×3 totals and no monthly total (owner's decision, 5 Nov 2026). They are agency-recommended, not Meta minimums.
- Not included yet (report section 9): reports, WhatsApp lead setup, Instant Forms, retargeting, CRM integrations.
- Still open in the report: extra-revision and extra-campaign prices, reporting frequency, client approval timelines.

## Where to change prices and plan details

The page is static HTML, so plan details live in a few places. Change them together:

1. **Amount charged:** `public/api/razorpay/lib.php` → `SOCIAL_GROWTH_PLANS` (paise, GST included). This is the only
   number the payment uses; the browser cannot change it.
2. **Plan cards, FAQ, structured data:** `public/meta-growth/index.html` (the source copy is `C:\QW-Social\index.html`,
   synced into the repo with asset paths rewritten to `/meta-growth/assets/`).
3. **Comparison table:** the "Compare the Packages" section of the page.
4. **Plan names after payment:** `PLAN_NAMES` in the page script and `names` in `thank-you/index.html`.

| Plan | Charged (incl. GST) | Before GST | GST (18%) |
|---|---|---|---|
| Starter | ₹9,750 | ₹8,262.71 | ₹1,487.29 |
| Growth | ₹15,870 | ₹13,449.15 | ₹2,420.85 |
| Premium | ₹24,950 | ₹21,144.06 | ₹3,805.94 |

## Payment flow

1. A paid plan's "Choose …" button sends only the plan id to `create-order.php`; the server creates a Razorpay order
   for the fixed price and stores plan, before-GST and GST amounts in the order notes.
2. Razorpay Checkout collects the payment (UPI, cards, net banking).
3. `verify-payment.php` checks Razorpay's HMAC signature and reads the plan back from the order. Only then does the
   page record the payment and open `/meta-growth/thank-you/`.
4. The thank-you page asks for the business details; `onboarding.php` checks the payment and adds a row to the
   onboarding Google Sheet.
5. Later months: we send a Razorpay payment link each month. No auto-debit, no subscription.

## WhatsApp behaviour

- One number for the page: `WA_NUMBER` in the page script (+91 99729 65677).
- "Talk to Us on WhatsApp" buttons open WhatsApp with: "Hi Quantum Weave AI! I'd like to know more about your AI Meta ads packages."
- Other WhatsApp links (`data-wa`) carry their own message (package questions, footer).
- Nothing is sent automatically. Visitors start the chat; the team replies.

## Analytics

GA4 property `G-Z1HB1R50YF` (same as the main site). Events sent from the page, with no personal details:

| Event | When |
|---|---|
| `whatsapp_contact_click` | Any WhatsApp link is clicked (`cta_location`) |
| `plan_selected` | A paid plan button is clicked (`plan`) |
| `checkout_initiated` | Razorpay Checkout opens (`plan`, `value`) |
| `payment_success` | Only after the server verified the signature (`plan`, `transaction_id`, `value`) |

UTM parameters on ad links are picked up by GA4 automatically. Mark `payment_success` and `whatsapp_contact_click`
as key events in GA4 if you want them in conversion reports.

## Meta ad creatives

`marketing/meta-ads/` (not deployed with the site):

- `portrait-1080x1350/` and `square-1080x1080/`: 15 posters per size, one per industry. **They advertise the retired free trial: do not run them until they are updated.**
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
- Endpoints accept only `POST` with a JSON body under 4 KB (16 KB for the onboarding form); requests from other sites (foreign `Origin`) get 403.
- `public/api/razorpay/.htaccess` blocks everything in that folder except the three endpoints (including `lib.php` and PHP `error_log` files).
- Razorpay errors go to the server log, never to the visitor.
- GSAP and Lenis load with Subresource Integrity hashes; Razorpay's `checkout.js` cannot be pinned (Razorpay updates it).
- Keys live outside the web root and `razorpay-config.php` is git-ignored.

Before going live, check in Razorpay **Account & Settings → Payment capture** that live payments are captured **automatically**.
Otherwise payments stay "authorized" and are refunded after a few days.

## Later

- Add a Razorpay webhook (`payment.captured`) if you want payments recorded in Supabase or announced on WhatsApp.
- If you move to auto-renewing billing, switch to Razorpay Subscriptions.
