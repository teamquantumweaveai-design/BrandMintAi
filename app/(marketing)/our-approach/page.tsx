"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { APPROACH_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

export default function ApproachPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero
          title={
            <>
              The Autonomic <br />
              <GradientText>Synthesis Cycle</GradientText>
            </>
          }
          subtitle={APPROACH_COPY.heroSubtitle}
        />

        {/* Timeline Stepper Section */}
        <section className="py-20 bg-bg relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={staggerContainer(0.1, 0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {APPROACH_COPY.steps.map((step, idx) => (
                <motion.div key={idx} variants={fadeIn("up", 0, 0.5)}>
                  <GlowCard className="h-full hover:border-white/10 transition-colors">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-5xl text-accent-to/30">
                          {step.number}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-accent-to uppercase tracking-widest">
                          {step.phase}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold font-display text-white">
                          {step.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed font-light">
                          {step.description}
                        </p>
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
