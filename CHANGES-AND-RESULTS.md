# Voice silence hotfix (October 8, 2026)

- Corrected current Realtime `output_audio` final content rejection, retaining legacy audio compatibility and every exact-reply guard.
- Accepted a missing `content_index` only for documented partial transcription events.
- Added bounded no-content server/browser diagnostics, specific safe error categories, a localhost PCM/readout/microphone test page and an explicit opt-in provider smoke command.
- Improved startup origin/port guidance; development still uses its built-in backend and preview stays static-only.
- Original knowledge, matcher, answers, typed chat, UI class names, contact navigation, VAD are unchanged; the shared PCM player only gained passive stage diagnostics.
- `npm test`: 101 passing checks. `npm run build`: passed. `voice:doctor`: no key/file present in this environment. `voice:smoke` without `--live`: zero provider calls.
- No live provider request, real microphone/acoustic test, deployment or repository push was made. Keep your private server env file separate.

The earlier delivery history follows; its provider verification limitations still apply.

# OpenAI-only voice: changes and verification

Prepared 8 October 2026 from the supplied `Brandmint-Native-Voice-Polish(1).zip`.
Source ZIP SHA-256:
`9c95dd7ecd7794463d57c4e76279225ad44221a1ee2dc791faa10059f3099fb5`.

## Result

The old amplitude-triggered browser voice path is replaced with OpenAI
transcription and a constrained, verified OpenAI read-out adapter. A loud sound
alone cannot cancel an answer. Recognized words must pass a short confirmation
gate. Only completed, accepted transcripts enter the existing CustomAgent.

The original knowledge, keyword matching, eight answer branches, default prompts,
action buttons, typed-message behavior, reset/close handlers, contact-navigation
helper and all modal style expressions were preserved and tested. Unrelated
website source, pages, forms, CSS and images remain unchanged. The only modal
source change is its voice-help disclosure.

## Verification completed

- `npm test`: 89 passed, 0 failed on the implementation checkpoint. This comprised
  40 independent safety/controller/readout checks, 18 audio/capture checks and
  31 migrated/expanded widget checks. Consult the current independent audit
  report if a final review adds further cases.
- `npm run build`: passed TypeScript and production Vite build. The CSS output
  hash stayed identical; the JavaScript bundle changed for the voice adapter.
- `npm run voice:doctor`: no configured API key, zero provider requests.
- Real cloud-browser findings are recorded separately in
  `verification/BROWSER-VERIFICATION.txt`.
- Independent code/security findings are in
  `verification/INDEPENDENT-VOICE-AUDIT.md`.

No API key was created or used. No live OpenAI request, real microphone/noise
recording, acoustic echo test or measured interruption-latency test was performed.
All voice-event, PCM/noise, provider-error and output tests are synthetic.

## Changed implementation files

- `src/components/floating/browserVoice.ts`: OpenAI controller, transcript-confirmed
  interruption, final-only submissions, duplicate/ordering/generation guards.
- `src/components/floating/voiceActivity.ts`: amplitude detector is only an endpoint
  hint, never an interruption signal; updated capture rate.
- `src/components/floating/voiceAudio.ts` and `public/audio/voice-capture-worklet.js`:
  true 24 kHz capture while retaining bounded PCM playback and cleanup.
- `src/components/floating/CustomAiAgentModal.tsx`: one voice disclosure string.
- `server/realtime-input.mjs` (new): fixed transcription-only server WebSocket relay.
- `server/realtime-readout.mjs` (new): isolated current-model readout, buffered audio,
  strict transcript/identity/success verification and cancellation.
- `server/voice-security.mjs` (new): shared same-origin, parsing and usage bounds.
- `server/voice-proxy.mjs`: exact-answer HTTP allowlist and verified PCM response.
- `server/local.mjs`: built website plus HTTP/WebSocket server.
- `server/vite-plugin.mjs`: same-origin development relay.
- `server/vercel.mjs`: fail-closed status for hosts without the WebSocket relay.
- `scripts/voice-replies.mjs`: keeps extracting exact original answers and generates
  the server copy of the unchanged speech sanitizer.
- `scripts/voice-doctor.mjs`: safe offline OpenAI configuration check.
- `package.json` / `package-lock.json`: WebSocket dependency and run/test commands.
- `.gitignore`: excludes generated server sanitizer and real environment files.

Added setup/reporting: blank `.env.server.example`, `OPENAI-VOICE.md`, updated
`README.md`, `VOICE-TESTING.md` and this report. Production `dist/` is rebuilt.

Tests: the independent OpenAI suite and `tests/widget-behavior.test.cjs` replace
obsolete native-speech/provider-specific tests. Existing PCM lifecycle tests are
retained with 24 kHz expectations. Widget tests retain every original relevant
scenario and add all-answer equality and negative contact commands.

Removed obsolete files: `ELEVENLABS-SERVER.md`, `api/voice/transcribe.mjs`,
`tests/agent-voice.test.cjs`, `tests/voice-native-audit.test.cjs` and
`tests/voice-proxy.test.mjs`. No active alternate voice provider remains.

## Important limits before launch

Full voice requires your own OpenAI API access and paid usage, plus persistent
Node/WebSocket hosting. Static-only hosting and ordinary Vercel Functions do not
run this relay. The main key belongs only in the ignored `.env.server.local` file
or your hosting provider's server environment, never in a browser bundle or ZIP.

`cedar`/`marin` are documented OpenAI voices, not a verified export of dot's exact
voice. The read-out adapter validates its emitted transcript before releasing
any audio; that adds first-audio latency and is not proof of waveform fidelity.

Noise-only synthetic events no longer interrupt, but ASR can still misrecognize
noise, nearby speech or playback echo. Endpoint heuristics can split a long pause.
The documented transcription WebSocket handshake combination was not exercised
with credentials. Follow the real-audio/credentialed checklist in
`VOICE-TESTING.md` before considering voice production-accepted.
