# Brandmint-Live integration review

The review branch imports the voice implementation without replacing production
marketing work. Production `main` and `deploy` must remain untouched until an
explicit release decision. No deployment was performed in preparing this branch.

## Exact repository baselines

- Incoming: `QuantumWeaveDev26/Brandmint-Live`, `main`,
  `f64ba2f9e84b415c2f545ae027363ad2481aba0d`.
- Production source: `teamquantumweaveai-design/BrandMintAi`, `main`,
  `3369efa40ee81433933a3ba3674b01cff4697842`.
- Production deployment branch observed:
  `8754fcfbd96bfb5fd0898f0089d705c311233adc`, matching the supplied Hostinger
  screenshot and all website files in the uploaded Hostinger snapshot.
- Review branch: `integration/brandmint-live-preserve-seo`.

These are separate repositories. This change transfers selected files onto the
production history instead of merging unrelated histories or copying the entire
incoming tree. The incoming checkout remains unchanged.

## Hostinger snapshot comparison completed

The user supplied the current `public_html.zip` after downloading the live
directory. Its SHA-256 is
`b9e3e0a74b2e9d4868caf41147f72cae31e1ee65a90219d9274d45487cd828ae`.
All 17 website files match deploy commit
`8754fcfbd96bfb5fd0898f0089d705c311233adc` byte for byte: no changed,
live-only or deployment-only website files were found. This includes the
compiled homepage, four existing JS/CSS assets, logo, Apache redirects, robots,
sitemap, static article and PHP newsletter endpoint.

All 12 existing public assets also match the integration checkout byte for byte;
the voice worklet is the one added public asset. Compiled homepage marketing
metadata, JSON-LD and analytics are verified by `check:production-assets`.
The archive also contains 28 Git metadata files; these were excluded from the
website comparison and were not copied into the repository. No application
source changes were needed to reconcile the uploaded snapshot.

This clears the Hostinger-only website-file comparison for this snapshot. It
does not validate hosting settings, databases, provider credentials, runtime
PHP behavior or changes made after the download. Direct live-site inspection
was previously blocked by the environment's network proxy (HTTP 403).

## Production work retained byte for byte

- `index.html`: title, description, keywords, author, robots directive,
  canonical/Open Graph/Twitter tags, three JSON-LD blocks, Google Analytics ID.
- `public/robots.txt`, `public/sitemap.xml` and the full static article at
  `public/small-business-automation-ideas/index.html`.
- `public/.htaccess` and `public/_redirects`.
- `public/api/subscribe.php`, `src/lib/newsletter.ts` and the AI Campus footer
  form in `src/components/sections/Footer.tsx`.
- Navigation scroll-to-top behavior in `src/components/sections/Navbar.tsx`.

The production deploy workflow retains `clean: false`. This preserves files
already present on `deploy`; it does not protect a matching Hostinger-only file
from being overwritten during a later deployment.

## Incoming work and compatibility fixes

- Import the voice-enabled assistant, browser audio capture/playback, contact
  voice actions, Node voice relay, generated reply extraction, diagnostics,
  Vercel HTTP adapters, offline checks and regression tests.
- Import the incoming dependency manifest and frozen lockfile. Use Node 24 in
  development and CI. Vercel HTTP adapters do not provide the persistent
  realtime WebSocket relay.
- Preserve production non-voice audit baselines for footer, navbar and newsletter;
  correct the stale readout test expectation to include pronunciation preparation.
- Serve the physical article before SPA fallback in both Node and Vite.
- Reject PHP files in Node/Vite, including encoded-path requests. Apache/PHP
  continues to own `/api/subscribe.php`; do not expose a static preview as a PHP
  runtime or use it to handle real newsletter submissions.
- Add optional `VOICE_TRUSTED_PROXY_IPS` for HTTP and WebSocket rate-limit identity.
  No peers are trusted by default. A configured proxy must overwrite
  `X-Forwarded-For` with one actual client IP, never pass through a client's value
  or append a chain. Restrict backend access and use the existing origin and
  production opt-in controls. See `OPENAI-VOICE.md`.
- Restrict the deploy job to `refs/heads/main`, including manual dispatches.
  Integration branch pushes and PRs run a separate validation workflow with
  read-only repository permissions; that workflow never publishes to `deploy`.

## Validation

Run in the repository root with Node 24:

```sh
npm ci
npm test
npm run build
npm run check:production-assets
```

Tests cover imported voice behavior, typed chat, exact production-file
preservation, workflow safeguards, real local HTTP/WebSocket rate limits,
directory articles and PHP source protections. The asset check verifies compiled
homepage metadata/JSON-LD/analytics and every copied public asset. Update the
preservation test baseline deliberately when marketing approves new changes;
do not automatically regenerate hashes to make an unexpected overwrite pass.

Browser/local functional checks exercised homepage, contact route, article,
AI Campus footer and a typed assistant reply. Browser external requests were
blocked, and no forms, paid provider calls or real microphone tests were made.
Build warnings about the future Vite config loader and large chunks are nonfatal.
Imported historical verification documents describe the upstream delivery and
must not be treated as evidence of production acceptance for this branch.

## Outstanding checks before any release

1. Confirm the Node/WebSocket hosting path. Keep Apache serving the website,
   articles and PHP newsletter; proxy only `/api/voice/*` to the persistent Node
   service on the same HTTPS origin. Configure trusted proxy identity, access
   controls, secrets, allowed origins and usage limits. The existing Hostinger
   static deployment does not deploy or start this backend.
2. Test OpenAI model/account access, microphone permission, playback and
   interruption using authorized credentials. The key was absent in onboarding;
   offline tests and synthetic providers do not establish live voice readiness.
3. Have marketing confirm the existing social/schema logo URL
   `/assets/BrandMint_AI_Logo_Final.png`: the tracked logo is emitted at
   `/BrandMint_AI_Logo_Final.png`. The uploaded live snapshot also lacks the
   `/assets/` logo path. This pre-existing mismatch was preserved rather than
   silently changing marketing's metadata during the voice integration.
4. Verify the PHP newsletter and Supabase forms in an approved staging context;
   preserve existing service configuration. Review the branch without merging
   into `main` or altering Hostinger's tracked `deploy` branch.
5. Recheck the Hostinger snapshot comparison if marketing makes further direct
   file edits before release.

No auto-deployment, merge or production credential changes are part of this
review branch. Publication of a branch is separate from acceptance for release.
