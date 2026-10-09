// Browser diagnostics are opt-in via ?voiceDebug=1. No transcript/audio/text.
export function browserVoiceDiagnostics() {
  const enabled = typeof location !== "undefined" && new URLSearchParams(location.search).get("voiceDebug") === "1";
  let count = 0;
  return (stage: string, data: Record<string, string | number | boolean> = {}) => {
    if (!enabled || count++ >= 100) return;
    console.info("[BrandMint voice]", stage, data);
  };
}
const MESSAGES: Record<string, string> = {
  invalid_api_key: "OpenAI rejected the server API key. Check its validity, then restart the voice server.",
  authentication_error: "OpenAI rejected server authentication. Check the API key and restart the voice server.",
  permission_denied: "OpenAI denied access. Check the project's model permissions.",
  model_not_found: "The OpenAI model isn't available to this project. Check its model access.",
  insufficient_quota: "OpenAI reports no available API quota. Check API billing and project limits.",
  rate_limit_exceeded: "OpenAI's rate limit was reached. Wait briefly and retry.",
  invalid_request_error: "OpenAI rejected the voice session settings. Check the safe server diagnostics.",
  invalid_value: "OpenAI rejected a voice setting. Check the safe server diagnostics.",
  unknown_parameter: "OpenAI rejected a voice parameter. Check the safe server diagnostics.",
  unsupported_value: "OpenAI rejected a voice setting. Check the safe server diagnostics.",
  missing_required_parameter: "OpenAI reports a missing voice setting. Check the safe server diagnostics.",
  readout_text_mismatch: "Audio was withheld because OpenAI changed the prescribed words. The original reply is in chat.",
  readout_no_audio: "OpenAI completed the request without audio. The original reply is in chat.",
  readout_incomplete: "OpenAI didn't finish the audio. The original reply is in chat.",
  readout_not_verified: "Audio couldn't pass verification. The original reply is in chat.",
  provider_unavailable: "The server couldn't connect to OpenAI. Check its internet connection and safe diagnostics.",
  setup_timeout: "OpenAI voice setup timed out. Check the server connection and retry.",
  origin_not_allowed: "This website origin isn't allowed by the voice server. Check the browser URL and origin settings.",
  voice_unavailable: "OpenAI voice isn't configured on this website's server. Text chat still works.",
  rate_limited: "Voice is busy. Wait briefly and retry.",
  budget_exhausted: "Voice reached its local usage limit. Please use text chat.",
};
export function voiceFailureMessage(code: unknown, fallback: string): string {
  return typeof code === "string" && Object.prototype.hasOwnProperty.call(MESSAGES, code) ? MESSAGES[code] : fallback;
}
export function voiceFailureCode(code: unknown): string {
  return typeof code === "string" && Object.prototype.hasOwnProperty.call(MESSAGES, code) ? code : "voice_error";
}
