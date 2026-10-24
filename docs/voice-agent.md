# BrandMint AI voice agent

## Reliability checks

Knowledge is rebuilt on every deployment. Each index includes its revision, generation time and hashes of
the deployed public static pages. `knowledge.php?status=1` reports health without requiring a conversation.
Changed static pages are excluded from search until rebuilt. During a call, the widget checks every minute;
new revisions invalidate earlier retrieved facts. SPA copy refreshes through the existing build pipeline and
current-page context. Linked external sites and private records are not indexed.

Calendly shows that prefilled details are not a booking, until a verified message from its own iframe reports
completion. Reviews display the selected slot in IST by default. Free Plan visitors still complete the final
Calendly form. No API booking upgrade or subscription change is made.

Remember me is opt-in, expires in 30 days, exposes a collapsible saved-details view, and has Forget me.
Invalid stored data is removed. Forget also invalidates pending email and website approvals; it cannot erase
audio already sent during a call. No transcript or action consent is persisted.

Private voice insights include categorized action failures and aggregate backend/tool timing. No text,
email, name or raw error is sent as analytics. Counts may overlap and timing is not total conversation time.
Email success means mail-server acceptance, with a non-secret reference for the team to locate the message;
inbox delivery and Reply-To correctness require a mailbox check. The recipient stays fixed to the company.

This adds a separate bottom-left voice widget to the existing React site. The original chat,
WhatsApp buttons, pages, styling, forms, payments, and deployment workflow remain intact.
The only existing app file changed is `src/App.tsx`: one import and one component mount.
The gitignore also excludes the private server configuration file. An additive `prebuild` script
refreshes voice knowledge before the existing build command; the original build command is unchanged.

## Hostinger setup

The current deployment builds Vite into `dist` and publishes it to the `deploy` branch.
The PHP endpoint under `public/api/voice/` is copied into that build automatically.
Use PHP 8+ with cURL and HTTPS. No Node server, database migration, or new npm dependency is needed.

Before deploying, in Hostinger File Manager create `voice-config.php` in the folder directly
**above** `public_html`, matching the site's existing Razorpay configuration convention:

```php
<?php
return [
    'api_key' => 'REPLACE_WITH_YOUR_EXISTING_OPENAI_KEY',
    'model' => 'gpt-realtime-2.1',
    'max_starts_per_ten_minutes' => 60,
    // Required to activate hands-free booking, using a token that can access the event below:
    'calendly_token' => 'REPLACE_WITH_PRIVATE_CALENDLY_TOKEN',
    'calendly_event_type' => 'https://api.calendly.com/event_types/REPLACE_WITH_BRANDMINT_EVENT_UUID',
    // Required for consented summary delivery; use your real Hostinger domain mailbox:
    'handoff_email' => 'REPLACE_WITH_TEAM_EMAIL',
    'handoff_from' => 'voice@brandmintai.io',
    // Separate random private token, at least 32 characters, for the insights dashboard:
    'metrics_token' => 'REPLACE_WITH_A_RANDOM_PRIVATE_INSIGHTS_TOKEN',
];
```

Enter the real key only in Hostinger's private file editor, never in chat or GitHub.
Do not put this file in `public_html`, `public/`, `src/`, `dist/`, or a ZIP.
Alternatively set `OPENAI_API_KEY` in the PHP server environment, or set
`BRANDMINT_VOICE_CONFIG` to an absolute private configuration path. Vite's
`VITE_*` variables are public and must never contain an OpenAI key.

Use an OpenAI project with Realtime access and billing enabled. Set project spending
alerts/limits in the OpenAI dashboard. Model access must be checked with the real project.
The model name can be changed in the private config if that project uses a different supported Realtime model.

