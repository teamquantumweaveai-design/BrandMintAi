# Test voice on Render with a temporary Hostinger frontend

Use **`teamquantumweaveai-design/BrandMintAi`**, branch
**`integration/brandmint-live-preserve-seo`** for both deployments. The backend is
a Render **Web Service**, not a Static Site, Postgres database or Private Service.
The frontend is a separate Hostinger **PHP/HTML website**. The agent remains
inside the frontend; its microphone and readout connect to Render in the background.

This is a staging test before purchasing hosting. No VPS or Hostinger Web App
upgrade is required for this arrangement. Render's free tier can sleep and have
cold starts, so it is suitable for testing rather than a promise of production
voice latency. OpenAI API usage still incurs charges on your OpenAI account.

## 1. Create the temporary frontend website

In Hostinger's Websites page, choose **Create website** and the option for a
**PHP/HTML or empty website**, then use a temporary domain if offered. Create it
as an additional website. Leave `brandmintai.io` and its Git deployment intact.

Open the new website's dashboard and copy its exact **HTTPS URL**. An example
origin is `https://YOUR-TEMPORARY-SITE.hostingersite.com`. Use the real URL shown
by your account. An origin has no path or trailing slash. HTTPS must work for
microphone access. If the page redirects to another hostname, use the final
hostname as the allowed origin.

No website files need to be uploaded yet; obtaining this URL comes first.

## 2. Create the Render backend

In the screen with service choices, select **New Web Service** under **Web
Services**. Connect GitHub and select the repository and integration branch above.
If it is missing, give Render access to this repository in the correct GitHub
organization. Use these settings:

| Render field | Value |
| --- | --- |
| Name | `brandmint-voice-staging` (or an available name) |
| Branch | `integration/brandmint-live-preserve-seo` |
| Runtime | Node |
| Root Directory | Leave blank: use repository root |
| Build Command | `npm ci --include=dev && npm run voice:prepare` |
| Start Command | `npm run start:backend` |
| Health Check Path | `/healthz` |
| Instance | Free, if available for this account |
| Auto-Deploy | Off for controlled staging updates |

Add the following in Render's **Environment** settings:

| Environment variable | Value |
| --- | --- |
| `NODE_VERSION` | `24.19.0` |
| `NODE_ENV` | `production` |
| `VOICE_PROXY_ENABLED` | `true` |
| `VOICE_ALLOWED_ORIGINS` | The exact temporary frontend HTTPS origin from step 1 |
| `OPENAI_VOICE` | `cedar` |
| `OPENAI_API_KEY` | Your OpenAI project key, entered privately in Render |

Do not enter the key into GitHub, chat, Hostinger website files, a frontend env
file or a `VITE_` variable. Render supplies `PORT`; the backend binds to
`0.0.0.0`. The root lockfile is shared; `server/` is not a standalone package.
Reply preparation needs TypeScript, so the build includes development dependencies.

The optional root `render.yaml` describes the same service for Render Blueprint
users; it requires the key and allowed origin to be entered separately. Use one
creation method. There is no need to provision a database for voice.

Deploy the service and copy its `https://...onrender.com` URL. Open
`https://YOUR-RENDER-SERVICE.onrender.com/healthz`. Expected JSON:

```json
{"service":"brandmint-openai-voice","status":"ok"}
```

This confirms the process and routing, not valid OpenAI access. The backend root
`/` intentionally returns 404: Render serves only voice endpoints and health.

## 3. Build and upload the connected frontend

Check out the integration branch above. With Node.js 24, from the repository root:

```sh
npm ci
```

Copy `.env.frontend.example` to `.env.local`. Replace its example with the real
Render origin from step 2, with no API path:

