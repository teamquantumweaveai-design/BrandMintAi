"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { QUANTUM_WEAVE_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { Cpu, RefreshCcw, Layers } from "lucide-react";

export default function QuantumWeavePage() {
  const specIcons = [RefreshCcw, Cpu, Layers];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero
          title={
            <>
              The Quantum-Weave <br />
              <GradientText>Integration Engine</GradientText>
            </>
          }
          subtitle={QUANTUM_WEAVE_COPY.heroSubtitle}
        />

        {/* Intro Block */}
        <section className="py-16 bg-bg relative z-10 w-full">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.p
              variants={fadeIn("up", 0.1, 0.6)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-muted text-base md:text-lg leading-relaxed font-light"
            >
              {QUANTUM_WEAVE_COPY.intro}
            </motion.p>
          </div>
        </section>

        {/* Specs Details */}
        <section className="py-16 bg-bg relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={staggerContainer(0.08, 0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {QUANTUM_WEAVE_COPY.specs.map((spec, idx) => {
                const Icon = specIcons[idx];
                return (
                  <motion.div key={idx} variants={fadeIn("up", 0, 0.5)}>
                    <GlowCard className="h-full hover:border-white/10 transition-colors">
                      <div className="flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent-to">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold font-display text-white mt-2">
                          {spec.title}
                        </h3>
                        <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                          {spec.desc}
                        </p>
                      </div>
                    </GlowCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