Calendly Scheduling API access requires a compatible paid Calendly plan and appropriate scopes. The
Calendly token is a server credential; this chat's connected account does not automatically give the
website that credential. The configured event type must resolve to the supplied
`https://calendly.com/team-brandmint/30min` URL. Any account you own may be used if its credential has
access to that event. The code rejects another event rather than silently booking a different meeting.
The current connected account inspection showed only `visionimpacttechnologies/new-meeting`; its URI
must not be used as the BrandMint event. No Calendly account or event setting was modified.

Summary delivery uses Hostinger PHP's mail transport with a fixed configured recipient and sender.
Create/verify the sender mailbox and test mail delivery on the host. A successful call means the mail
server accepted the message, not that inbox delivery was verified. Do not put placeholders into production.

## Deploy without changing other site features

1. Review the two-line addition in `src/App.tsx` and the new voice files.
2. Preserve any existing production build environment variables, including Supabase settings.
3. Run `npm ci` then `npm run build` through the existing workflow. Do not upload a locally built
   full site without the production environment variables; this repository uses Vite for configuration.
4. Use the existing `main` → `deploy` → Hostinger pipeline. Verify Hostinger pulls the resulting deployment.
5. Start voice on the HTTPS website, allow the microphone, speak, interrupt a reply, mute/unmute,
   then end. Check that the microphone indicator disappears. Test a phone as well as desktop.
6. Verify the original chat, WhatsApp, contact form, page links, newsletter, and checkout still work.

The standalone static landing pages under `public/` do not mount the React app and therefore do not
display this React widget. All existing React routes display it. No static landing page was edited.

## Behavior and limits

- Microphone access starts only after a visitor clicks Start conversation.
- Audio travels through WebRTC directly to OpenAI. PHP exchanges the SDP offer using the server-held key.
- AI identity and audio sharing are disclosed before starting. Captions are held in tab memory only;
  this addition does not store recordings or transcripts in a BrandMint database. OpenAI's own data
  policies still apply; do not describe this as zero provider retention.
- End, close, tab hiding, page exit, errors, connection timeout, and a five-minute client timer stop the microphone.
- The endpoint rejects foreign origins, bad payloads, and oversized offers, and atomically limits
  starts to five per IP per ten minutes plus a configurable site-wide ceiling (default 60).
- Limits use a bounded temporary file outside the web root, persist across PHP workers, and fail
  closed if it cannot be written. They apply to session starts, not a hard dollar or session-duration cap.
  The five-minute timer is client-side; hostile clients could bypass it. Origin checks are browser
  protections, not authentication. For higher-volume public use, add a server-verified CAPTCHA and
  server-managed call-duration enforcement before increasing limits.
- The voice navigation tool opens existing React pages on request. With private Calendly credentials
  configured, the assistant checks actual slots, collects the visitor's name, email and timezone, reads
  back a prepared booking, and asks explicit permission to book and send the invitation. It then rechecks
  availability and books using Calendly's Scheduling API. Server-side state prevents duplicate writes
  within the same voice session, including ambiguous upstream timeouts. Never retry an uncertain booking
  in a new session until checking Calendly/email first. No cross-session idempotency claim is made.
- Prepared actions can also be approved or declined with the widget's review buttons. Declining removes
  the server draft. The assistant is prompted to use spoken confirmation only after a clear yes to the
  exact prepared details. The server validates the draft, consent flag, expiry and slot; it does not
  independently grade the visitor's audio for consent. Verify confirmation behavior with real voice calls.
- Events requiring payment, required custom questions or additional location choices fall back to the
  supplied embedded Calendly flow. If voice booking is unconfigured, that same fallback remains available.
  The original Contact page is untouched. Server-confirmed API bookings show date/time and management links.
- The embedded calendar uses `https://calendly.com/team-brandmint/30min` without the supplied `month`
  filter so it remains useful after October. Confirmation is shown and spoken only upon a
  `calendly.event_scheduled` message from the actual calendar frame at the exact Calendly origin.
  This is browser confirmation for the visitor; it is not a server-verified CRM booking record or webhook.
  The fallback external Calendly link cannot report a booking back to the widget.
