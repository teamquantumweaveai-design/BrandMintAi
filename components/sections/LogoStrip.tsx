"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { Atom, Box, Layers, Link2, Puzzle, Target } from "lucide-react";

const DUMMY_LOGOS = [
  { name: "Nova Ledger", icon: Atom },
  { name: "Apex Flow", icon: Box },
  { name: "Stratum Sys", icon: Layers },
  { name: "LinkMesh", icon: Link2 },
  { name: "Cognitive OS", icon: Puzzle },
  { name: "Vanguard IP", icon: Target },
];

export default function LogoStrip() {
  return (
    <section className="py-12 bg-surface/50 border-y border-white/5 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeIn("up", 0.1, 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-8 items-center"
        >
          <p className="text-xs uppercase font-semibold text-muted tracking-widest text-center">
            Integrated Ecosystem & Venture Nodes
          </p>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-20 opacity-40">
            {DUMMY_LOGOS.map((logo, index) => {
              const Icon = logo.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-white hover:opacity-100 hover:text-accent-to transition-all duration-300 cursor-pointer select-none"
                  title={logo.name}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-display font-medium text-sm tracking-wider uppercase">
                    {logo.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
