"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import GradientBorder from "@/components/ui/GradientBorder";

export default function CTA() {
  return (
    <section className="py-24 bg-bg relative z-10 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeIn("up", 0.1, 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <GradientBorder borderRadius="rounded-3xl" className="overflow-hidden shadow-2xl">
            <div className="relative p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 bg-surface">
              {/* Radial gradient backing overlay */}
              <div className="absolute inset-0 bg-radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.08) 0%, transparent 60%) pointer-events-none" />
              <div className="absolute inset-0 bg-radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%) pointer-events-none" />

              <div className="flex flex-col gap-4 text-center lg:text-left max-w-xl relative z-10">
                <div className="inline-flex items-center gap-2 self-center lg:self-start px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent-to">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Interactive Telemetry Handshake</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-white leading-tight">
                  Ready to Spin Up Your Next Autonomous Module?
                </h2>
                <p className="text-muted text-sm md:text-base font-light leading-relaxed">
                  Establish a secure connection with our synthesis nodes. Let's model your requirements, configure custom agents, and deploy autonomic software assets.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10 w-full lg:w-auto shrink-0 justify-center">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto group relative flex items-center justify-center gap-1.5 px-8 py-4 rounded-full overflow-hidden text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-accent-from to-accent-to hover:scale-103 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white"
                >
                  <span>Connect Nodes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/solutions"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition-colors text-white"
                >
                  Examine Architecture
                </Link>
              </div>
            </div>
          </GradientBorder>
        </motion.div>
      </div>
    </section>
  );
}
