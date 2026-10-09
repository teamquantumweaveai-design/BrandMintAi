import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resolveVoiceContactNavigation } from "./contactNavigation";
import { createBrowserVoice, type VoiceState } from "./browserVoice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Mic,
  Square,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Cpu,
  CheckCircle2,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
  actionButtons?: {
    label: string;
    href?: string;
    isExternal?: boolean;
    onClickPrompt?: string;
  }[];
}

const DEFAULT_PROMPTS = [
  { label: "🚀 AI & Automation Solutions", prompt: "Tell me about your AI and Automation solutions." },
  { label: "🧬 What is Quantum Weave™?", prompt: "What is Quantum Weave and how does it work?" },
  { label: "📊 Quantum Growth Scan™", prompt: "How does the Quantum Growth Scan work?" },
  { label: "💼 Venture Building Ecosystem", prompt: "Explain BrandMint's Venture Building model." },
  { label: "📅 Book a Discovery Call", prompt: "How can I book a discovery consultation?" },
  { label: "💬 Connect on WhatsApp", prompt: "Can I speak directly to the team on WhatsApp?" },
];

const KNOWLEDGE_RESPONSES: {
  keywords: string[];
  reply: string;
  actionButtons?: { label: string; href?: string; isExternal?: boolean; onClickPrompt?: string }[];
}[] = [
  {
    keywords: ["solution", "service", "automate", "automation", "workflow", "n8n", "crm", "lead"],
    reply:
      "BrandMint AI specializes in high-impact AI and automation infrastructure for modern businesses:\n\n• **WhatsApp-led Lead Gen & CRM**: Automate client onboarding, lead qualification, and instant follow-ups.\n• **AI Agent Operations**: Deploy custom autonomous agents for customer support, intake, and scheduling.\n• **Business Process Automation**: Eliminate manual data transfers and repetitive operations.\n• **Performance Architecture**: End-to-end digital sales funnels built for sustainable ROI.",
    actionButtons: [
      { label: "Explore Solutions", href: "/solutions" },
      { label: "Book Consultation", href: "/contact" },
      { label: "Chat on WhatsApp", href: "https://wa.me/919972965677", isExternal: true },
    ],
  },
  {
    keywords: ["quantum", "weave", "quantumweave", "platform", "neural", "framework"],
    reply:
      "**Quantum Weave™** is our proprietary enterprise intelligence architecture. It interconnects disparate business tools, data pipelines, and conversational AI into a unified, autonomous nervous system.\n\nKey capabilities include:\n• Cross-platform process synchronization\n• Continuous predictive intelligence & lead routing\n• Zero-click scheduling and automated handoffs",
    actionButtons: [
      { label: "Explore Quantum Weave", href: "https://quantumweaveai.io/", isExternal: true },
      { label: "Learn More on Website", href: "/quantum-weave" },
    ],
  },
  {
    keywords: ["scan", "growth scan", "audit", "90-day", "business growth"],
    reply:
      "The **Quantum Growth Scan™** is our diagnostic assessment that identifies revenue leaks, operational friction points, and automation opportunities within your business.\n\n• **360° Diagnostic**: Process, tech stack, and customer acquisition audit.\n• **90-Day Execution Roadmap**: Step-by-step milestones to scale with AI.\n• **Guaranteed ROI Focus**: Concrete leverage without bloated overhead.",
    actionButtons: [
      { label: "Get Growth Scan", href: "/business-growth" },
      { label: "Schedule Call", href: "/contact" },
    ],
  },
  {
    keywords: ["venture", "portfolio", "ecosystem", "investment", "ip"],
    reply:
      "BrandMint AI operates an active **Venture Studio** alongside client transformation. We incubate and co-build proprietary platforms designed for exponential leverage:\n\n• **Community Commerce Platforms**\n• **Automation & Agent Frameworks**\n• **High-Retention Knowledge Assets & IP Portfolios**",
    actionButtons: [
      { label: "Explore Ventures", href: "/ventures" },
      { label: "Partner With Us", href: "/contact" },
    ],
  },
  {
    keywords: ["book", "call", "consult", "consultation", "meeting", "contact", "schedule", "pricing", "cost"],
    reply:
      "You can book a 1-on-1 strategic discovery session with our core team. We'll review your current processes and map out immediate automation and growth opportunities.",
    actionButtons: [
      { label: "Book Discovery Call", href: "/contact" },
      { label: "Quick WhatsApp Call/Chat", href: "https://wa.me/919972965677", isExternal: true },
    ],
  },
  {
    keywords: ["whatsapp", "phone", "number", "talk", "chat", "direct", "human"],
    reply:
      "You can reach our team directly on WhatsApp at **+91 99729 65677** for immediate inquiries, discovery call scheduling, or custom inquiries.",
    actionButtons: [
      { label: "Open WhatsApp Chat", href: "https://wa.me/919972965677", isExternal: true },
    ],
  },
  {
    keywords: ["academy", "learn", "course", "training", "workshop"],
    reply:
      "**BrandMint Academy** provides hands-on operator workshops and systems playbooks for leaders and teams. We teach you how to build, document, and deploy production AI and automation systems inside your company.",
    actionButtons: [
      { label: "View Academy", href: "/academy" },
    ],
  },
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "msg-init",
  sender: "agent",
  text: "Hello! 👋 I'm your **BrandMint Custom AI Agent**.\n\nI can help you explore our solutions, review **Quantum Weave™**, get your **Quantum Growth Scan™**, or book a discovery consultation. How can I help you today?",
  timestamp: "Just now",
  actionButtons: [
    { label: "Explore Solutions", href: "/solutions" },
    { label: "Book Discovery Call", href: "/contact" },
    { label: "Talk on WhatsApp", href: "https://wa.me/919972965677", isExternal: true },
  ],
};

