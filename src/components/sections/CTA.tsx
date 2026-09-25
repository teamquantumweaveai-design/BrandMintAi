"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

export default function CTA() {
  return (
    <section className="py-24 bg-[#F8F9FA] relative z-10 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeIn("up", 0.1, 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#0D3330] border border-[#0D3330]">
            <div className="relative p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
              {/* Subtle radial highlights */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5C35]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D3E50]/40 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col gap-4 text-center lg:text-left max-w-xl relative z-10">
                <div className="inline-flex items-center gap-2 self-center lg:self-start px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF7A59]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight !text-white leading-tight">
                  Ready to Build Systems That Scale Your Business?
                </h2>
                <p className="text-[#A5C4BD] text-sm md:text-base font-light leading-relaxed">
                  Let's discuss your workflows, automate repetitive operations, and build practical systems tailored for sustainable, long-term growth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10 w-full lg:w-auto shrink-0 justify-center">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto group relative flex items-center justify-center gap-1.5 px-8 py-4 rounded-full overflow-hidden text-sm font-semibold transition-all duration-300 bg-[#FF5C35] hover:bg-[#DF441F] hover:shadow-[0_4px_20px_rgba(255,92,53,0.4)] text-white"
                >
                  <span>Schedule Consultation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/solutions"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 rounded-full border border-white/25 bg-white/10 text-sm font-semibold hover:bg-white/20 transition-colors text-white"
                >
                  Explore Solutions
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