- Optional team summaries are prepared from business needs and shown/read back before sending.
  The visitor must explicitly agree to share the exact summary. Only the fixed configured team email
  receives it. Full transcripts, payment details and passwords must not be included. No arbitrary recipient,
  payment, CRM write or lead-saving tool is added. Those existing website features remain intact.
- Detailed answers use `search_website` and a generated knowledge index of the repository's public
  marketing constants, visible React page copy, and static HTML landing pages. It excludes admin leads,
  env files, credentials, and unrelated n8n workflows. The index does not crawl external linked sites.
  Every `npm run build` now refreshes it automatically using an additive `prebuild` hook. You can also
  run `node scripts/build-voice-knowledge.cjs` manually. Content hashes make unchanged refreshes stable.
  The original dev/build/preview commands and GitHub Actions workflow remain unchanged. Publishing
  content directly in Hostinger without rebuilding the source does not refresh this index.
- Page-aware context includes the current public route, heading and up to 5000 characters of page
  copy. It refreshes on route changes without restarting audio. Admin views, query strings and form
  input values are excluded. The assistant asks which offer is meant when a page contains multiple plans.
- English, Hindi and Kannada can be selected before or during the call. Explicit spoken language-change
  requests are also handled by the voice prompt. Default voice remains Marin. Pronunciation, accents
  and speech recognition in each language need human listening tests with the production project.

## Private quality insights

Open `/voice-insights/` on Hostinger and enter the separate private `metrics_token`. The browser holds
the token only while making the request; it is not saved in localStorage or bundled into frontend code.
The JSON endpoint requires that token in an Authorization header. Do not use your OpenAI/Calendly key.

Reports include starts, connected calls, failures, unanswered-question categories, lookup misses,
server-confirmed bookings, browser-reported calendar completions, and accepted summary submissions.
Only UTC daily aggregates are stored, with 90-day retention. Names, emails, transcript text and the
actual unanswered question text are not analytics fields. Track categories to protect visitor privacy.
Client-reported events can be inaccurate; these are operational indicators, not audited billing metrics.
Failures before a server session exists (such as denied microphone permission) are not counted.

Action endpoints require a signed 15-minute voice-session token and same-origin requests. Booking drafts
and unsubmitted summaries temporarily live in a private directory outside `public_html`; completed
booking contact details and sent summary text are removed. Expired files are cleaned opportunistically
on later session creation. For strict expiry deletion, schedule private-directory cleanup on the host.
Anonymous metrics contain no raw IP. The session-start limiter separately keeps only hashed IP buckets.
The private directory can be set with `storage_dir`; paths under the web root are rejected.

## Local verification

### Voice form assistance

The panel is titled Ishani (brandmint ai voice). Consultation tools and Calendly links default to
Asia/Kolkata (IST); returned slots include local times. An explicit visitor timezone takes precedence.
Enrolment answers use the existing generated public knowledge index and never invent admission rules.

Conversation context remains available during a call. Optional Remember me stores an allowlisted
profile (name, email, company, interest, language, timezone) in this browser's localStorage for 30 days,
only after the toggle is enabled and the visitor asks to save details. It is not account authentication
or cross-device memory. It stores no transcripts, credentials or submission approval. Forget me clears
storage and tells the active assistant to stop relying on earlier saved details. Avoid shared devices.
The profile is shared with OpenAI when a new call starts, as context; action details need reconfirmation.

The email panel appears only for requested email work; normal conversations keep the standard voice UI.
Email requests create an editable draft, with copy/open-email-app controls. When asked to send an enquiry,
Ishani collects the visitor's email, prepares the exact recipient/Reply-To/subject/body for read-back, and
waits for explicit approval before sending to the fixed company inbox `team.brandmint@gmail.com`.
The website's company address is the actual From; the visitor's address is Reply-To and included in the
message. This sends on the visitor's behalf without impersonating their private mailbox. The API rejects
all other destinations. Editing/discarding the draft invalidates approval. No automatic retry follows an
uncertain send; duplicate confirmations cannot send twice. One send attempt per call, three per visitor
address/day, and a global daily cap (default 100, configurable with `email_daily_limit`, maximum 500) apply.

