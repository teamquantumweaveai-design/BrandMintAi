# Meta Growth System page and Razorpay checkout

The Quantum Weave Meta Growth System landing page is a static page served at
`https://brandmintai.io/meta-growth/`, separate from the React app (same pattern as `/ai-business-faq/`).

| Path | What it is |
|---|---|
| `public/meta-growth/index.html` | The landing page (plans, calendar, checkout buttons) |
| `public/meta-growth/assets/clients/` | Client logos for the scrolling strip |
| `public/meta-growth/thank-you/index.html` | Shown after a verified payment |
| `public/api/razorpay/create-order.php` | Creates a Razorpay order for the chosen plan |
| `public/api/razorpay/verify-payment.php` | Verifies Razorpay's signature, returns the plan |
| `public/api/razorpay/lib.php` | Shared helpers and the price table |

## Pricing

Prices live only in `lib.php` (`SOCIAL_GROWTH_PLANS`), in paise, **including** 18% GST. The server charges
that amount as-is, so the browser can never change it, and records the GST part in the order notes.
If you change a price, also update the page text (`price` line and the "Pay ₹… and start" button label).

| Plan | Charged (incl. GST) | Before GST | GST (18%) |
|---|---|---|---|
| Starter Social | ₹3,999 | ₹3,388.98 | ₹610.02 |
| Growth Social | ₹6,999 | ₹5,931.35 | ₹1,067.65 |
| Scale Social | ₹9,999 | ₹8,473.72 | ₹1,525.28 |

Customers pay the first month online. Later months are collected with Razorpay payment links (no auto-debit).

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
4. Open `/meta-growth/`, click a plan's **Pay** button and complete a test payment with
   Razorpay's test UPI ID `success@razorpay` or a test card.
5. When test payments work, replace the test keys with **Live** keys in the same file.

Until the config file exists, the Pay buttons show "Online payment isn't available right now" and point
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
