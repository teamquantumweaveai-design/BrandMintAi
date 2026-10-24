import { z } from "zod";

export const preferencesSchema = z.object({
  name: z.string().trim().max(150).optional(), email: z.string().trim().email().max(254).optional(),
  company: z.string().trim().max(200).optional(), interest: z.string().trim().max(500).optional(),
  language: z.enum(["en", "hi", "kn"]).optional(), timezone: z.string().max(80).optional(),
}).strict();
export type VoicePreferences = z.infer<typeof preferencesSchema>;
const key = "brandmint-ishani-memory-v1";
const lifetime = 30 * 86400000;
export function loadVoiceMemory(): VoicePreferences | null {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (!saved || !Number.isFinite(saved.expires) || saved.expires < Date.now()) { localStorage.removeItem(key); return null; }
    return preferencesSchema.parse(saved.preferences);
  } catch { return null; }
}
export function saveVoiceMemory(preferences: VoicePreferences): boolean {
  try { localStorage.setItem(key, JSON.stringify({ expires: Date.now() + lifetime, preferences: preferencesSchema.parse(preferences) })); return true; } catch { return false; }
}
export function forgetVoiceMemory() { try { localStorage.removeItem(key); } catch {} }
export const emailDraftSchema = z.object({
  to: z.string().trim().email().max(254).optional(), subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(6000),
}).strict();
export type VoiceEmailDraft = z.infer<typeof emailDraftSchema>;
export function emailDraftLink(draft: VoiceEmailDraft): string {
  const data = emailDraftSchema.parse(draft);
  return `mailto:${encodeURIComponent(data.to || "")}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
}
