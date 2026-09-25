"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GradientText from "@/components/ui/GradientText";
import { QUANTUM_WEAVE_COPY } from "@/lib/constants";
import { ArrowRight, CheckCircle2, Sparkles, Database, ExternalLink } from "lucide-react";

export default function QuantumWeavePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#F8F9FA] text-[#2E384D]">
        <Hero
          title={
            <>
              The Quantum-Weave <br />
              <GradientText>Integration Engine</GradientText>
            </>
          }
          subtitle={QUANTUM_WEAVE_COPY.heroSubtitle}
          ctaText="Visit QuantumWeave.io ↗"
          ctaHref="https://quantumweaveai.io/"
        />

        {/* Live Website Banner */}
        <div className="max-w-7xl mx-auto px-6 -mt-8 mb-12 relative z-20">
          <a
            href="https://quantumweaveai.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-[#CBD6E2] shadow-xs hover:shadow-md hover:border-[#FF5C35]/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <div>
                <span className="text-sm font-bold font-display text-[#2E384D] group-hover:text-[#FF5C35] transition-colors">
                  QuantumWeave Official Platform
                </span>
                <span className="text-xs text-[#516F90] ml-2 font-mono">
                  https://quantumweaveai.io/
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#FF5C35]">
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        </div>

        {/* Positioning & Focus */}
        <section className="py-20 bg-[#F8F9FA] relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: General Info */}
            <div className="flex flex-col gap-6">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Venture Identity
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                Quantum Weave Venture
              </h2>
              <p className="text-[#516F90] text-base md:text-lg leading-relaxed font-normal mt-2">
                {QUANTUM_WEAVE_COPY.positioning}
              </p>
              <div className="p-6 rounded-2xl bg-[#FFF2EE] border border-[#FFDCD3] mt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#DF441F] font-bold block mb-2">{QUANTUM_WEAVE_COPY.pilotPhilosophyTitle}</span>
                <p className="text-[#2E384D] text-sm md:text-base leading-relaxed font-medium">
                  "{QUANTUM_WEAVE_COPY.pilotPhilosophyDesc}"
                </p>
              </div>
            </div>

            {/* Right: Focus Areas */}
            <div className="p-8 rounded-3xl bg-white border border-[#CBD6E2] shadow-xs flex flex-col gap-6">
              <h3 className="text-xl font-bold font-display text-[#2E384D]">
                {QUANTUM_WEAVE_COPY.focusTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUANTUM_WEAVE_COPY.focus.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5C35] shrink-0" />
                    <span className="text-[#516F90] text-xs md:text-sm font-normal">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Community Commerce */}
        <section className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Info */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Ecosystem Infrastructure
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                  {QUANTUM_WEAVE_COPY.commerceTitle}
                </h2>
                <p className="text-[#516F90] text-base leading-relaxed font-normal">
                  {QUANTUM_WEAVE_COPY.commerceDesc}
                </p>

                {/* Core Flow Map */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {QUANTUM_WEAVE_COPY.commerceFlow.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-[11px] font-mono font-semibold uppercase text-[#2E384D] px-2.5 py-1 rounded-md bg-[#F8F9FA] border border-[#CBD6E2] shrink-0">
                        {step}
                      </span>
                      {idx < QUANTUM_WEAVE_COPY.commerceFlow.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF5C35] shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Right Column: Capabilities */}
              <div className="lg:col-span-7 flex flex-col gap-5 lg:pt-12">
                <h3 className="text-xl font-bold font-display text-[#2E384D] mb-2">
                  Key Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {QUANTUM_WEAVE_COPY.capabilities.map((cap, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] flex gap-2.5 items-center hover:border-[#FF5C35]/40 transition-colors shadow-xs">
                      <Sparkles className="w-4 h-4 text-[#FF5C35] shrink-0" />
                      <span className="text-[#516F90] text-xs md:text-sm font-normal">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Manufacturing Intelligence */}
        <section className="py-20 bg-[#F8F9FA] w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-16">
              
              {/* Left Column: MFG details */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Industrial Systems
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                  {QUANTUM_WEAVE_COPY.mfgTitle}
                </h2>
                <p className="text-[#516F90] text-base leading-relaxed font-normal">
                  {QUANTUM_WEAVE_COPY.mfgDesc}
                </p>

                {/* AI MFG Engine list */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {QUANTUM_WEAVE_COPY.mfgEngine.map((engine, idx) => (
                    <div key={idx} className="px-3 py-1 rounded bg-white border border-[#CBD6E2] text-xs text-[#FF5C35] font-mono shadow-xs">
                      {engine}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Workflow Map */}
              <div className="lg:col-span-7 flex flex-col gap-5 lg:pt-12">
                <h3 className="text-xl font-bold font-display text-[#2E384D] mb-4">
                  MFG Example Workflow
                </h3>
                <div className="flex flex-col gap-4 relative pl-8 border-l border-[#CBD6E2]">
                  {QUANTUM_WEAVE_COPY.mfgWorkflow.map((step, idx) => (
                    <div key={idx} className="relative flex items-center gap-4">
                      {/* Step bullet */}
                      <span className="absolute -left-[41px] flex h-5 w-5 rounded-full border border-[#FF5C35] bg-white items-center justify-center font-mono text-[10px] font-bold text-[#FF5C35]">
                        {idx + 1}
                      </span>
                      <div className="p-4 rounded-xl bg-white border border-[#CBD6E2] shadow-xs w-full hover:border-[#FF5C35]/40 transition-colors">
                        <span className="text-[#2E384D] text-xs md:text-sm font-semibold">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Education & Employability */}
        <section className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Info */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Academic Networks
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                  {QUANTUM_WEAVE_COPY.eduTitle}
                </h2>
                <p className="text-[#516F90] text-base leading-relaxed font-normal">
                  {QUANTUM_WEAVE_COPY.eduDesc}
                </p>
              </div>

              {/* Right Column: Student Journey Map */}
              <div className="lg:col-span-7 flex flex-col gap-5 lg:pt-12">
                <h3 className="text-xl font-bold font-display text-[#2E384D] mb-4">
                  Placement Student Journey
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {QUANTUM_WEAVE_COPY.eduJourney.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] font-semibold text-xs text-[#2E384D] hover:border-[#FF5C35]/40 transition-colors flex items-center gap-2 shadow-xs">
                        <Database className="w-3.5 h-3.5 text-[#FF5C35]" />
                        {step}
                      </div>
                      {idx < QUANTUM_WEAVE_COPY.eduJourney.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF5C35]/50 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
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
