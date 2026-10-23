import { z } from "zod";

// Voice-only adapters: existing routes, page components, forms and submit handlers stay intact.
export const voicePages: Record<string, string> = {
  home: "/", about: "/about", solutions: "/solutions", business_growth: "/business-growth",
  quantum_weave: "/quantum-weave", ventures: "/ventures", academy: "/academy", contact: "/contact",
  meta_growth: "/meta-growth/", ai_business_faq: "/ai-business-faq/", business_workflow_audit: "/business-workflow-audit/",
  small_business_automation_ideas: "/small-business-automation-ideas/", whatsapp_lead_follow_up: "/whatsapp-lead-follow-up-system/",
  whatsapp_automation: "/freemium", ai_powered_films: "/filmsuccess", ai_powered_marketing: "/instaskills",
  ai_full_stack_developer: "/fullai", igr_academy: "/igr.academy", appu_ai: "/appuai", ai_filmmaking: "/aifilmmaking",
  cashflow_copy: "https://cashflowcopy.in/", quantum_weave_website: "https://quantumweaveai.io/",
};
const spaPaths = new Set(["/", "/about", "/solutions", "/business-growth", "/quantum-weave", "/ventures", "/academy", "/contact"]);
const normal = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
export function resolveVoicePage(page: string): string | undefined {
  const aliases: Record<string, string> = { solution: "solutions", "solutions page": "solutions", "solution page": "solutions", "contact us": "contact", "contact page": "contact", "about us": "about", "home page": "home" };
  const key = aliases[normal(page)] || normal(page).replace(/ /g, "_");
  return voicePages[key] || Object.values(voicePages).find(path => path === page);
}
export const isVoiceSpaPath = (path: string) => spaPaths.has(path.split("#")[0]);
export async function waitForVoicePage(path: string): Promise<void> {
  const until = Date.now() + 2500;
  while (location.pathname !== path || !document.querySelector("main")) {
    if (Date.now() > until) throw Error("The requested page did not open. Please use the website navigation.");
    await new Promise(resolve => setTimeout(resolve, 40));
  }
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}
export function scrollVoiceSection(section?: string): boolean {
  if (!section) { window.scrollTo({ top: 0, behavior: "smooth" }); return true; }
  const term = normal(section);
  const heading = [...document.querySelectorAll<HTMLElement>("main h1,main h2,main h3,main h4")]
    .find(node => normal(node.textContent || "") === term)
    || [...document.querySelectorAll<HTMLElement>("main h1,main h2,main h3,main h4")].find(node => normal(node.textContent || "").includes(term));
  if (!heading) return false;
  heading.scrollIntoView({ behavior: "smooth", block: "center" }); return true;
}

export const contactFieldsSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(), email: z.string().trim().email().max(254).optional(),
  company: z.string().trim().max(200).optional(),
  type: z.enum(["General", "Venture Incubation", "Enterprise Automation", "Custom IP Forge"]).optional(),
  message: z.string().max(4000).optional(),
}).strict();
export type VoiceContactFields = z.infer<typeof contactFieldsSchema>;
export type VoiceCalendarPrefill = { name: string; email: string; start_time?: string; timezone?: string; scheduling_url?: string };
export function calendarPrefillUrl(details?: VoiceCalendarPrefill, embedded = true): string {
  const base = "https://calendly.com/team-brandmint/30min";
  const url = new URL(details?.scheduling_url || base);
  if (url.origin !== "https://calendly.com" || !(url.pathname === "/team-brandmint/30min" || url.pathname.startsWith("/team-brandmint/30min/"))) throw Error("Calendar link is not the approved BrandMint event.");
  if (details) {
    const valid = z.object({ name: z.string().trim().min(2).max(150), email: z.string().trim().email().max(254) }).parse(details);
    url.searchParams.set("name", valid.name); url.searchParams.set("email", valid.email);
    if (details.timezone) url.searchParams.set("timezone", details.timezone);
  }
  if (embedded) {
    url.searchParams.set("embed_domain", window.location.hostname); url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("hide_event_type_details", "1");
  }
  return url.toString();
}
function contactForm(): HTMLFormElement {
  if (location.pathname !== "/contact") throw Error("Open the Contact page first.");
  const form = document.querySelector<HTMLInputElement>('main input[name="name"]')?.form;
  if (!form || !form.querySelector('[name="email"]') || !form.querySelector('[name="message"]')) throw Error("The existing Contact form is unavailable.");
  return form;
}
export function readVoiceContactForm(): VoiceContactFields {
  const form = contactForm(); const result: Record<string, string> = {};
  for (const key of ["name", "email", "company", "type", "message"]) {
    const input = form.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (input) result[key] = input.value;
  }
  return result as VoiceContactFields;
}
export async function fillVoiceContactForm(fields: VoiceContactFields): Promise<void> {
  const parsed = contactFieldsSchema.parse(fields); const form = contactForm();
  for (const [key, value] of Object.entries(parsed)) {
    const input = form.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (!input) throw Error("A requested Contact field is unavailable.");
    const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event(input instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
  }
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const actual = readVoiceContactForm();
  if (Object.entries(parsed).some(([key, value]) => actual[key as keyof VoiceContactFields] !== value)) throw Error("The form did not retain the details. Please review it manually.");
}
export function validateVoiceContactSubmission(fields: VoiceContactFields): VoiceContactFields {
  return contactFieldsSchema.extend({ name: z.string().trim().min(2).max(150), email: z.string().trim().email().max(254), message: z.string().min(10).max(4000) }).parse(fields);
}
export async function submitVoiceContactForm(expected: VoiceContactFields): Promise<{ success: boolean; message: string; uncertain?: boolean }> {
  const form = contactForm(); const actual = validateVoiceContactSubmission(readVoiceContactForm());
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw Error("The Contact details changed. Review and confirm the updated details before sending.");
  if (form.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled) throw Error("A Contact submission is already in progress.");
  // Observe the original form's own result; never send a second API request or bypass its validation.
  return new Promise(resolve => {
    let busySeen = false;
    const observer = new MutationObserver(() => inspect());
    const finish = (result: { success: boolean; message: string; uncertain?: boolean }) => { observer.disconnect(); clearTimeout(timeout); resolve(result); };
    const inspect = () => {
      if (!form.isConnected || location.pathname !== "/contact") return finish({ success: false, uncertain: true, message: "The page changed before submission was verified. Do not retry; check with the team first." });
      const busy = form.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled;
      if (busy) busySeen = true;
      if (busySeen && !busy && form.textContent?.includes("Thank you! Your message has been sent successfully.")) return finish({ success: true, message: "The existing Contact form confirmed that your message was sent successfully." });
      if (busySeen && !busy && form.querySelector(".text-red-800")) return finish({ success: false, message: "The existing Contact form reported an error. Review the visible error; no successful submission was confirmed." });
    };
    const timeout = setTimeout(() => finish({ success: false, uncertain: true, message: "Contact submission could not be verified. Do not retry automatically; ask the team to check first." }), 25000);
    observer.observe(form, { subtree: true, childList: true, characterData: true, attributes: true });
    form.requestSubmit(); inspect();
  });
}
