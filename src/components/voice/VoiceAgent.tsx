import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Volume2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { BrandMintVoiceSession, type VoiceCaption, type VoiceStatus, type VoiceLanguage, type VoiceProposal, type VoiceBooking } from "./realtime";
import "./voice-agent.css";
import { calendarPrefillUrl, fillVoiceContactForm, submitVoiceContactForm, isVoiceSpaPath, waitForVoicePage, scrollVoiceSection, type VoiceCalendarPrefill } from "./website-actions";
import { loadVoiceMemory, saveVoiceMemory, forgetVoiceMemory, emailDraftLink, type VoicePreferences, type VoiceEmailDraft } from "./personalization";

export default function VoiceAgent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialMemory] = useState(loadVoiceMemory);
  const savedPreferences = useRef<VoicePreferences>(initialMemory || {});
  const [remember, setRemember] = useState(initialMemory !== null);
  const rememberEnabled = useRef(initialMemory !== null);
  const [language, setLanguage] = useState<VoiceLanguage>(initialMemory?.language || "en");
  const [emailDraft, setEmailDraft] = useState<VoiceEmailDraft>();
  const [proposal, setProposal] = useState<VoiceProposal | null>(null);
  const [proposalBusy, setProposalBusy] = useState(false);
  const [bookingResult, setBookingResult] = useState<VoiceBooking | null>(null);
  const [handoffSent, setHandoffSent] = useState(false);
  const [capabilities, setCapabilities] = useState({ voice_booking: false, handoff: false });
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<VoiceStatus | "idle">("idle");
  const [muted, setMuted] = useState(false);
  const [message, setMessage] = useState("");
  const [captions, setCaptions] = useState<VoiceCaption[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [calendarDetails, setCalendarDetails] = useState<VoiceCalendarPrefill>();
  const [booked, setBooked] = useState(false);
  const bookingFrame = useRef<HTMLIFrameElement>(null);
  const session = useRef<BrandMintVoiceSession | null>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const active = status !== "idle";

  const end = () => {
    session.current?.stop();
    session.current = null;
    setStatus("idle"); setMuted(false); setBlocked(false);
  };
  const clearMemory = () => { forgetVoiceMemory(); savedPreferences.current = {}; rememberEnabled.current = false; setRemember(false); session.current?.forgetPreferences(); };
  const close = () => { end(); setOpen(false); setBooking(false); setCalendarDetails(undefined); setEmailDraft(undefined); launcher.current?.focus(); };
  const openBooking = (details?: VoiceCalendarPrefill) => { setCalendarDetails(details); navigate("/contact"); setBooked(false); setBooking(true); };

  useEffect(() => {
    const frame = requestAnimationFrame(() => session.current?.updatePageContext());
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    if (!booking) return;
    let confirmed = false;
    const onMessage = (event: MessageEvent) => {
      if (confirmed || event.origin !== "https://calendly.com" || event.source !== bookingFrame.current?.contentWindow) return;
      if (event.data?.event === "calendly.event_scheduled") {
        confirmed = true;
        setBooked(true);
        session.current?.bookingConfirmed();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [booking, calendarDetails]);

  useEffect(() => () => session.current?.stop(), []);
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); close(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    const node = transcript.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [captions]);
  useEffect(() => {
    const stop = () => session.current?.stop("Voice paused because you left the page. Start again when you're ready.");
    const hide = () => { if (document.hidden) stop(); };
    window.addEventListener("pagehide", stop);
    document.addEventListener("visibilitychange", hide);
    return () => { window.removeEventListener("pagehide", stop); document.removeEventListener("visibilitychange", hide); };
  }, []);

  const start = async () => {
    if (session.current || !audio.current) return;
    setMessage(""); setCaptions([]); setMuted(false); setBlocked(false); setStatus("connecting");
    setProposal(null); setBookingResult(null); setHandoffSent(false);
    const call = new BrandMintVoiceSession(audio.current, {
      status: setStatus,
      caption: item => setCaptions(previous => {
        const found = previous.some(caption => caption.id === item.id);
        return (found ? previous.map(caption => caption.id === item.id ? item : caption) : [...previous, item]).slice(-30);
      }),
      ended: reason => { session.current = null; setStatus("idle"); setMuted(false); setBlocked(false); if (reason) setMessage(reason); },
      playbackBlocked: () => setBlocked(true),
      navigate: async (path, section) => {
        if (!isVoiceSpaPath(path)) { end(); window.location.assign(path); return true; }
        navigate(path); await waitForVoicePage(path);
        session.current?.updatePageContext();
        return scrollVoiceSection(section);
      },
      book: openBooking,
      fillContact: fillVoiceContactForm,
      submitContact: submitVoiceContactForm,
      proposal: setProposal,
      capabilities: setCapabilities,
      booked: result => { setBookingResult(result); setBooked(true); setBooking(false); navigate("/contact"); },
      handoffSent: () => setHandoffSent(true),
      remember: details => {
        if (!rememberEnabled.current) return false;
        const next = { ...savedPreferences.current, ...details };
        if (!saveVoiceMemory(next)) return false;
        savedPreferences.current = next; return true;
      },
      forget: clearMemory,
      emailDraft: setEmailDraft,
    }, language, savedPreferences.current);
    session.current = call;
    try { await call.start(); } catch (error) {
      call.stop(error instanceof Error ? error.message : "Unable to start voice.");
    }
  };

  return (
    <div className="bm-voice">
      <audio ref={audio} autoPlay playsInline />
      {open && (
        <section ref={panel} className="bm-voice-panel" role="dialog" aria-labelledby="bm-voice-title"
          onKeyDown={event => {
            if (event.key !== "Tab") return;
            const elements = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], select, iframe');
            if (!elements?.length) return;
            const first = elements[0], last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }}>
          <header className="bm-voice-header">
            <span className="bm-voice-mark"><Mic size={20} aria-hidden="true" /></span>
            <div><h2 id="bm-voice-title">Ishani <small>(brandmint ai voice)</small></h2><p>Your AI business guide</p></div>
            <button ref={closeButton} className="bm-voice-icon" onClick={close} aria-label="Close voice agent and end conversation"><X size={20} /></button>
          </header>
          <div className="bm-voice-body">
            <div className={`bm-voice-orb ${active && !muted ? "bm-voice-active" : ""}`}><Mic size={30} aria-hidden="true" /></div>
            <p className="bm-voice-status" role="status">{muted ? "Microphone muted" : {
              idle: "Let's talk about your business", connecting: "Connecting…", listening: "Listening — go ahead",
              thinking: "Thinking…", speaking: "Ishani is speaking",
            }[status]}</p>
            <p className="bm-voice-intro">Explore AI automation, business growth, and the right next step for your team.</p>
            <label className="bm-voice-language">Voice language
              <select value={language} onChange={event => {
                const value = event.target.value as VoiceLanguage; setLanguage(value); session.current?.setLanguage(value);
              }} aria-label="Voice language">
                <option value="en">English</option><option value="hi">हिन्दी · Hindi</option><option value="kn">ಕನ್ನಡ · Kannada</option>
              </select>
            </label>
            <div className="bm-voice-memory">
              <label><input type="checkbox" checked={remember} onChange={event => {
                if (!event.target.checked) { clearMemory(); return; }
                if (!saveVoiceMemory(savedPreferences.current)) { setMessage("Your browser could not save preferences."); return; }
                rememberEnabled.current = true; setRemember(true);
              }} /> Remember me on this device</label>
              <button onClick={clearMemory}>Forget me</button>
              <small>{remember ? "Basic preferences saved for 30 days. Tell Ishani what to remember. Avoid shared devices." : "Memory is off. Conversation context lasts for this call."} Booking times default to IST.</small>
            </div>
            {emailDraft && <div className="bm-voice-email" aria-label="Email draft">
              <strong>Email draft · not sent</strong>
              <label>To<input aria-label="Draft email recipient" value={emailDraft.to || ""} onChange={event => setEmailDraft({ ...emailDraft, to: event.target.value || undefined })} /></label>
              <label>Subject<input aria-label="Draft email subject" value={emailDraft.subject} onChange={event => setEmailDraft({ ...emailDraft, subject: event.target.value })} /></label>
              <label>Message<textarea aria-label="Draft email body" value={emailDraft.body} onChange={event => setEmailDraft({ ...emailDraft, body: event.target.value })} /></label>
              <button onClick={async () => { try { await navigator.clipboard.writeText(`To: ${emailDraft.to || ""}\nSubject: ${emailDraft.subject}\n\n${emailDraft.body}`); setMessage("Email draft copied. Nothing was sent."); } catch { setMessage("Select and copy the draft text above."); } }}>Copy draft</button>
              <button onClick={() => { try { const link = emailDraftLink(emailDraft); end(); window.location.href = link; } catch { setMessage("Check the email address, subject and message before opening your email app."); } }}>Open email app</button>
              <button onClick={() => setEmailDraft(undefined)}>Discard draft</button>
            </div>}
            {active && <p className="bm-voice-context">Helping with: {location.pathname === "/" ? "Home" : location.pathname.slice(1).replace(/-/g, " ")}</p>}
            {proposal && <div className="bm-voice-proposal" role="region" aria-label="Review voice action">
              <strong>{{ booking: "Confirm your consultation", handoff: "Share this summary with the team?", calendar_prefill: "Review Calendly details", contact_fill: "Review Contact form details", contact_submit: "Send this Contact message?" }[proposal.kind]}</strong>
              <p>{proposal.summary}</p>
              <div><button disabled={proposalBusy} onClick={async () => {
                if (!session.current) return;
                setProposalBusy(true);
                try { const result = await session.current.confirmProposal(proposal); if (!result.success) setMessage(result.message || "The action could not be confirmed."); }
                catch { setMessage("No confirmation received. Do not retry a booking; check your email or contact the team first."); }
                finally { setProposalBusy(false); }
              }}>{proposalBusy ? "Checking…" : { booking: "Confirm and send invitation", handoff: "I agree — email this summary", calendar_prefill: "Fill Calendly form", contact_fill: "Fill Contact form", contact_submit: "Confirm and send message" }[proposal.kind]}</button>
              <button disabled={proposalBusy} onClick={async () => {
                setProposalBusy(true);
                try { await session.current?.declineProposal(proposal); }
                catch { setMessage("Unable to discard this draft. End the conversation to prevent further actions."); }
                finally { setProposalBusy(false); }
              }}>Don't proceed</button></div>
              <small>You can also tell the assistant to confirm, correct, or decline these details.</small>
            </div>}
            {bookingResult && <div className="bm-voice-confirmed" role="status"><strong>Your consultation is booked</strong>
              <p>{new Date(bookingResult.start_time).toLocaleString("en-IN", {timeZone: bookingResult.timezone})} ({bookingResult.timezone})</p>
              {bookingResult.reschedule_url?.startsWith("https://calendly.com/") && <a href={bookingResult.reschedule_url} target="_blank" rel="noopener noreferrer" onClick={end}>Reschedule ↗</a>}
              {bookingResult.cancel_url?.startsWith("https://calendly.com/") && <a href={bookingResult.cancel_url} target="_blank" rel="noopener noreferrer" onClick={end}>Cancel booking ↗</a>}
            </div>}
            {handoffSent && <p className="bm-voice-confirmed" role="status">Your approved summary was submitted to the team's mail server for delivery.</p>}
            {booking && <div className="bm-voice-calendar">
              <div className="bm-voice-booking-heading"><strong>{booked ? "Calendly confirmed your booking" : "Book your 30-minute consultation"}</strong>
                <button onClick={() => setBooking(false)} aria-label="Close booking calendar"><X size={16} /></button></div>
              {booked && <p role="status">Your consultation is booked. Check your email for Calendly's details.</p>}
              <iframe ref={bookingFrame} title="Book a BrandMint AI consultation on Calendly"
                src={calendarPrefillUrl(calendarDetails)}
                referrerPolicy="strict-origin-when-cross-origin" />
              <a href={calendarPrefillUrl(calendarDetails, false)} target="_blank" rel="noopener noreferrer" onClick={end}>Open Calendly in a new tab ↗</a>
            </div>}
            <div className="bm-voice-transcript" ref={transcript} role="log" aria-label="Voice conversation captions" aria-live="off" style={booking ? { height: 75 } : undefined}>
              {captions.length ? captions.map(item => <p key={item.id}><strong>{item.speaker}</strong><span>{item.text}</span></p>)
                : <p className="bm-voice-placeholder">Conversation captions will appear here.</p>}
            </div>
            {message && <p className="bm-voice-message" role="alert">{message}</p>}
            {blocked && <button className="bm-voice-play" onClick={async () => {
              try { await session.current?.resumePlayback(); setBlocked(false); }
              catch { setMessage("Audio playback is blocked. Check your browser's sound permissions."); }
            }}><Volume2 size={16} /> Tap to hear the assistant</button>}
            <div className="bm-voice-controls">
              {!active ? <button className="bm-voice-start" onClick={start}><Mic size={18} /> Start conversation</button> : <>
                <button className="bm-voice-mute" disabled={status === "connecting"} aria-pressed={muted} onClick={() => {
                  session.current?.setMuted(!muted); setMuted(!muted);
                }}>{muted ? <MicOff size={18} /> : <Mic size={18} />}{muted ? "Unmute" : "Mute"}</button>
                <button className="bm-voice-end" onClick={end}><PhoneOff size={18} />{status === "connecting" ? "Cancel" : "End conversation"}</button>
              </>}
            </div>
            <p className="bm-voice-privacy">You're speaking with AI. Starting shares microphone audio and any enabled saved preferences with OpenAI. Captions stay in this tab. Booking details and approved summaries are processed securely; summaries are shared only with your permission. Anonymous quality counts are collected. Close or end to stop. Five-minute sessions.</p>
            <nav className="bm-voice-links" aria-label="Contact BrandMint AI">
              <button onClick={() => openBooking()}>Book consultation</button>
              <a href="/contact" onClick={end}>Contact the team</a>
              <a href="https://wa.me/919972965677" target="_blank" rel="noopener noreferrer" onClick={end}>WhatsApp ↗</a>
            </nav>
          </div>
        </section>
      )}
      <button ref={launcher} className="bm-voice-launcher" aria-expanded={open} aria-haspopup="dialog"
        aria-label={open ? "Close BrandMint AI voice agent" : "Talk to BrandMint AI by voice"}
        onClick={() => open ? close() : setOpen(true)}>
        {open ? <X size={20} /> : <Mic size={20} />}<span>{open ? "Close voice" : "Talk to BrandMint AI"}</span>
      </button>
    </div>
  );
}
