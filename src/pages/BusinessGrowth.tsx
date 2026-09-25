"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import GradientBorder from "@/components/ui/GradientBorder";
import { BUSINESS_GROWTH_COPY, AI_BUSINESS_PARTNER_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { Cpu, RefreshCcw, Layers, ArrowRight, CheckCircle2, Award, Zap, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function BusinessGrowthPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#F8F9FA] text-[#2E384D]">
        <Hero
          title={
            <>
              Business Growth <br />
              <GradientText>Operating Systems</GradientText>
            </>
          }
          subtitle={BUSINESS_GROWTH_COPY.heroSubtitle}
        />

        {/* Page 7: How We Work - The Steps */}
        <section className="py-20 bg-[#F8F9FA] relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center flex flex-col gap-4 mb-20">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Our Methodology
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]">
                {BUSINESS_GROWTH_COPY.approachTitle}
              </h2>
              <p className="text-[#516F90] text-sm md:text-base max-w-xl mx-auto font-normal">
                {BUSINESS_GROWTH_COPY.approachDesc}
              </p>
            </div>

            {/* Steps Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {BUSINESS_GROWTH_COPY.steps.map((step, idx) => (
                <GlowCard key={idx} className="flex flex-col justify-between h-full bg-white border-[#CBD6E2] shadow-xs">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-4xl text-[#FF5C35]/30">
                        {step.number}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] font-mono text-[9px] text-[#DF441F] font-bold uppercase tracking-widest">
                        {step.phase}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-[#2E384D] mt-2">
                      {step.title}
                    </h3>
                    <p className="text-[#516F90] text-xs md:text-sm leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>
                </GlowCard>
              ))}
            </div>

            {/* AI Principle Banner */}
            <div className="max-w-4xl mx-auto mt-16 p-8 rounded-3xl bg-[#FFF2EE] border border-[#FFDCD3] text-center flex flex-col gap-4 relative overflow-hidden shadow-xs">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5C35]/10 rounded-full blur-2xl" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#DF441F] font-bold">AI Principle</span>
              <p className="text-[#2E384D] text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">
                "{BUSINESS_GROWTH_COPY.aiPrinciple}"
              </p>
            </div>
          </div>
        </section>

        {/* Page 8: Quantum Growth Scan™ */}
        <section id="scan" className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left: Scan details */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Immediate Diagnostic
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                {BUSINESS_GROWTH_COPY.scanTitle}
              </h2>
              <p className="text-[#516F90] text-base leading-relaxed font-normal">
                {BUSINESS_GROWTH_COPY.scanDesc}
              </p>
              <div className="pt-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-from to-accent-to text-white font-semibold text-sm hover:opacity-95 hover:scale-102 transition-all shadow-xs"
                >
                  <span>Book Growth Scan Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Uncovers Checklist */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <h3 className="text-xl font-bold font-display text-[#2E384D] mb-2">
                What the Growth Scan Uncovers:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUSINESS_GROWTH_COPY.scanUncovers.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] flex gap-3 hover:border-[#FF5C35]/30 transition-colors shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-[#FF5C35] shrink-0 mt-0.5" />
                    <p className="text-[#516F90] text-xs md:text-sm font-normal leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Growth Journey Map */}
        <section className="py-20 bg-[#F8F9FA] w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-3">
                Systemic Path
              </span>
              <h2 className="text-3xl font-bold font-display text-[#2E384D]">
                {BUSINESS_GROWTH_COPY.journeyTitle}
              </h2>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
              {BUSINESS_GROWTH_COPY.journeySteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-5 py-3 rounded-2xl bg-white border border-[#CBD6E2] font-semibold text-xs md:text-sm text-[#2E384D] hover:border-[#FF5C35]/30 hover:shadow-xs transition-all flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FF5C35]" />
                    {step}
                  </div>
                  {idx < BUSINESS_GROWTH_COPY.journeySteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[#FF5C35]/60 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Page 9: AI Business Partner Approach */}
        <section className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: AI Partner Core info */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Strategic Engagement
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                  {AI_BUSINESS_PARTNER_COPY.title}
                </h2>
                <p className="text-[#516F90] text-base leading-relaxed font-normal">
                  {AI_BUSINESS_PARTNER_COPY.desc}
                </p>

                {/* Founder Intelligence Layer */}
                <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs flex flex-col gap-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#FF5C35] font-bold block">
                    {AI_BUSINESS_PARTNER_COPY.founderLayerTitle}
                  </h4>
                  <p className="text-[#2E384D] text-xs md:text-sm leading-relaxed font-medium italic">
                    "{AI_BUSINESS_PARTNER_COPY.founderLayerDesc}"
                  </p>
                </div>
              </div>

              {/* Right Column: Support Areas and Mentoring Flow */}
              <div className="lg:col-span-7 flex flex-col gap-12">
                <div>
                  <h3 className="text-xl font-bold font-display text-[#2E384D] mb-6">
                    Core Support Areas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {AI_BUSINESS_PARTNER_COPY.supportAreas.map((area, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] flex gap-2.5 items-center hover:border-[#FF5C35]/30 transition-colors shadow-xs">
                        <Zap className="w-4 h-4 text-[#FF5C35] shrink-0" />
                        <span className="text-[#516F90] text-xs md:text-sm font-normal">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mentoring Flow */}
                <div className="pt-8 border-t border-[#CBD6E2]">
                  <h3 className="text-xl font-bold font-display text-[#2E384D] mb-6">
                    {AI_BUSINESS_PARTNER_COPY.mentoringFlowTitle}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {AI_BUSINESS_PARTNER_COPY.mentoringFlowSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs">
                        <div className="w-7 h-7 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5C35] text-xs font-mono font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-[#2E384D] text-sm md:text-base font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
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

