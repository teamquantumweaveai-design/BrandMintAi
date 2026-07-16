"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, heroWordVariant, heroWordReduced, sectionRevealVariant, sectionRevealReduced, gradientBackgroundVariant, gradientBackgroundReduced, useReducedMotionVariant } from "@/lib/motion";
import GradientText from "@/components/ui/GradientText";
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
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden w-full">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-40 z-0 pointer-events-none" />
      <div className="absolute inset-0 mesh-glow z-0 pointer-events-none" />
      
      {/* Decorative Glow Dot */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-from/10 rounded-full blur-[120px] pointer-events-none" />

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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent-to backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence & Venture Architecture</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={fadeIn("up", 0.1, 0.6)}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white max-w-4xl leading-[1.05]"
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
            className="text-muted text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed font-light"
          >
            {subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeIn("up", 0.3, 0.6)}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 w-full sm:w-auto"
          >
            <Link
              href={ctaHref}
              className="w-full sm:w-auto group relative flex items-center justify-center gap-1.5 px-8 py-4 rounded-full overflow-hidden text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-accent-from to-accent-to hover:scale-103 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] text-white"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/solutions"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition-colors text-white"
            >
              Examine Solutions
            </Link>
          </motion.div>

          {/* Stats Bar */}
          {showStats && (
            <motion.div
              variants={fadeIn("up", 0.4, 0.7)}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-16 mt-16 border-t border-white/5 w-full max-w-5xl"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                  <span className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-muted text-xs font-semibold uppercase tracking-wider">
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
