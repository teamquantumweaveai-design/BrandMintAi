"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { ACADEMY_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { GraduationCap, ArrowRight, BookOpen, Users, Compass, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AcademyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#F8F9FA] text-[#2E384D]">
        <Hero
          title={
            <>
              BrandMint AI <br />
              <GradientText>Academy & Community</GradientText>
            </>
          }
          subtitle={ACADEMY_COPY.heroSubtitle}
        />

        {/* Learning Philosophy & Ladder */}
        <section className="py-20 bg-[#F8F9FA] relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Philosophy */}
            <div className="flex flex-col gap-6">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Our Creed
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                {ACADEMY_COPY.philosophyTitle}
              </h2>
              <p className="text-[#516F90] text-base leading-relaxed font-normal">
                {ACADEMY_COPY.philosophyDesc}
              </p>

              {/* Step flow */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {ACADEMY_COPY.philosophyFlow.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-sm font-semibold text-[#2E384D] px-4 py-2 rounded-full bg-white border border-[#CBD6E2] shadow-xs shrink-0">
                      {step}
                    </span>
                    {idx < ACADEMY_COPY.philosophyFlow.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-[#FF5C35] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right: Ladder */}
            <div className="p-8 rounded-3xl bg-white border border-[#CBD6E2] shadow-xs flex flex-col gap-6 w-full">
              <h3 className="text-xl font-bold font-display text-[#2E384D]">
                {ACADEMY_COPY.ladderTitle}
              </h3>
              <div className="flex flex-col gap-3">
                {ACADEMY_COPY.ladderSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs hover:border-[#FF5C35]/30 transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5C35] font-mono text-xs font-bold">
                      0{idx + 1}
                    </div>
                    <span className="text-[#2E384D] text-base font-semibold">{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 100-Day Transformation Model */}
        <section className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-3">
                Transformation Path
              </span>
              <h2 className="text-3xl font-bold font-display text-[#2E384D]">
                {ACADEMY_COPY.modelTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {ACADEMY_COPY.modelStages.map((stage, idx) => (
                <GlowCard key={idx} className="h-full bg-white border-[#CBD6E2] shadow-xs hover:border-[#FF5C35]/30 transition-all flex flex-col justify-between p-6">
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-xs text-[#FF5C35] uppercase tracking-widest font-bold">
                      {stage.stage}
                    </span>
                    <p className="text-[#516F90] text-sm font-normal leading-relaxed mt-1">
                      {stage.desc}
                    </p>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Circle */}
        <section id="growth-circle" className="py-20 bg-[#F8F9FA] w-full relative z-10 border-t border-[#CBD6E2]/60 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col gap-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FF5C35]/10 rounded-full blur-[80px] pointer-events-none" />
            <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-2">
              Community Layer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
              {ACADEMY_COPY.circleTitle}
            </h2>
            <p className="text-[#516F90] text-base md:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
              {ACADEMY_COPY.circleDesc}
            </p>
            <div className="pt-6">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent-from to-accent-to text-white font-semibold text-sm hover:opacity-95 hover:scale-102 transition-all shadow-xs"
              >
                <span>Request Growth Circle Invite</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}

