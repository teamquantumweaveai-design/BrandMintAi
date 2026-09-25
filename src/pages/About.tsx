"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { ABOUT_COPY, BELIEF_COPY, WHY_BRANDMINT_COPY, WHAT_WE_DO } from "@/lib/constants";
import { Boxes, Network, Cpu, TrendingUp, HelpCircle } from "lucide-react";

export default function AboutPage() {
  const iconMap: Record<string, any> = {
    Boxes: Boxes,
    Network: Network,
    Cpu: Cpu,
    TrendingUp: TrendingUp,
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#F8F9FA] text-[#2E384D]">
        <Hero
          title={
            <>
              Architecting Systems <br />
              <GradientText>Over More Tools</GradientText>
            </>
          }
          subtitle="We focus on long-term sustainability, connected workflows, and practical systems designed to create value beyond founder effort."
        />

        {/* Who We Are & Mission/Vision */}
        <section className="py-20 bg-[#F8F9FA] relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Who We Are & Creed */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Our Identity
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                  {ABOUT_COPY.heroTitle}
                </h2>
                <p className="text-[#516F90] text-base md:text-lg leading-relaxed font-normal mt-2">
                  {ABOUT_COPY.whoWeAre}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#CBD6E2] shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5C35]/5 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-gradient text-xs uppercase font-mono tracking-widest mb-3">System Motto</h4>
                <p className="text-[#2E384D] font-semibold text-lg leading-relaxed relative z-10 italic">
                  "{BELIEF_COPY.simpleBelief.quote}"
                </p>
              </div>
            </div>

            {/* Right: Mission & Vision Cards */}
            <div className="grid grid-cols-1 gap-6">
              <div className="p-8 rounded-2xl bg-white border border-[#CBD6E2] shadow-xs">
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                    {ABOUT_COPY.missionTitle}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-[#2E384D]">
                    Clarity. Action. Growth.
                  </h3>
                  <p className="text-[#516F90] text-sm md:text-base leading-relaxed font-normal">
                    {ABOUT_COPY.missionDesc}
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#CBD6E2] shadow-xs">
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                    {ABOUT_COPY.visionTitle}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-[#2E384D]">
                    Decade-Scale Value
                  </h3>
                  <p className="text-[#516F90] text-sm md:text-base leading-relaxed font-normal">
                    {ABOUT_COPY.visionDesc}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* What We Do / Pillars */}
        <section className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-3">
                Functional Divisions
              </span>
              <h2 className="text-3xl font-bold font-display text-[#2E384D]">
                {WHAT_WE_DO.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {WHAT_WE_DO.services.map((srv, idx) => {
                const Icon = iconMap[srv.icon] || HelpCircle;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs hover:border-[#FF5C35]/50 hover:shadow-md transition-all">
                    <div className="flex flex-col gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5C35]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold font-display text-[#2E384D] mt-2">
                        {srv.title}
                      </h3>
                      <p className="text-[#516F90] text-xs md:text-sm leading-relaxed font-normal">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Us / Differentiators */}
        <section className="py-20 bg-[#F8F9FA] w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-16">
              
              {/* Left Side: The Problem */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Foundational Principles
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D] tracking-tight">
                  {WHY_BRANDMINT_COPY.title}
                </h2>
                <p className="text-[#516F90] text-base leading-relaxed font-normal">
                  {WHY_BRANDMINT_COPY.subtitle}
                </p>
                <div className="p-6 rounded-2xl bg-[#FFF2EE] border border-[#FFDCD3]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#DF441F] font-bold block mb-2">Our Promise</span>
                  <p className="text-[#2E384D] text-sm md:text-base leading-relaxed font-medium">
                    "{WHY_BRANDMINT_COPY.promise}"
                  </p>
                </div>
              </div>

              {/* Right Side: Differentiator Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 gap-6">
                {WHY_BRANDMINT_COPY.pillars.map((pillar, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white border border-[#CBD6E2] shadow-xs items-start hover:border-[#FF5C35]/50 transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5C35] shrink-0 mt-0.5 font-mono text-xs font-semibold">
                      {i + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold font-display text-[#2E384D]">{pillar.title}</h3>
                      <p className="text-[#516F90] text-sm font-normal leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Beliefs Grid */}
        <section className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-3">Our Beliefs</span>
              <h2 className="text-3xl font-bold font-display text-[#2E384D]">Value Before Revenue</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {BELIEF_COPY.beliefs.map((belief, i) => (
                <div key={i} className="p-8 rounded-2xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs flex flex-col gap-4">
                  <span className="font-mono text-xs text-[#516F90] font-semibold">BELIEF 0{i + 1}</span>
                  <h3 className="text-lg font-bold text-[#2E384D] font-display mt-1">{belief.title}</h3>
                  <p className="text-[#FF5C35] text-sm font-semibold tracking-wide">{belief.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
