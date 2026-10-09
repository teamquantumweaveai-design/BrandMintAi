/** Explicit voice actions only; broad knowledge questions remain normal chat. */
export function resolveVoiceContactNavigation(text: string): "/contact" | null {
  const request = text.toLowerCase().trim().replace(/[.!?]+$/g, "").replace(/\s+/g, " ")
    .replace(/^please\s+/, "").replace(/\s+please$/, "");
  const contact = /^(?:(?:can|could|would) you )?(?:take me to|go to|open|show me)(?: the)? contact(?: page)?(?: for me)?$/;
  const consultation = /^(?:(?:can|could|would) you )?(?:book|schedule|arrange)(?: me)?(?: a| an)?(?: discovery)?(?: consultation| consultant| call)(?: for me)?$/;
  const consultationPage = /^(?:(?:can|could|would) you )?(?:take me to|go to|open|show me)(?: the)? consultation(?: page)?(?: for me)?$/;
  return contact.test(request) || consultation.test(request) || consultationPage.test(request) ? "/contact" : null;
}
