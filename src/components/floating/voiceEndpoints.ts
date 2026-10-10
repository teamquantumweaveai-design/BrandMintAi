declare const __VOICE_BACKEND_URL__: string;

export interface VoiceEndpoints { status: string; speak: string; realtime: string; }

export function resolveVoiceEndpoints(backendUrl: string, frontendOrigin: string): VoiceEndpoints {
  const configured = backendUrl.trim();
  const url = new URL(configured || frontendOrigin);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" ||
      !(url.protocol === "https:" || (url.protocol === "http:" && (!configured || local)))) {
    throw new Error("Voice backend must be an HTTPS origin with no path, credentials, query or fragment (HTTP localhost is allowed for development).");
  }
  const base = configured ? url.origin : "";
  return {
    status: `${base}/api/voice/status`,
    speak: `${base}/api/voice/speak`,
    realtime: `${url.protocol === "https:" ? "wss:" : "ws:"}//${url.host}/api/voice/realtime`,
  };
}

export function browserVoiceEndpoints(): VoiceEndpoints {
  return resolveVoiceEndpoints(typeof __VOICE_BACKEND_URL__ === "string" ? __VOICE_BACKEND_URL__ : "", location.origin);
}
