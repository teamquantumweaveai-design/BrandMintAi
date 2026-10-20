# Social Growth System page and Razorpay checkout

The Quantum Weave Social Growth System landing page is a static page served at
`https://brandmintai.io/social-growth/`, separate from the React app (same pattern as `/ai-business-faq/`).

| Path | What it is |
|---|---|
| `public/social-growth/index.html` | The landing page (plans, calendar, checkout buttons) |
| `public/social-growth/assets/clients/` | Client logos for the scrolling strip |
| `public/social-growth/thank-you/index.html` | Shown after a verified payment |
| `public/api/razorpay/create-order.php` | Creates a Razorpay order for the chosen plan |
| `public/api/razorpay/verify-payment.php` | Verifies Razorpay's signature, returns the plan |
| `public/api/razorpay/lib.php` | Shared helpers and the price table |

## Pricing

Prices live only in `lib.php` (`SOCIAL_GROWTH_PLANS`), in paise, before GST. The server adds 18% GST,
so the browser can never change the amount charged. If you change a price, also update the page text
(`price`, `gst` line and the "Pay ₹… & start" button).

| Plan | Monthly | + 18% GST | Charged |
|---|---|---|---|
| Starter Social | ₹3,999 | ₹719.82 | ₹4,718.82 |
| Growth Social | ₹6,999 | ₹1,259.82 | ₹8,258.82 |
| Scale Social | ₹9,999 | ₹1,799.82 | ₹11,798.82 |

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
4. Open `/social-growth/`, click a plan's **Pay** button and complete a test payment with
   Razorpay's test UPI ID `success@razorpay` or a test card.
5. When test payments work, replace the test keys with **Live** keys in the same file.

Until the config file exists, the Pay buttons show "Online payment isn't available right now" and point
people to WhatsApp, so nothing breaks.

## Later

- Add a Razorpay webhook (`payment.captured`) if you want payments recorded in Supabase or announced on WhatsApp.
- If you move to auto-renewing billing, switch to Razorpay Subscriptions.
