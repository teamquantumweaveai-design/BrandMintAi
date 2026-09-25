"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { STATS } from "@/lib/constants";

interface HeroProps {
  title: string | React.ReactNode;
  subtitle: string;
  showStats?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export default function Hero({
  title,
  subtitle,
  showStats = false,
  ctaText = "Inquiry Portal",
  ctaHref = "/contact",
}: HeroProps) {
  return (
    <section className="relative min-h-0 sm:min-h-[85vh] lg:min-h-[90vh] flex flex-col items-center justify-start sm:justify-center pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 overflow-hidden w-full bg-[#F8F9FA]">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-50 z-0 pointer-events-none" />
      <div className="absolute inset-0 mesh-glow z-0 pointer-events-none" />
      
      {/* Decorative Warm Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#FF5C35]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6"
        >
          {/* Top Pill badge */}
          <motion.div
            variants={fadeIn("up", 0, 0.5)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] text-xs font-semibold text-[#DF441F] shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5C35]" />
            <span>Autonomous Intelligence & Venture Architecture</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={fadeIn("up", 0.1, 0.6)}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-[#2E384D] max-w-4xl leading-[1.05]"
          >
            {typeof title === "string" ? (
              title
            ) : (
              title
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeIn("up", 0.2, 0.6)}
            className="text-[#516F90] text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed font-normal"
          >
            {subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeIn("up", 0.3, 0.6)}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 w-full sm:w-auto"
          >
            {ctaHref.startsWith("http") ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto group relative flex items-center justify-center gap-1.5 px-8 py-4 rounded-full overflow-hidden text-sm font-semibold transition-all duration-300 bg-[#FF5C35] hover:bg-[#DF441F] hover:shadow-[0_4px_20px_rgba(255,92,53,0.35)] hover:scale-102 text-white"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <Link
                to={ctaHref}
                className="w-full sm:w-auto group relative flex items-center justify-center gap-1.5 px-8 py-4 rounded-full overflow-hidden text-sm font-semibold transition-all duration-300 bg-[#FF5C35] hover:bg-[#DF441F] hover:shadow-[0_4px_20px_rgba(255,92,53,0.35)] hover:scale-102 text-white"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            <Link
              to="/solutions"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 rounded-full border border-[#CBD6E2] bg-white text-sm font-semibold hover:bg-[#F8F9FA] transition-colors text-[#2E384D] shadow-xs"
            >
              Examine Solutions
            </Link>
          </motion.div>

          {/* Stats Bar */}
          {showStats && (
            <motion.div
              variants={fadeIn("up", 0.4, 0.7)}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-16 mt-16 border-t border-[#CBD6E2]/80 w-full max-w-5xl"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                  <span className="text-3xl md:text-4xl font-bold font-display text-[#2E384D] tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[#516F90] text-xs font-semibold uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
