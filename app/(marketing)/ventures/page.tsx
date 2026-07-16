"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { VENTURES_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { Activity, Flame, ShieldAlert, CheckSquare } from "lucide-react";

export default function VenturesPage() {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "incubating":
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case "active (series a)":
        return <Activity className="w-3.5 h-3.5 text-accent-to" />;
      case "exited (acquired)":
        return <CheckSquare className="w-3.5 h-3.5 text-green-400" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-muted" />;
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero
          title={
            <>
              Autonomic Venture <br />
              <GradientText>Portfolio Holdings</GradientText>
            </>
          }
          subtitle={VENTURES_COPY.heroSubtitle}
        />

        {/* Portfolio Listing */}
        <section className="py-20 bg-bg relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={staggerContainer(0.08, 0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {VENTURES_COPY.ventures.map((venture, idx) => (
                <motion.div key={idx} variants={fadeIn("up", 0, 0.5)}>
                  <GlowCard className="h-full hover:border-white/10 transition-colors">
                    <div className="flex flex-col justify-between h-full gap-8">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-2xl font-bold font-display text-white">
                            {venture.name}
                          </h3>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white">
                            {getStatusIcon(venture.status)}
                            <span>{venture.status}</span>
                          </div>
                        </div>

                        <span className="text-accent-to text-xs font-mono font-medium block">
                          {venture.tagline}
                        </span>

                        <p className="text-muted text-sm leading-relaxed font-light mt-2">
                          {venture.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted">
                          Performance Telemetry
                        </span>
                        <span className="text-xs font-mono font-semibold text-white">
                          {venture.metrics}
                        </span>
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
