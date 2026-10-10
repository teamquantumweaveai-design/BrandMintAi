# Voice architecture, security and limitations

## One existing answer engine

- The microphone is captured with browser echo cancellation/noise suppression
  requested, then genuinely resampled to mono 24 kHz PCM16.
- The Node WebSocket relay sends audio to OpenAI's transcription-only
  `gpt-live-transcribe` session. The project key stays on the server. No browser
  credential or ephemeral provider token is returned.
- Partial recognized words provide speech evidence. A 180 ms confirmation timer
  filters empty results, punctuation and non-speech labels before interrupting.
  Audio volume and speech-start events alone never interrupt output.
- A final transcript calls the same existing CustomAgent handler used by typed
  chat. Only that handler chooses answers, actions and contact navigation.
- The server permits only exact replies extracted from that handler. It generates
  a spoken copy with the existing formatting sanitizer. No user question, chat
  history, search results, retrieval instructions or tools go to the output model.
- `gpt-realtime-2.1-mini` acts only as a read-out adapter. A fresh isolated output
  session receives the prescribed answer, empty input/history and no tools. It
  is instructed to read that answer; it cannot supply a new chat answer.
- The readout accepts both current `output_audio` and legacy `audio` content labels; every identity, completion, transcript and byte check remains enforced.
- Generated PCM stays buffered on the server until response/item/content IDs,
  nonempty audio, emitted transcript and successful final response are verified.
  Comparison tolerates case, ordinary punctuation and whitespace, but preserves
  words, negations, numeric signs, decimals and meaningful currency/percent marks.
  A changed or unverifiable readout is discarded; the original text stays in chat.

This validates the model's emitted transcript, not an independent transcription
of the waveform. It is a practical guardrail, not an absolute acoustic-verbatim
guarantee. Numbers verbalized differently can intentionally fail the strict check.
Buffering adds delay before the first sound; actual latency was not measured.

`cedar` is the default documented OpenAI voice; `marin` is the alternative.
There is no verified public export of dot's exact voice, and no such identity
match is claimed. Browser speech synthesis, native browser recognition,
ElevenLabs and other-provider fallbacks are not used.

## Noise, timing and repeated turns

The old 80 ms amplitude-onset cancellation has been removed. Microphone frames
continue during output, but noise with no accepted words cannot stop playback.
The 180 ms timer measures time after recognized text arrives, not actual speech
duration. It accepts useful one-word interruptions such as “stop”, “wait” and “no”.

`gpt-live-transcribe` supplies streaming partial words but no server/semantic VAD
or confidence scores. Local adaptive energy is used only as an endpoint hint:
760 ms of quiet can commit an utterance. A 1.2 s transcript-inactivity backup
handles sustained background noise or very soft speech. Those endpoint heuristics
may split long pauses or delayed transcripts; they are not a neural acoustic VAD.
There is no claim that traffic or a motorcycle can never be misrecognized as words.

Echo cancellation is requested, not guaranteed by every device. Recognized speaker
echo, nearby people, distant voices and transcription hallucinations remain possible.
Use headphones and carry out the real-audio tests before launch. No fragile
text-substring echo filter silently discards a genuine repeated question.

Each session/turn has an abort generation. Confirmed new speech cancels pending
readout requests and every queued playback node. Commit IDs establish input order;
duplicate final events and stale callbacks cannot repeat answers. Stop, close,
reset, navigation, hidden pages and typed/quick-prompt input release the voice path.

## Server and deployment

Development: `npm run dev` owns HTTP and WebSocket voice routes on the same port.
Built site: `npm run build`, then `npm start`. Put that Node process behind your
HTTPS reverse proxy, forwarding `/api/voice/realtime` WebSocket upgrades and normal
requests to it. Alternatively, [RENDER-STAGING.md](RENDER-STAGING.md) describes a
separate Render backend: set the public frontend build variable
`VITE_VOICE_BACKEND_URL` to its HTTPS origin and allow the exact Hostinger frontend
origin with `VOICE_ALLOWED_ORIGINS`. HTTP CORS and WebSocket origin validation both
use this allowlist. `npm run start:backend` starts only the backend, with `/healthz`
and Render's supplied `PORT`, listening on `0.0.0.0`; no `dist/` folder is needed.

Server-only environment values:

