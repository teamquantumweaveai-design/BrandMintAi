"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { SOLUTIONS_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero
          title={
            <>
              Cognitive & Autonomic <br />
              <GradientText>Enterprise Architecture</GradientText>
            </>
          }
          subtitle={SOLUTIONS_COPY.heroSubtitle}
        />

        {/* Detailed Solutions Grid */}
        <section className="py-20 bg-bg relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={staggerContainer(0.1, 0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-12"
            >
              {SOLUTIONS_COPY.solutions.map((sol, index) => (
                <motion.div key={index} variants={fadeIn("up", 0, 0.5)}>
                  <GlowCard className="p-8 md:p-12 hover:border-white/10 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: General Info */}
                      <div className="lg:col-span-2 flex flex-col gap-4">
                        <span className="font-mono text-xs text-accent-to uppercase tracking-widest block">
                          MODULE {index + 1}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold font-display text-white">
                          {sol.title}
                        </h3>
                        <p className="text-muted text-sm md:text-base leading-relaxed font-light mt-2 max-w-2xl">
                          {sol.desc}
                        </p>
                      </div>

                      {/* Right: Technical Features */}
                      <div className="flex flex-col gap-4 bg-white/5 border border-white/5 rounded-2xl p-6 lg:p-8">
                        <span className="text-xs uppercase font-semibold text-white tracking-wide">
                          Subsystem Deliverables
                        </span>
                        <ul className="flex flex-col gap-3">
                          {sol.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-muted">
                              <CheckCircle2 className="w-4.5 h-4.5 text-accent-to shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
