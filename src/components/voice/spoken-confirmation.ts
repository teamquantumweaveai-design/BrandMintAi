// Only a fresh answer to a prepared action's spoken confirmation question counts.
// This is a fallback for continuous voice models that acknowledge approval but
// omit the confirmation tool. It never prepares an action or invents its data.
export function spokenDecision(text: string): boolean | undefined {
  if (/[?？]/u.test(text)) return undefined;
  const words = text.normalize("NFKC").toLowerCase().replace(/[.,!।?;:]/g, " ").replace(/\s+/g, " ").trim();
  if (/^(no|nope|cancel|stop|don't|do not|नहीं|मत|रुको|ಬೇಡ|ಇಲ್ಲ)(?:\s|$)/u.test(words)) return false;
  if (/\b(but|except|change|instead|wait|if|unless|not|don't|cancel|before|after|maybe|why|what|how)\b|लेकिन|बदल|रुको|ಆದರೆ|ಬದಲ|ನಿಲ್ಲ/u.test(words)) return undefined;
  // Deliberately accept whole, unambiguous phrases only. Identifiers, new details,
  // questions and conditional approval go back to the model for clarification.
  const rest = words.replace(/\b(yes|yeah|yep|okay|ok|please|i confirm the recipient and exact message|i confirm the details|i confirm|i approve|confirmed|approved|go ahead|send (?:it|this email|the email|this message|the message)|submit (?:it|this form|the form|the contact form|the message)|now|fill (?:it|the form|the calendly form)|book (?:it|the consultation)|thank you)\b/gu, " ").trim();
  // Casual backchannels must not execute a prepared action. An "okay" prefix
  // is allowed only when accompanied by an explicit decision such as "send it".
  if (!rest && /\b(?:yes|i confirm|i approve|confirmed|approved|go ahead|send|submit|fill|book)\b/u.test(words)) return true;
  if (/^(हाँ|हां|जी हाँ|जी हां|हाँ भेज दो|हां भेज दीजिए|हाँ भेज दीजिए|हाँ सबमिट कर दो|ಹೌದು|ಹೌದು ಕಳುಹಿಸಿ|ಹೌದು ಸಲ್ಲಿಸಿ)$/u.test(words)) return true;
  return undefined;
}

export class SpokenConfirmation {
  private id?: string;
  private output = "";
  private input = "";
  private armed = false;
  private afterAudioMs = -1;
  private expires = 0;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private decide: (id: string, approved: boolean) => void) {}

  review(id?: string) {
    clearTimeout(this.timer);
    this.id = id; this.output = ""; this.input = ""; this.armed = false;
    this.afterAudioMs = -1; this.expires = Date.now() + 300000;
  }

  assistant(delta: string, endMs?: number) {
    if (!this.id || this.armed || Date.now() > this.expires) return;
    this.output = (this.output + delta).slice(-2400);
    if (/(?:do you confirm|(?:may|shall|should|can) i (?:send|submit|book|fill)|would you like me to (?:send|submit|book|fill)|(?:confirm|approve) (?:sending|submitting|booking|these exact|this exact)|क्या.*(?:भेज|जमा|पुष्टि)|(?:ಕಳುಹಿಸ|ಸಲ್ಲಿಸ|ದೃಢೀಕರಿಸ).*[?？])/iu.test(this.output)) {
      this.armed = true; this.input = ""; this.afterAudioMs = endMs ?? -1;
    }
  }

  visitor(delta: string, startMs?: number) {
    if (!this.id || !this.armed || Date.now() > this.expires || (startMs !== undefined && startMs < this.afterAudioMs)) return;
    this.input = (this.input + delta).slice(-1200);
    clearTimeout(this.timer);
    // Live transcript events are fragments, not complete utterances. Wait for the
    // rest of a possible correction rather than acting on the first "yes".
    this.timer = setTimeout(() => this.flush(), 2200);
  }

  flush() {
    clearTimeout(this.timer);
    if (!this.id || !this.armed || Date.now() > this.expires) return;
    const id = this.id, decision = spokenDecision(this.input);
    if (decision === undefined) {
      this.input = ""; this.output = ""; this.armed = false;
    } else {
      this.review();
      this.decide(id, decision);
    }
  }
}
