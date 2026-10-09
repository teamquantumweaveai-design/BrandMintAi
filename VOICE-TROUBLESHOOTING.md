# Voice hotfix and local checks

## What was fixed

The delivered reader accepted final Realtime content only when its type was
`audio`. The current OpenAI assistant-message schema uses `output_audio`.
That made a valid completed response fail verification and withheld its audio.
The reader now accepts those two documented audio labels while keeping its
response/item IDs, completion status, output limits and exact-word checks.
Modern `output_audio` and legacy `audio` regression fixtures both pass.

Current transcription delta events may omit `content_index`. Only an omitted
index on that partial event now defaults to the single input audio part (0).
Final events still require a valid index. Noise/endpoint and interruption rules
are unchanged.

Provider HTTP 401/403/429 and known error codes now have safe categories.
A changed-word readout is distinguishable from missing audio, incomplete output,
connection failure and malformed output. No raw provider errors, keys, transcripts
or audio are logged.

This code fix and the offline tests are verified. Your key's validity, account
credit/model access and actual OpenAI speech still require the local checks below.
No credentialed provider request was made while preparing this hotfix.

## Start the correct website

In this project folder, keep your own `.env.server.local` beside `package.json`.
Do not share or ZIP it. A `.txt` suffix on Windows is a different filename.
Use Node 24, then:

```sh
npm ci
npm run voice:doctor
npm run build
npm start
```

Open **http://127.0.0.1:8787** unless the server prints another port. The command
`npm run voice:server` starts this same built-site server. Startup only proves
that the local server started; it never calls OpenAI.

For development, `npm run dev -- --host 127.0.0.1` already includes the backend.
Use its printed URL. Do not run a second voice server for that mode.

Every voice request goes to the browser tab's own origin. A server running on
8787 cannot provide voice to an unrelated tab on 4173, a static preview, another
folder's dev server or your deployed site. `npm run preview` is static-only.

## Three independent checks

Open **http://127.0.0.1:8787/voice-diagnostics.html** (or that path on your Vite URL).
The page runs only on localhost and makes no paid request until you click an
OpenAI test button. It shows its browser origin, exact WebSocket address, backend
status, approved voice and fixed output model. A configured status is only a
presence/format check; it does not validate credentials or account access.

1. **Test local PCM tone.** Uses the website's actual PCM decoder/player with a
   half-second, quiet 440 Hz tone. No microphone or OpenAI request. Expected stages:
   `audio.context: running`, `offline.pcm`, `playback.source_scheduled`,
   `playback.ended`. If the log completes but you hear nothing, check the selected
   output device, tab/system volume and headphones. The page cannot verify audibility.
2. **Test OpenAI readout.** Sends one existing, public, allowlisted BrandMint reply
   shown on the page. Your API account may be billed. Expected stages: HTTP 200,
   nonzero PCM bytes, scheduled playback, ended. No microphone is needed. A failure
   shows a fixed safe category, while preserving strict verification.
3. **Test microphone input.** Requests mic permission and sends mic audio to
   OpenAI. Your API account may be billed. Say “What services do you provide?”
   and pause. The test stops on one final transcript and logs no transcript.
   It deliberately does not ask the agent for an answer; this isolates input.

Stop cancels in-progress work. Hiding/leaving the page also closes the audio and
mic path. Repeating a check must require a fresh click. Do not share anything
private while testing the microphone.

## Test the full agent

Return to the website, open Custom AI Agent, tap its mic, allow permission, then
say “What services do you provide?” and pause. You should see the same existing
agent answer and hear it read aloud. The mic button alone has no greeting.
Typed messages remain text-only. Explicit contact/consultation navigation can
close the modal rather than read a reply.

The existing answer engine, reply text, typed chat, contact navigation, UI styling,
VAD timings, lexical interruption gate and capture worklet are unchanged. The PCM player only gained passive diagnostic callbacks; its playback/cancellation behavior is unchanged.
Use the existing real-audio checklist in `VOICE-TESTING.md`, including noisy-room,
barge-in, speaker echo, repeated questions and Stop/restart checks.

## Safe diagnostic logs

Optionally set `VOICE_DEBUG=true` in your own `.env.server.local`, then restart the
server. Each input/readout attempt logs a random diagnostic ID, fixed stage labels,
whitelisted categories and numeric counters. At most 64 lines per attempt are
logged. No key, text, audio, headers, raw provider error or request body is logged.

Browser diagnostics are opt-in by adding `?voiceDebug=1` to the website URL.
The browser console then shows at most 100 stage entries per controller, including
same-origin targets, availability, connection, first microphone frame, readout
HTTP status, audio receipt, PCM decoding, scheduled playback and completion. No transcript/audio/reply text is
logged there. The diagnostic page's own progress log is also bounded.

Useful categories:
- `invalid_api_key` / HTTP 401: OpenAI rejected authentication
- `permission_denied` / HTTP 403: account/project access problem
- `rate_limit_exceeded` / HTTP 429: request/quota limits; a provider handshake
  status alone cannot distinguish temporary rate limits from account quota
- `insufficient_quota`: provider explicitly reported quota
- `invalid_request_error`, `unknown_parameter`, `invalid_value`: session contract/configuration
- `readout_text_mismatch`: generated words differed, so audio was intentionally withheld
- `readout_no_audio`: a completed response contained no audio
- `readout_incomplete`: generation did not complete
- `readout_not_verified`: malformed/unexpected structure or identity mismatch
- `provider_unavailable` / `setup_timeout`: connection or readiness failed

The exact-word guard remains deliberately strict. Number verbalization, currency,
phone-number pronunciation and spelling “AI” as “A I” can still be withheld. The
hotfix does not silently weaken that guard or replace the agent's answers.

## Optional terminal provider smoke check

`npm run voice:smoke` is offline and makes zero provider requests. If you choose
to make a bounded paid API test with your configured key, run:

```sh
npm run voice:smoke -- --live
```

This first checks transcription-session acceptance without sending microphone
audio, then renders one existing public reply using the actual shipped adapter.
It logs only stages and byte counts and saves no audio/transcript. It cannot prove
microphone transcription or audible playback. Use the diagnostic page for those.
There is no automatic retry, alternate provider or new answer engine.

## Schema evidence

- [OpenAI Realtime assistant-message schema](https://developers.openai.com/api/reference/typescript/__sdk_schema?declaration=%28resource%29+realtime+%3E+%28model%29+realtime_conversation_item_assistant_message+%3E+%28schema%29&selected=%28resource%29+realtime)
- [OpenAI transcription delta schema](https://developers.openai.com/api/reference/typescript/__sdk_schema?declaration=%28resource%29+realtime+%3E+%28model%29+conversation_item_input_audio_transcription_delta_event+%3E+%28schema%29&selected=%28resource%29+realtime)
- [Realtime server events](https://developers.openai.com/api/reference/resources/realtime/server-events)

Checked against current official documentation on October 8, 2026. Those schema
references validate the code correction; they do not establish a live result for
your account, browser or audio hardware.
