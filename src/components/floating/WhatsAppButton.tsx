import React, { useState } from "react";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppButton({
  phoneNumber = "919972965677",
  defaultMessage = "Hi BrandMint AI! I am interested in exploring your AI, automation, and business growth solutions.",
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(defaultMessage);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return (
    <div
      className="relative flex items-center justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip on Desktop */}
      <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.95 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 10,
          scale: isHovered ? 1 : 0.95,
        }}
        transition={{ duration: 0.15 }}
        className={`pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#2D3E50] px-3.5 py-2 text-xs font-medium text-white shadow-xl border border-white/10 hidden sm:flex items-center gap-2 z-10`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
        </span>
        <span>Talk on WhatsApp</span>
        <span className="text-white/60 font-mono text-[11px]">+91 99729 65677</span>
      </motion.div>

      {/* Button Link */}
      <motion.a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/35 transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-[#25D366]/50 focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/30"
      >
        {/* Pulsing Aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/20 animate-pulse group-hover:bg-[#25D366]/30 transition-all pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="currentColor"
          className="relative z-10 transition-transform duration-300 group-hover:rotate-6"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.15-.176.2-.301.301-.502.101-.2.05-.376-.025-.527-.075-.15-.677-1.63-.928-2.234-.244-.588-.493-.509-.677-.518-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.909 1.229 3.11c.15.2 2.123 3.243 5.144 4.548.719.31 1.28.496 1.718.635.722.23 1.379.197 1.899.12.58-.087 1.78-.727 2.03-1.429.25-.702.25-1.304.176-1.429-.075-.126-.276-.201-.577-.351z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.521 5.845L.055 23.354c-.113.418.26.804.673.687l5.632-1.442C8.04 23.518 9.972 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.879 0-3.64-.528-5.15-1.444l-.369-.222-3.829.98 1.006-3.708-.242-.382C2.477 15.69 2 13.9 2 12 2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
        </svg>

        {/* Active Ping Indicator */}
        <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#128C7E] border-2 border-white"></span>
        </span>
      </motion.a>
    </div>
  );
}
