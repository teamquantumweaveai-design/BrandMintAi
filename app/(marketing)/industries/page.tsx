"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { INDUSTRIES_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { Landmark, Compass, HeartPulse, Zap } from "lucide-react";

export default function IndustriesPage() {
  const sectorIcons = [Landmark, Compass, HeartPulse, Zap];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero
          title={
            <>
              Deployments Across <br />
              <GradientText>Key Industries</GradientText>
            </>
          }
          subtitle={INDUSTRIES_COPY.heroSubtitle}
        />

        {/* Sectors Grid */}
        <section className="py-20 bg-bg relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={staggerContainer(0.08, 0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {INDUSTRIES_COPY.sectors.map((sector, idx) => {
                const Icon = sectorIcons[idx];
                return (
                  <motion.div key={idx} variants={fadeIn("up", 0, 0.5)}>
                    <GlowCard className="h-full hover:border-white/10 transition-colors">
                      <div className="flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent-to">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold font-display text-white mt-2">
                          {sector.name}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed font-light">
                          {sector.desc}
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
