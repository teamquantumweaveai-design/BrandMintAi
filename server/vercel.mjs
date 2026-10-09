import { createVoiceHandler } from './voice-proxy.mjs';
import replies from './generated-replies.mjs';

const handle = createVoiceHandler({ replies, realtimeAvailable: false });
export default {
  fetch(request) {
    // Only Vercel's overwritten header is trusted on Vercel. Never accept an
    // arbitrary X-Forwarded-For value in the standalone/Vite adapters.
    const ip = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() : 'unknown';
    return handle(request, { ip: ip || 'unknown' });
  },
};