| Setting | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Your project key; required for voice; never sent to the browser |
| `OPENAI_VOICE` | `cedar` (default) or `marin`; unknown values fail closed |
| `VOICE_PROXY_ENABLED` | Set `true` explicitly for production |
| `VOICE_ALLOWED_ORIGINS` | Comma-separated exact HTTPS origins in production; no paths or wildcard |
| `VOICE_PORT` | Standalone Node port, default 8787 |
| `VOICE_DEBUG` | `true` enables bounded safe stage labels/counters, never keys/text/audio/raw errors |
| `VOICE_HOST` | Bind address, default 127.0.0.1; configure only for your host/reverse proxy |
| `VOICE_TRUSTED_PROXY_IPS` | Optional comma-separated exact proxy peer IPs; blank ignores forwarded headers |

Behind a reverse proxy, set `VOICE_TRUSTED_PROXY_IPS` to its actual socket peer
address (for example `127.0.0.1` for a local proxy). The proxy must overwrite
`X-Forwarded-For` with exactly one validated client address for both HTTP and
WebSocket requests; do not forward browser-supplied values or append a chain.
Untrusted peers and malformed or multi-address headers use the socket IP.
Keep the Node port inaccessible to untrusted clients who could reach it through
a trusted peer. Without this setting, proxied visitors share that peer's limits.

Example production origin: `https://www.example.com`, replaced with your actual
website origin. Set `NODE_ENV=production` in your hosting environment. Production
voice is disabled unless both the opt-in and valid HTTPS origin list are present.

**An origin allowlist is not user authentication.** Add authentication/access
controls and shared rate limiting before exposing this publicly. Do not rely on
browser Origin headers as a barrier against custom HTTP/WebSocket clients.

Existing Vercel HTTP entries deliberately report Realtime unavailable, because
ordinary Vercel Functions do not host this persistent WebSocket relay. Static-only
hosting remains useful for the existing website/typed agent, but not full voice.
Do not publish `.env.server.local`, node_modules, test captures or private keys.

## Bounds and billing

All upstream URLs/models are fixed in server code. Browser input may contain only
bounded PCM frames and commit requests; callers cannot select URLs/models, pass
arbitrary instructions or send their own answers for readout. Provider raw errors,
transcripts and credentials are not logged. Audio is not saved to disk by this app.

Per-process defaults:
- Input: 1 concurrent session/IP, 4 globally; 6 starts/IP/minute, 24 globally/minute
- Input duration: 10-minute server maximum; 900 audio seconds/hour per process
- Client silence stop: 60 seconds without a question; absolute session stop: 10 minutes
- Server evidence inactivity: 180 seconds, to permit a bounded buffered readout
- Readout: 2 concurrent requests/IP, 6 globally; 12/IP/minute, 60 globally/minute
- Readout budget: 12,000 input characters/hour per process; 4 MiB output cap
- Provider readout deadline: 90 seconds; HTTP deadline: 95 seconds; client turn cap: 150 seconds
- Backend connection/readiness setup: 15 seconds; no hidden auto-retry paid calls

These are local defense-in-depth limits, **not account-wide spending caps**.
They reset on process restart and are not shared across replicas. Failed/aborted
work can still be billed. Set project limits/alerts in your OpenAI account and use
a shared limiter for a multi-instance production service. A ChatGPT subscription
does not by itself configure or pay for this website's API use.

## API references and verification boundary

API contracts were checked against official documentation on 8 October 2026:
- [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)
- [Realtime conversations and constrained readout](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Client events](https://developers.openai.com/api/reference/resources/realtime/client-events)
- [Server events](https://developers.openai.com/api/reference/resources/realtime/server-events)
- [Realtime WebSocket connections](https://developers.openai.com/api/docs/guides/voice-websockets?voice-api=realtime)
- [Current output model](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)

The literal transcription socket URL `/v1/realtime?intent=transcription` is shown
in an [archived official example](https://developers.openai.com/cookbook/examples/speech_transcription_methods).
The current guide documents transcription WebSockets and GA session/events but
omits that literal handshake example. This combination has not been tested with
a live key here. A credentialed smoke test is required before production use.
No deprecated TTS model is selected and there is no deprecated-provider fallback.

## Silence diagnostics

See [VOICE-TROUBLESHOOTING.md](VOICE-TROUBLESHOOTING.md) for the fixed modern audio-item schema, optional missing partial-event index, localhost diagnostic page and explicit live smoke command. Provider error categories and selected approved voice/model can be inspected safely; no credentials or content are exposed.
