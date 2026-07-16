"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import GlowCard from "@/components/ui/GlowCard";
import { CORE_FEATURES } from "@/lib/constants";
import * as LucideIcons from "lucide-react";

export default function FeatureGrid() {
  return (
    <section className="py-24 bg-bg relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center flex flex-col gap-4 mb-20">
          <motion.span
            variants={fadeIn("up", 0.1, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-xs uppercase font-semibold text-accent-to tracking-widest"
          >
            Capabilities Suite
          </motion.span>
          <motion.h2
            variants={fadeIn("up", 0.2, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white"
          >
            Autonomous Systems Architecture
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.3, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-muted text-sm md:text-base max-w-xl mx-auto"
          >
            We deploy modular business nodes designed to execute transactions, audit codebases, and optimize operational velocity autonomously.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {CORE_FEATURES.map((feature, index) => {
            // Dynamically lookup the Lucide icon component
            const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.HelpCircle;

            return (
              <motion.div key={index} variants={fadeIn("up", 0, 0.5)}>
                <GlowCard className="h-full flex flex-col justify-between hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-to group-hover:text-accent-from transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white mt-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
