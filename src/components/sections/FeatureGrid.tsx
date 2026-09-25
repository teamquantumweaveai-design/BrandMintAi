"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import GlowCard from "@/components/ui/GlowCard";
import { WHY_BRANDMINT_COPY } from "@/lib/constants";
import * as LucideIcons from "lucide-react";

export default function FeatureGrid() {
  return (
    <section className="py-24 bg-[#F8F9FA] relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center flex flex-col gap-4 mb-20">
          <motion.span
            variants={fadeIn("up", 0.1, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest"
          >
            Capabilities Suite
          </motion.span>
          <motion.h2
            variants={fadeIn("up", 0.2, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]"
          >
            Autonomous Systems Architecture
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.3, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-[#516F90] text-sm md:text-base max-w-xl mx-auto"
          >
            We deploy modular business systems designed to streamline operations, automate repetitive workflows, and accelerate business growth.
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
          {WHY_BRANDMINT_COPY.pillars.map((feature, index) => {
            // Dynamically lookup the Lucide icon component
            const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.HelpCircle;

            return (
              <motion.div key={index} variants={fadeIn("up", 0, 0.5)}>
                <GlowCard className="h-full flex flex-col justify-between transition-all">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5C35] transition-colors shadow-xs">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-[#2E384D] mt-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#516F90] text-sm leading-relaxed font-normal">
                      {feature.desc}
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
