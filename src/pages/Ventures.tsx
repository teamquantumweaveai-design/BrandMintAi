"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { VENTURES_COPY, WHAT_WE_ARE_BUILDING_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { Network, ArrowRight, Sparkles, Cpu, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function VenturesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#F8F9FA] text-[#2E384D]">
        <Hero
          title={
            <>
              BrandMint AI <br />
              <GradientText>Venture Holdings</GradientText>
            </>
          }
          subtitle={VENTURES_COPY.heroSubtitle}
        />

        {/* Active Projects */}
        <section className="py-20 bg-[#F8F9FA] relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-2">
                Active Projects
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-[#2E384D]">
                Incubated Venture Entities
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {VENTURES_COPY.ventures.map((venture, idx) => (
                <div key={idx} className="relative rounded-3xl bg-white border border-[#CBD6E2] shadow-sm overflow-hidden">
                  <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Venture Description */}
                    <div className="lg:col-span-7 flex flex-col gap-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5C35]">
                          <Network className="w-5 h-5 animate-float-slow" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold font-display text-[#2E384D]">
                          {venture.name}
                        </h3>
                      </div>
                      <span className="text-gradient font-mono text-xs font-semibold uppercase tracking-wider">
                        {venture.tagline}
                      </span>
                      <p className="text-[#516F90] text-sm md:text-base leading-relaxed font-normal">
                        {venture.description}
                      </p>
                      <div className="pt-2 flex items-center gap-4">
                        {venture.ctaHref.startsWith("http") ? (
                          <a
                            href={venture.ctaHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-from to-accent-to text-white text-xs font-semibold hover:opacity-95 transition-all shadow-xs"
                          >
                            <span>{venture.ctaText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <Link
                            to={venture.ctaHref}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-from to-accent-to text-white text-xs font-semibold hover:opacity-95 transition-all shadow-xs"
                          >
                            <span>{venture.ctaText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Active Venture
                        </span>
                      </div>
                    </div>

                    {/* Visual representation card */}
                    <div className="lg:col-span-5 relative p-6 rounded-2xl border border-[#CBD6E2] bg-[#F8F9FA] flex flex-col justify-between gap-6 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#CBD6E2] pb-4">
                        <span className="font-mono text-xs text-[#516F90] uppercase tracking-wider font-bold">
                          Ecosystem Node
                        </span>
                        <span className="font-mono text-xs text-[#FF5C35] font-bold">
                          v2.4
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#516F90]">Infrastructure</span>
                          <span className="font-semibold text-[#2E384D]">AI Community Commerce</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#516F90]">Incubated By</span>
                          <span className="font-semibold text-[#2E384D]">BrandMint AI Labs</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#516F90]">Platform URL</span>
                          <span className="font-mono text-[#DF441F] font-semibold">quantumweaveai.io</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#CBD6E2] text-[11px] text-[#516F90] leading-relaxed">
                        Autonomous demand matching, visualizer intelligence, and automated supply chains.
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Page 15: What We Are Building / Beyond Services */}
        <section className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column: Title & Long-term direction */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Incubator Pipeline
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D] leading-tight">
                  {WHAT_WE_ARE_BUILDING_COPY.title}
                </h2>
                <p className="text-[#516F90] text-base leading-relaxed font-normal">
                  {WHAT_WE_ARE_BUILDING_COPY.subtitle}
                </p>

                <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs mt-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#FF5C35] font-bold block mb-2">
                    {WHAT_WE_ARE_BUILDING_COPY.directionTitle}
                  </span>
                  <p className="text-[#2E384D] text-xs md:text-sm leading-relaxed font-medium">
                    {WHAT_WE_ARE_BUILDING_COPY.directionDesc}
                  </p>
                </div>
              </div>

              {/* Right Column: Tags Grid */}
              <div className="lg:col-span-7 flex flex-wrap gap-4">
                {WHAT_WE_ARE_BUILDING_COPY.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-5 py-3 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] hover:border-[#FF5C35]/40 hover:bg-white hover:shadow-xs transition-all duration-300 text-sm font-semibold text-[#2E384D] tracking-wide"
                  >
                    {item}
                  </div>
                ))}
              </div>

            </div>

            {/* Simple Belief block */}
            <div className="max-w-4xl mx-auto mt-20">
              <div className="p-8 md:p-12 rounded-3xl bg-[#FFF2EE] border border-[#FFDCD3] text-center flex flex-col gap-4 shadow-xs">
                <span className="text-xs font-mono uppercase tracking-wider text-[#DF441F] font-bold">Autonomic Philosophy</span>
                <p className="text-[#2E384D] text-lg md:text-xl font-medium italic leading-relaxed">
                  "{WHAT_WE_ARE_BUILDING_COPY.simpleBelief}"
                </p>
              </div>
            </div>

          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}