Sending uses Hostinger's PHP mail transport and reports only mail-server acceptance, never verified inbox
delivery. `email_sending_enabled => false` in private voice-config.php disables it. No mailbox password is
needed for this fixed company-enquiry flow. If the host rejects email, keep the draft and use Contact or
the visitor's email app. Server drafts expire in five minutes; content is removed before a send attempt.
Closing the panel/new conversations discard the local draft. Existing Contact and handoff sending remain
separate. GPT-Live 1 remains the voice model. Delegated reasoning and tool selection default to
GPT-6 Astra with low reasoning effort to balance reasoning and voice latency. Backend usage is billed
separately and costs more than the former GPT-6 Luna default. The private `live_backend_model` override
still takes precedence; the model must support low reasoning effort and Responses tool calling.

When asked to fill Contact, Ishani writes each visitor-provided field immediately and verifies the
visible value before acknowledging it, even when only a name is available. Later fields and corrections
preserve the other entered values. No extra fill-confirmation step is required. Calendly name/email
still use a reviewed prefill proposal. Contact sending uses the original form's `requestSubmit()` handler, checks
the approved snapshot again, and observes the original success/error status. Sending requires a
separate explicit approval after read-back. A conversation cannot automatically repeat a Contact
submission, including after an uncertain result. Silence, closing, expired drafts and corrections
never count as approval. Drafts remain only in tab memory and expire after five minutes.

On Calendly Free, `calendly_booking_enabled` stays false. A valid private token/event configuration
enables read-only availability independently. Ishani can open a provider-returned slot link with
approved name/email prefilled. The visitor reviews Calendly's required fields and clicks its final
Schedule button. Opening or prefilling a form is never reported as a completed appointment.

Voice navigation uses a fixed list of published page paths and can scroll to a visible heading,
including Solutions packages. Main React routes keep the conversation connected; opening separate
static pages or external sites ends the microphone session before navigating.

The adapter is confined to `src/components/voice/`; existing page components, form validation,
Supabase insertion, navigation markup, payments and other website features are unchanged.

Prepared reviews also listen for a fresh, unambiguous spoken approval or refusal after Ishani's
confirmation question. After a short pause for transcript fragments, the application executes the
same confirmation method as the review button even if the model omits its tool call. Changed details,
conditional replies, expired reviews and closing the session cannot authorize this fallback.
In-flight confirmation results are shared across model, spoken and button paths to prevent duplicate
email or Contact submissions. Calendly Free still requires its final provider-hosted Schedule click.

`npm run build` checks TypeScript and the production build. The Vite development server cannot
execute PHP; use PHP's built-in server against `dist/` for endpoint checks, or Hostinger staging.
Without a configured server key the widget should show a friendly unavailable message and leave
the existing site functional. A live voice call requires the private key and a real microphone.

Official connection reference: https://developers.openai.com/api/docs/guides/voice-webrtc?voice-api=realtime
Calendly completion reference: https://developer.calendly.com/api-docs/overview/embedding/notifying-the-parent-window
Calendly voice booking reference: https://developer.calendly.com/docs/api-guides/schedule-events-with-ai-agents

## Rollback

Remove only the `VoiceAgent` import and `<VoiceAgent />` mount from `src/App.tsx`, then redeploy
through the normal workflow. Delete `public_html/api/voice/` separately if desired; the existing
deployment uses `clean: false`, so removing source files alone will not remove previously deployed files.
Do not remove or overwrite any other site files.
To fully remove voice refresh/insights as well, remove only the added `prebuild` hook and new
`public_html/voice-insights/` files. Original website routes and build commands need no edits.
