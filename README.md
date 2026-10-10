# BrandMint AI: production integration branch

This branch imports the OpenAI voice changes from `QuantumWeaveDev26/Brandmint-Live`
while retaining the production repository's marketing metadata, analytics,
SEO article, robots/sitemap, Apache redirects, PHP AI Campus newsletter and
navigation improvements. See [INTEGRATION-REVIEW.md](INTEGRATION-REVIEW.md) for
the exact baselines, validation and outstanding production checks.

The staging setup keeps the frontend and PHP newsletter on Hostinger and runs
the voice backend as a Render Web Service. The frontend uses Render's HTTPS and
WebSocket endpoints; no VPS or Hostinger Web App purchase is needed for this test.
Follow [RENDER-STAGING.md](RENDER-STAGING.md) using this integration branch.
The Node development/built servers do not execute PHP.
The uploaded Hostinger snapshot matches the deployed GitHub files; that comparison
is complete. Do not merge or deploy until backend hosting and production voice
checks are complete. The instructions below describe the imported voice layer.

## OpenAI voice hotfix

The existing website and Custom AI Agent, with an OpenAI-only voice layer. Its
knowledge, keyword matching, answers, typed chat, styling and existing contact
navigation remain unchanged. The modal's voice help now explains OpenAI audio
processing and AI-generated speech.

## Silence hotfix and quick check

The current OpenAI final audio item is `output_audio`; the earlier adapter only
accepted `audio` and could withhold valid speech. This copy fixes that narrow
schema mismatch, preserves exact-answer verification, and adds safe diagnostics.
Your existing agent's knowledge, answers, UI and interruption rules are unchanged.

If you use `npm run voice:server` or `npm start`, build first and open the printed
URL, normally **http://127.0.0.1:8787**. Then open
**http://127.0.0.1:8787/voice-diagnostics.html** to test the local PCM tone,
OpenAI readout and microphone separately. The OpenAI buttons use your own key
and may incur API charges. No live provider calls were made in this delivery.

See [VOICE-TROUBLESHOOTING.md](VOICE-TROUBLESHOOTING.md) for the exact stages,
safe logs and optional explicitly requested provider smoke test.

## Run locally

Use **Node.js 24 LTS**. Open a terminal in this folder, beside `package.json`:

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open the local URL printed by Vite. Typed chat works without a key. Voice fails
closed with a clear message until you configure your own OpenAI API access.
There is no browser/system-voice fallback and no other voice provider.

## Add your key yourself

1. Copy `.env.server.example` to **`.env.server.local` in this same folder**, beside
   `package.json` and `README.md`. On Windows, enable file extensions and ensure
   the file does not become `.env.server.local.txt`.
2. Put your OpenAI project key after `OPENAI_API_KEY=` in that local file.
   Never put a key in `src/`, a `VITE_` variable, a browser field, Git or a ZIP.
3. Keep `OPENAI_VOICE=cedar`, or choose the supported alternative `marin`.
4. Restart `npm run dev` after changes. `npm run voice:doctor` checks local
   configuration without contacting OpenAI or printing the key. It does not
   validate model access or available credit.
5. Open the agent, tap the mic and allow microphone access. Use headphones for
   the first real-audio checks. HTTPS or localhost is required.

Mac/Linux copy command: `cp .env.server.example .env.server.local`

Windows PowerShell: `Copy-Item .env.server.example .env.server.local`

The template's API key is intentionally blank. No real key was created, used or
included. OpenAI API usage is billed to your own account once you add a key and
use voice. No live OpenAI calls were made while preparing this update.

## Build, test and run the built site

```sh
npm test
npm run build
npm start
```

`npm start` serves the built site and its voice endpoints together at
`http://127.0.0.1:8787`. `VOICE_PORT` changes the port. The Vite development server
already includes the voice backend; no second server is needed during `npm run dev`.
`npm run preview` previews static assets only and does not provide voice.

Full voice needs a **persistent Node server with WebSocket upgrades**, behind
HTTPS in production. Uploading only `dist/` to static hosting, or using ordinary
Vercel Functions, does not run this voice relay. The existing static deployment
workflow still builds the website; it does not deploy a voice server.

Before production use, read [OPENAI-VOICE.md](OPENAI-VOICE.md) for origins,
authentication, usage limits, endpoint behavior and deployment requirements.
See [VOICE-TESTING.md](VOICE-TESTING.md) for verified checks and the remaining
real-microphone test checklist. Existing Supabase forms retain their separate
configuration and were not submitted or changed.

## Repository structure

```text
src/                 React frontend and existing agent knowledge
public/              PHP newsletter, SEO article, robots/sitemap, Apache files
index.html           Production marketing metadata, analytics and structured data
server/              Server-only OpenAI voice, security, HTTP and WebSocket handlers
  render.mjs         Backend-only Render startup (PORT on 0.0.0.0)
  backend.mjs        Health check, CORS HTTP routes and WebSocket relay
  local.mjs          Local combined website + backend server
scripts/             Reply preparation, voice audit and asset verification
tests/               Audio/controller, security and deployment regressions
render.yaml          Optional backend staging Blueprint
.env.frontend.example Public Render URL template; contains no credentials
.env.server.example  Server-only configuration template; API key is blank
dist/                Generated Hostinger upload; excluded from Git
```

Frontend and backend share the root lockfile. Run Render commands from the
repository root: `server/` has no separate `package.json`. This keeps the generated
exact-reply allowlist tied to the frontend answers without moving marketing files.