export default function CustomAiAgentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  const responseTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const voiceRef = useRef<ReturnType<typeof createBrowserVoice> | null>(null);
  const sendRef = useRef<(text: string, speakReply: (reply: string) => void, signal: AbortSignal) => void>(() => {});
  const [voice, setVoice] = useState<VoiceState>({ status: "idle", supported: false, message: "", transcript: "" });

  const cancelPendingReplies = () => {
    responseTimers.current.forEach(clearTimeout);
    responseTimers.current.clear();
  };

  useEffect(() => {
    mountedRef.current = true;
    const controller = createBrowserVoice(setVoice, (text, speakReply, signal) => sendRef.current(text, speakReply, signal));
    voiceRef.current = controller;
    const stopForPageHide = () => controller.stop();
    const stopWhenHidden = () => { if (document.hidden) controller.stop(); };
    window.addEventListener("pagehide", stopForPageHide);
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => {
      window.removeEventListener("pagehide", stopForPageHide);
      document.removeEventListener("visibilitychange", stopWhenHidden);
      mountedRef.current = false;
      controller.dispose();
      voiceRef.current = null;
      cancelPendingReplies();
    };
  }, []);

  useEffect(() => {
    setIsTyping(false);
    const focusTimer = isOpen ? setTimeout(() => inputRef.current?.focus(), 150) : undefined;
    return () => {
      clearTimeout(focusTimer);
      voiceRef.current?.stop();
      cancelPendingReplies();
    };
  }, [isOpen, location.key]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string, speakReply?: (reply: string) => void, signal?: AbortSignal) => {
    const text = (textToSend || inputValue).trim();
    if (!text || !isOpen || signal?.aborted) return;
    // Typed messages and quick prompts use the same answer path and remain silent.
    if (!speakReply) voiceRef.current?.stop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    // Simulate thoughtful AI response
    const responseTimer = setTimeout(() => {
      responseTimers.current.delete(responseTimer);
      signal?.removeEventListener("abort", cancelVoiceReply);
      if (signal?.aborted) return;
      const lower = text.toLowerCase();
      let matchedResponse = KNOWLEDGE_RESPONSES.find((item) =>
        item.keywords.some((kw) => lower.includes(kw))
      );

      let replyText = "";
      let actionButtons = undefined;

      if (matchedResponse) {
        replyText = matchedResponse.reply;
        actionButtons = matchedResponse.actionButtons;
      } else {
        replyText =
          "Thanks for reaching out! At BrandMint AI, we build integrated systems covering AI automation, venture building, and high-velocity business scaling.\n\nWould you like to book a quick discovery consultation or speak directly with our team on WhatsApp?";
        actionButtons = [
          { label: "Book a Consultation", href: "/contact" },
          { label: "Chat on WhatsApp", href: "https://wa.me/919972965677", isExternal: true },
          { label: "View Our Solutions", href: "/solutions" },
        ];
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionButtons,
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(responseTimers.current.size > 0);
      // Voice-only explicit commands use the existing destination and keep the
      // exact existing answer/history. This opens Contact; it never books a call.
      const voiceDestination = speakReply ? resolveVoiceContactNavigation(text) : null;
      if (voiceDestination) {
        handleClose();
        if (location.pathname !== voiceDestination) navigate(voiceDestination);
        return;
      }
      speakReply?.(agentMsg.text);
    }, 650);
    const cancelVoiceReply = () => {
      clearTimeout(responseTimer);
      responseTimers.current.delete(responseTimer);
      if (mountedRef.current) setIsTyping(responseTimers.current.size > 0);
    };
    signal?.addEventListener("abort", cancelVoiceReply, { once: true });
    responseTimers.current.add(responseTimer);
  };
  sendRef.current = handleSendMessage;

  const handleStopVoice = () => {
    voiceRef.current?.stop();
  };

  const handleClose = () => {
    handleStopVoice();
    cancelPendingReplies();
    setIsTyping(false);
    onClose();
  };

  const handleResetChat = () => {
    handleStopVoice();
    cancelPendingReplies();
    setIsTyping(false);
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `msg-init-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[calc(100vh-7.5rem)] rounded-2xl bg-white shadow-2xl shadow-[#2E384D]/25 border border-[#CBD6E2] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-[#2D3E50] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#CBD6E2]/20">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5C35] via-[#FF7A59] to-[#DF441F]" />

            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5C35] to-[#DF441F] text-white shadow-md shadow-[#FF5C35]/30">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366] border border-[#2D3E50]"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-white tracking-tight">
                    BrandMint AI Agent
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#FF5C35]/20 text-[#FF7A59] border border-[#FF5C35]/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-white/70 font-sans flex items-center gap-1">
                  <span>Quantum Weave™ Autonomous Assistant</span>
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                title="Close chat"
                aria-label="Close chat"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA]/60 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#FF5C35] to-[#DF441F] text-white rounded-br-xs shadow-xs"
                      : "bg-white text-[#2E384D] border border-[#CBD6E2]/80 rounded-bl-xs shadow-xs"
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">
                    {msg.text.split("\n").map((line, idx) => {
                      // Formatting simple markdown-style bold tags
                      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "$1");
                      return (
                        <p key={idx} className={line.startsWith("•") ? "pl-2 py-0.5" : "py-0.5"}>
                          {line.includes("**") ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: line.replace(
                                  /\*\*(.*?)\*\*/g,
                                  '<strong class="font-bold text-[#FF5C35]">$1</strong>'
                                ),
                              }}
                            />
                          ) : (
                            line
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Action Buttons attached to message */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.actionButtons.map((btn, bIdx) => {
                      if (btn.isExternal) {
                        return (
                          <a
                            key={bIdx}
                            href={btn.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#CBD6E2] text-[#2E384D] hover:text-[#FF5C35] hover:border-[#FF5C35]/50 hover:bg-[#FF5C35]/5 transition-all shadow-xs"
                          >
                            {btn.label}
                            <ExternalLink className="w-3 h-3 text-[#516F90]" />
                          </a>
                        );
                      }
                      if (btn.href) {
                        return (
                          <Link
                            key={bIdx}
                            to={btn.href}
                            onClick={handleClose}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2E384D] text-white hover:bg-[#FF5C35] transition-all shadow-xs"
                          >
                            {btn.label}
                            <ArrowRight className="w-3 h-3 text-white/70" />
                          </Link>
                        );
                      }
                      return (
                        <button
                          key={bIdx}
                          onClick={() => btn.onClickPrompt && handleSendMessage(btn.onClickPrompt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#CBD6E2] text-[#2E384D] hover:bg-black/5 transition-all"
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <span className="text-[10px] text-[#516F90] mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-2.5 bg-white border border-[#CBD6E2] rounded-2xl rounded-bl-xs w-20 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#FF5C35] animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 rounded-full bg-[#FF5C35] animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 rounded-full bg-[#FF5C35] animate-bounce"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel/Pills */}
          <div className="px-3 py-2 bg-white border-t border-[#CBD6E2]/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#516F90] mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF5C35]" /> Quick Queries
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {DEFAULT_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F1F3F5] text-[#2E384D] hover:bg-[#FF5C35]/10 hover:text-[#FF5C35] border border-transparent hover:border-[#FF5C35]/30 transition-all shrink-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* One opt-in mic click starts continuous, interruptible voice. */}
          <div className="px-3 pt-2 bg-white text-[11px] text-[#516F90]">
            <p id="agent-voice-help">{voice.supported
              ? "Tap the mic for hands-free conversation. Audio is sent to OpenAI; replies use an AI-generated OpenAI voice. Speak to interrupt; use headphones to reduce echo."
              : "Voice input is unavailable in this browser. Text chat still works."}</p>
            <p role="status" aria-live="polite" aria-atomic="true" className="mt-1">
              {voice.message}
            </p>
            {voice.transcript && <p className="mt-1 truncate">Heard: {voice.transcript}</p>}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#CBD6E2] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask our AI Agent anything..."
              className="min-w-0 flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#CBD6E2] focus:outline-hidden focus:ring-2 focus:ring-[#FF5C35]/40 focus:border-[#FF5C35] bg-[#F8F9FA] text-[#2E384D] placeholder:text-[#516F90]/60 transition-all"
            />
            <button
              type="button"
              onClick={() => voice.status === "idle" ? voiceRef.current?.start() : handleStopVoice()}
              disabled={voice.status === "idle" && (!voice.supported || isTyping)}
              aria-label={voice.status === "idle" ? "Start voice input" : "Stop voice"}
              aria-describedby="agent-voice-help"
              aria-pressed={voice.status !== "idle"}
              title={voice.status === "idle" ? "Ask by voice" : "Stop voice"}
              className="flex items-center justify-center gap-1 h-9 min-w-9 px-2 rounded-xl border border-[#CBD6E2] text-[#FF5C35] hover:bg-[#FF5C35]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {voice.status === "idle" ? <Mic className="w-4 h-4" /> : <><Square className="w-3 h-3" /><span className="text-xs">Stop</span></>}
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Send message"
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-r from-[#FF5C35] to-[#DF441F] text-white shadow-md shadow-[#FF5C35]/25 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Direct WhatsApp Fast Footer */}
          <div className="bg-[#F8F9FA] px-3 py-1.5 border-t border-[#CBD6E2]/40 flex items-center justify-between text-[11px] text-[#516F90]">
            <span>Need immediate human assistance?</span>
            <a
              href="https://wa.me/919972965677?text=Hi%20BrandMint%20AI%2C%20I%20would%20like%20to%20speak%20with%20a%20representative."
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#25D366] hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp Now
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
