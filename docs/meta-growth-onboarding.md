# Meta Growth onboarding form and Google Sheet

After a paid plan, `/meta-growth/thank-you/` shows a short "Your business" form (fields from the
Oct 31, 2026 onboarding spec). It posts to `public/api/razorpay/onboarding.php`, which:

1. Checks the Razorpay payment exists and is paid (`captured` or `authorized`). Anyone without a real payment ID is refused.
2. Reads the plan from the payment's order, and the customer's email and phone from the payment.
3. Adds one row to the team's Google Sheet through a Google Apps Script web app.
4. Keeps a backup line in `onboarding.jsonl` next to `public_html` (never reachable from the web, git-ignored).

The customer sees success if either the sheet or the backup worked. Failures are written to the PHP error log.
Sending the form again adds another row; the newest row for a payment ID is the latest answer.

## Sheet columns

Submitted (UTC) · Payment ID · Plan · Email · Phone · Business name · Website or Instagram · Kind of business ·
City or area · What they sell · Who buys · Why people pick them · Offers or launches · Tone · Caption language ·
Never say or show

## One-time setup (do this yourself; never commit the token or URL)

1. Create a Google Sheet, for example "Meta Growth onboarding".
2. In the sheet, open **Extensions → Apps Script**, replace the code with the script below and change `TOKEN`
   to a long random password (for example from a password manager). Save.
3. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy, allow access,
   and copy the web app URL (ends in `/exec`).
4. In Hostinger File Manager, add two lines to `razorpay-config.php` (the file above `public_html`):

   ```php
   <?php
   return [
       'key_id' => '...',
       'key_secret' => '...',
       'sheets_url' => 'https://script.google.com/macros/s/XXXX/exec',
       'sheets_token' => 'the same TOKEN as in the script',
   ];
   ```

5. Make a test payment, fill the form on the thank-you page and check that a row appears.

"Anyone" access is needed so the website can call the script; the token stops anyone else from adding rows.
If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

```javascript
const TOKEN = 'change-me-to-a-long-random-password';
const HEADERS = ['Submitted (UTC)', 'Payment ID', 'Plan', 'Email', 'Phone', 'Business name', 'Website or Instagram',
  'Kind of business', 'City or area', 'What they sell', 'Who buys', 'Why people pick them', 'Offers or launches',
  'Tone', 'Caption language', 'Never say or show'];

function doPost(e) {
  let data;
  try { data = JSON.parse(e.postData.contents); } catch (err) { return reply(false); }
  if (!data || data.token !== TOKEN || !Array.isArray(data.row)) return reply(false);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    // A leading = + - @ would run as a formula; store it as plain text instead.
    sheet.appendRow(data.row.map(v => /^[=+\-@]/.test(String(v)) ? "'" + v : String(v)));
  } finally {
    lock.releaseLock();
  }
  return reply(true);
}

function reply(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(ContentService.MimeType.JSON);
}
```
