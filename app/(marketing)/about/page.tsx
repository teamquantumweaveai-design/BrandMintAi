"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { ABOUT_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { ShieldCheck, Cpu, Terminal } from "lucide-react";

export default function AboutPage() {
  const iconPillarMap = [ShieldCheck, Cpu, Terminal];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero
          title={
            <>
              Architecting the Future of <br />
              <GradientText>Enterprise Velocity</GradientText>
            </>
          }
          subtitle={ABOUT_COPY.heroSubtitle}
        />

        {/* Content Section */}
        <section className="py-20 bg-bg relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={staggerContainer(0.1, 0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <span className="text-xs uppercase font-semibold text-accent-to tracking-widest">
                Our Genesis
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
                Engineering Digital Conglomerates
              </h2>
              {ABOUT_COPY.paragraphs.map((p, i) => (
                <p key={i} className="text-muted text-sm md:text-base leading-relaxed font-light">
                  {p}
                </p>
              ))}
            </motion.div>

            {/* Premium visual wireframe/abstract grid */}
            <div className="relative p-1 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl border border-white/5 overflow-hidden h-[300px] md:h-[400px]">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-px bg-surface rounded-3xl flex items-center justify-center overflow-hidden">
                {/* Visual Glow Core */}
                <div className="absolute w-[200px] h-[200px] bg-accent-from/20 rounded-full blur-[80px]" />
                <div className="z-10 text-center">
                  <span className="font-mono text-xs text-accent-to tracking-wider block mb-2">SYSTEM STATE: NOMINAL</span>
                  <span className="font-display text-xl text-white font-bold tracking-tight">BRANDMINT CORE LABS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars Section */}
        <section className="py-20 bg-surface/50 w-full relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase font-semibold text-accent-to tracking-widest block mb-3">Foundational Architecture</span>
              <h2 className="text-3xl font-bold font-display text-white">The Three Pillars of BrandMint</h2>
            </div>

            <motion.div
              variants={staggerContainer(0.08, 0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {ABOUT_COPY.pillars.map((pillar, i) => {
                const Icon = iconPillarMap[i];
                return (
                  <motion.div key={i} variants={fadeIn("up", 0, 0.5)}>
                    <GlowCard className="h-full hover:border-white/10 transition-colors">
                      <div className="flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent-to">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold font-display text-white mt-2">
                          {pillar.title}
                        </h3>
                        <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                          {pillar.desc}
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
