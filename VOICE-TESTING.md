# Voice verification

## Hotfix regression checks

The hotfix adds current `output_audio` final-item and both documented content-part
variants, delta-only omitted `content_index`, safe handshake categories, bounded
redacted logs, explicit no-key smoke refusal, setup-error display, strict mismatch
messages, and stale status/readout responses across Stop/restart. The original
89 tests remain covered; the current suite has 101 passing checks.

Use the new local `/voice-diagnostics.html` page to isolate offline PCM playback,
provider readout and microphone input. OpenAI buttons may incur API charges.
The browser can confirm buffer scheduling/completion, but only a listener can
confirm audibility. See `VOICE-TROUBLESHOOTING.md`.

## Verified without credentials

`npm test` runs deterministic mocks against the actual controller, server relay,
readout adapter, PCM player, capture worklet and widget. These checks do not use
an OpenAI key, network API, real microphone recording or audible speaker output.

Coverage:
- Short loud bursts, sustained amplitude and raw speech-start events cannot interrupt
- Empty/punctuation/non-speech labels do not interrupt
- Accepted recognized speech waits for confirmation, interrupts once, then only a final submits
- Repeated interruptions and repeated legitimate questions; duplicate events and stale callbacks
- Committed input ordering when final transcription events arrive out of order
- Stop/restart and missing-key fail-closed behavior
- Server origins, explicit production opt-in, fixed official URLs, request limits and cancellation
- Readout refusal/mismatch/incomplete/cancelled/wrong-ID/no-audio paths release no audio
- Numbers, signs, decimals, negation and currency/percent meaning remain significant
- All queued PCM buffers stop on barge-in; partially initialized microphones are released
- Actual 24 kHz, 20 ms capture frames from 24/44.1/48 kHz input clocks
- Original knowledge, handler logic, UI styling and unrelated source preservation
- Typed/voice answer equality for every knowledge branch plus fallback
- Four explicit voice contact commands and negative/question commands
- Reset, close, navigation, hidden/pagehide/unmount, typed and quick-prompt cancellation

`npm run build` type-checks and builds the production site. Its large-chunk warning
predates this voice task and is not a failing build. `npm run voice:doctor` is an
offline check only; a green presence check does not prove your key works.

## Required real-audio acceptance checks after you add your key

Use HTTPS or localhost. Start with headphones and a quiet room. Keep developer
network tools open if available; never share screenshots containing credentials.

1. Normal speech: ask an automation question; confirm the chat answer and audible
   readout agree, then ask a different question without pressing the mic again.
2. Spoken interruption: interrupt early, midway and near the end with “wait”,
   “stop”, “no” and a complete new question. Old audio must not resume.
3. Repeated interruption: do this at least five times. Ask the same valid question
   twice in different turns; each should receive exactly one response.
4. Ambient noise: play a traffic/motorcycle sample in the room while the agent
   speaks, without saying anything. Note whether OpenAI emits false words and
   whether output is interrupted. Do not assume a mock noise test establishes this.
5. Brief noise: test a clap, a short horn/burst and a chair scrape. Repeat with
   actual speech immediately after the noise. Record false interruptions/misses.
6. Real speech over traffic: vary microphone distance and noise volume. Check
   accurate final transcription, one answer per turn and intelligible output.
7. Multi-turn: alternate all knowledge branches, pauses and repeated questions.
   Check that delayed finals cannot replace a newer turn.
8. Cancellation: Stop during input, answer preparation and output. Repeat with
   close, reset, route change, tab hiding and typed input. Mic indicator must stop.
9. Contact: voice commands “Take me to the contact page”, “Go to the contact page”,
   “Book me a consultation” and “Schedule a consultation” should open `/contact`.
   They must not submit a booking. The same typed phrases remain ordinary chat.
10. Negative commands: “Don't take me to contact” and “How do I book a consultation?”
    must not navigate automatically.
11. Error paths: revoke mic permission, disconnect the mic, lose connectivity,
    and test an invalid key separately. Chat remains usable; no alternate voice starts.
12. Speaker echo: repeat with laptop speakers at ordinary volume, then a headset.
    Compare behavior rather than claiming every device has effective AEC.

Record browser/OS, microphone, headphones/speakers, audio samples/noise conditions,
recognizer transcript, false interruption count and speech-to-interruption delay.
No real-microphone, motorcycle, traffic, acoustic identity or latency result is
claimed in this delivery. Server handshake/model access and audible readout need
that credentialed acceptance pass before launch.

## Migrated test scope

The obsolete native-speech and ElevenLabs-specific test files were removed.
Their relevant widget, cancellation, same-answer and contact-navigation scenarios
were migrated to `tests/widget-behavior.test.cjs` using the actual OpenAI controller
with mock transport. Provider-specific checks now live in the independent audit
suite; audio lifecycle checks remain in `tests/voice-audio-review.test.cjs` with
24 kHz expectations. No original knowledge/source handler was changed for tests.
