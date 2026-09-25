import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, X } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import CustomAiAgentModal from "./CustomAiAgentModal";

export default function FloatingButtons() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAiModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Show a gentle greeting nudge bubble once after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Interactive Custom AI Agent Chat Modal */}
      <CustomAiAgentModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Floating Buttons Stack (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none pointer-events-auto">
        
        {/* Subtle Welcome Hint Bubble (shown once after delay if modal isn't open) */}
        <AnimatePresence>
          {hasPrompted && !isAiModalOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative hidden md:flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 text-xs font-medium text-[#2E384D] shadow-xl border border-[#CBD6E2] max-w-xs"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#FF5C35] animate-ping" />
              <span>Need help? Ask our <strong>Custom AI Agent</strong> or talk on <strong>WhatsApp</strong>!</span>
              <button
                onClick={() => setHasPrompted(false)}
                className="ml-1 text-[#516F90] hover:text-[#2E384D] p-0.5"
                title="Dismiss"
                aria-label="Dismiss notice"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Pointer triangle */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-white border-r border-b border-[#CBD6E2]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Floating Action Button */}
        <WhatsAppButton
          phoneNumber="919972965677"
          defaultMessage="Hi BrandMint AI! I'm reaching out from your website to learn more about your AI, automation, and business growth solutions."
        />

        {/* Custom AI Agent Floating Action Button */}
        <div className="relative group">
          <motion.button
            onClick={() => {
              setIsAiModalOpen((prev) => !prev);
              setHasPrompted(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open Custom AI Agent"
            className="relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF5C35] via-[#FF7A59] to-[#DF441F] px-4 py-3 text-white shadow-xl shadow-[#FF5C35]/35 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF5C35]/50 focus:outline-hidden focus:ring-4 focus:ring-[#FF5C35]/30 cursor-pointer"
          >
            {/* Glowing Ring Effect */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF5C35] to-[#DF441F] opacity-30 blur-xs group-hover:opacity-60 transition duration-300 pointer-events-none" />

            <div className="relative flex items-center justify-center">
              {isAiModalOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <div className="relative">
                  <Bot className="w-5 h-5 text-white" />
                  <Sparkles className="w-2.5 h-2.5 text-yellow-300 absolute -top-1 -right-1 animate-spin [animation-duration:4s]" />
                </div>
              )}
            </div>

            <span className="font-display font-semibold text-xs tracking-wide text-white">
              {isAiModalOpen ? "Close Agent" : "Custom AI Agent"}
            </span>

            {/* Live Indicator Pill */}
            {!isAiModalOpen && (
              <span className="flex items-center gap-1 rounded-full bg-black/20 px-1.5 py-0.5 text-[10px] font-bold text-white/95">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                <span>AI</span>
              </span>
            )}
          </motion.button>
        </div>

      </div>
    </>
  );
}
