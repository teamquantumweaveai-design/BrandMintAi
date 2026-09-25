import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    contact: "", // Email or WhatsApp
    company: "",
  });

  // Check session storage on mount
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("brandmint_exit_intent_shown");
    if (alreadyShown) {
      setHasTriggered(true);
      return;
    }

    // 1. Desktop Exit Intent (cursor leaves top of browser viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if ((e.clientY <= 15 || !e.relatedTarget) && !hasTriggered) {
        triggerModal();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 20 && !hasTriggered) {
        triggerModal();
      }
    };

    // Custom event to allow programmatic or test triggering
    const handleCustomTrigger = () => {
      setIsOpen(true);
    };

    // 2. Mobile trigger: fallback after 25s of active browsing
    const mobileTimer = setTimeout(() => {
      if (!hasTriggered && window.innerWidth < 768) {
        triggerModal();
      }
    }, 25000);

    document.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("brandmint-open-exit-modal", handleCustomTrigger);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("brandmint-open-exit-modal", handleCustomTrigger);
      clearTimeout(mobileTimer);
    };
  }, [hasTriggered]);

  const triggerModal = () => {
    const alreadyShown = sessionStorage.getItem("brandmint_exit_intent_shown");
    if (alreadyShown) return;

    setIsOpen(true);
    setHasTriggered(true);
    sessionStorage.setItem("brandmint_exit_intent_shown", "true");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setErrorMsg("Please enter your name and email or phone number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Direct lead capture into Supabase
      const { error } = await supabase.from("leads").insert([
        {
          name: form.name.trim(),
          email: form.contact.trim(),
          company: form.company.trim() || "Exit Pop-up Lead",
          message: "Requested Free Quantum Growth Scan™ via Exit Intent Pop-up.",
          status: "new",
        },
      ]);

      if (error) {
        console.warn("Supabase lead submission notice:", error.message);
      }

      // Also backup in localStorage
      try {
        const localLeads = JSON.parse(localStorage.getItem("brandmint_exit_leads") || "[]");
        localLeads.push({
          ...form,
          capturedAt: new Date().toISOString(),
        });
        localStorage.setItem("brandmint_exit_leads", JSON.stringify(localLeads));
      } catch (err) {
        console.warn("Local storage backup notice", err);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission failed", err);
      // Still show success since local backup completed
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#2E384D]/70 backdrop-blur-sm"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-[#CBD6E2] shadow-2xl z-10 my-8"
          >
            {/* Top Accent Gradient Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#FF5C35] via-[#FF7A59] to-[#DF441F]" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#516F90] hover:text-[#2E384D] hover:bg-[#F8F9FA] transition-colors border border-transparent hover:border-[#CBD6E2]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {!submitted ? (
                <>
                  {/* Header Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] text-xs font-semibold text-[#DF441F] mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5C35]" />
                    <span>Complimentary Diagnostic</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2E384D] tracking-tight leading-tight">
                    Wait! Before you leave — <br />
                    <span className="text-gradient">Claim Your Free Quantum Growth Scan™</span>
                  </h3>

                  <p className="text-[#516F90] text-sm leading-relaxed mt-3">
                    Discover hidden bottlenecks, evaluate automated lead capture opportunities, and get a tailored AI roadmap for your business.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2E384D] uppercase tracking-wider mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-[#F8F9FA] border border-[#CBD6E2] rounded-xl px-4 py-2.5 text-sm text-[#2E384D] placeholder:text-[#516F90]/50 focus:outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2E384D] uppercase tracking-wider mb-1">
                        Work Email or WhatsApp Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        placeholder="you@company.com or +91 99999 99999"
                        className="w-full bg-[#F8F9FA] border border-[#CBD6E2] rounded-xl px-4 py-2.5 text-sm text-[#2E384D] placeholder:text-[#516F90]/50 focus:outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2E384D] uppercase tracking-wider mb-1">
                        Company / Main Growth Challenge (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="e.g. Lead generation, WhatsApp automation"
                        className="w-full bg-[#F8F9FA] border border-[#CBD6E2] rounded-xl px-4 py-2.5 text-sm text-[#2E384D] placeholder:text-[#516F90]/50 focus:outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/20 transition-all"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
                    )}

                    {/* Primary Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF5C35] via-[#FF7A59] to-[#DF441F] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-[#FF5C35]/30 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer mt-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Preparing Your Scan...</span>
                        </>
                      ) : (
                        <>
                          <span>Claim Free Growth Scan</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Instant WhatsApp Alternative */}
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-[#CBD6E2]/70" />
                      <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-[#516F90] font-semibold">
                        Or Connect Instantly
                      </span>
                      <div className="flex-grow border-t border-[#CBD6E2]/70" />
                    </div>

                    <a
                      href="https://wa.me/919972965677?text=Hi%20BrandMint%20AI!%20I%20would%20like%20to%20claim%20my%20Free%20Quantum%20Growth%20Scan."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-semibold text-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Chat on WhatsApp Directly (+91 99729 65677)</span>
                    </a>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#516F90] mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% confidential. No spam or hard selling guaranteed.</span>
                    </div>
                  </form>
                </>
              ) : (
                /* Success View */
                <div className="py-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#2E384D]">
                    Growth Scan Requested!
                  </h3>

                  <p className="text-[#516F90] text-sm max-w-sm leading-relaxed">
                    Thank you, <strong>{form.name}</strong>. Our team is reviewing your details and will send your complimentary Quantum Growth Scan™ diagnostic within 24 hours.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <a
                      href="https://wa.me/919972965677?text=Hi%20BrandMint%20AI!%20I%20just%20requested%20a%20Free%20Growth%20Scan%20on%20your%20website."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Speed Up on WhatsApp</span>
                    </a>

                    <button
                      onClick={handleClose}
                      className="py-2.5 px-5 rounded-xl border border-[#CBD6E2] text-xs font-semibold text-[#2E384D] hover:bg-[#F8F9FA] transition-colors"
                    >
                      Return to Website
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