```dotenv
VITE_VOICE_BACKEND_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Then run:

```sh
npm test
npm run build
npm run check:production-assets
```

Upload **the contents of `dist/`** into the **temporary website's** `public_html/`.
`index.html` must sit directly in `public_html/`, not `public_html/dist/`.
Include the hidden `.htaccess` file, `api/`, `assets/`, the article directory,
robots and sitemap. Do not upload repository `.git/`, source code, `node_modules/`
or any `.env` files. No files should be uploaded to the production website.

The Render URL is compiled into the frontend. Changing it requires a fresh build
and replacement of the temporary site's files. Changing the allowed frontend
origin requires a Render environment update/redeploy. If Codex is preparing the
upload for you, send both public URLs; no secrets are needed to build the frontend.

## 4. Test the complete staging path

1. Open the temporary frontend over HTTPS. Confirm its navigation, article and
   typed chat work before starting voice.
2. Open the Custom AI Agent, press the microphone button and allow microphone
   access. Test with headphones first.
3. In browser Network tools, `/api/voice/status` must use the Render hostname and
   return `enabled: true`, `configured: true`, `realtime: true`. Presence of a
   key is not proof of valid credentials or model entitlement.
4. The WebSocket to `wss://YOUR-RENDER-SERVICE.onrender.com/api/voice/realtime`
   should upgrade with status 101. The agent should reach its listening state.
5. Ask a question about automation. Check that transcription appears, the reply
   matches typed chat, and `/api/voice/speak` returns audible OpenAI speech.
6. Interrupt with another question. Check that old speech stops and only the new
   answer plays. Stop/restart voice, close/reopen chat, navigate and test again.
7. Check that missing/invalid credentials and connection loss leave text chat
   usable, with a clear voice failure message. A successful health check alone
   does not pass this test.

Useful failure distinctions:

| Symptom | Check |
| --- | --- |
| Requests go to Hostinger `/api/voice/*` | Rebuild with the correct `VITE_VOICE_BACKEND_URL`; replace stale frontend files |
| CORS or WebSocket 403 | Exact final frontend origin in `VOICE_ALLOWED_ORIGINS`; no trailing slash |
| Voice 503 / not configured | Render key, enable flag, valid HTTPS origin; redeploy after edits |
| Health 200 but provider rejected | OpenAI credit, key permissions and access to the configured models |
| First request slow or setup times out | Wake the free Render service via `/healthz`, wait for readiness and retry |
| Voice 429 with multiple testers | Existing per-client/concurrency limits and proxy identity policy |
| No sound after successful request | Browser audio permission, output device and actual playback; test with headphones |

The preserved PHP newsletter remains on Hostinger and still uses its existing
service. Local Node servers cannot execute PHP. Existing marketing forms and
analytics retain their production configuration; deliberate submissions can
reach real systems. The uploaded production backup matches the deployed files;
the existing metadata logo path issue is documented in `INTEGRATION-REVIEW.md`.

## Scope and limits

The staging change adds a backend-only entry point, public frontend endpoint
setting, exact-origin CORS/preflight handling and WebSocket origin validation.
It retains the existing OpenAI input/output pipeline, exact-reply registry and
production SEO/PHP sources. `main`, `deploy` and the production Hostinger site
are outside this staging deployment. The GitHub production workflow remains
restricted to `main`; pushing this integration branch runs validation only.

Origin checks are not user authentication, and limits are per-process. Behind
Render's proxy, forwarded client IPs are ignored unless exact trusted peer IPs
and a proxy that overwrites `X-Forwarded-For` with one validated client address
are explicitly configured. Leave `VOICE_TRUSTED_PROXY_IPS` blank until that policy
is verified; testers may share proxy limits. Do not guess addresses or blindly
trust headers. Production access control, durable usage limits and model/account
access still require review before launch.

Offline tests and browser tests with synthetic providers verify wiring and
failure handling. Actual Render deployment, HTTPS microphone use, OpenAI
transcription/readout and audible interruption must pass after the two hosting
URLs and private Render credentials are configured. No claim that the backend
is "perfect" follows from the local tests.
