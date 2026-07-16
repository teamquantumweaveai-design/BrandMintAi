"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { VISION_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

export default function VisionPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero
          title={
            <>
              The Horizon of <br />
              <GradientText>Autonomic Meshes</GradientText>
            </>
          }
          subtitle={VISION_COPY.heroSubtitle}
        />

        {/* Timeline Listing */}
        <section className="py-20 bg-bg relative z-10 w-full">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              variants={staggerContainer(0.1, 0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-8 relative before:absolute before:left-4 md:before:left-1/2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10"
            >
              {VISION_COPY.timeline.map((node, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeIn("up", 0, 0.5)}
                    className={`flex flex-col md:flex-row items-stretch gap-8 relative w-full ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Bullet */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-[4px] md:-translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent-to border-2 border-bg ring-4 ring-accent-to/10 top-6 z-20" />

                    {/* Content Panel */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                      <GlowCard className="hover:border-white/10 transition-colors">
                        <div className="flex flex-col gap-2">
                          <span className="font-display font-bold text-3xl text-accent-to">
                            {node.year}
                          </span>
                          <h3 className="text-lg font-bold text-white">
                            {node.goal}
                          </h3>
                          <p className="text-muted text-xs md:text-sm leading-relaxed font-light mt-1">
                            {node.details}
                          </p>
                        </div>
                      </GlowCard>
                    </div>

                    {/* Spacing filler for desktop */}
                    <div className="hidden md:block w-1/2" />
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
