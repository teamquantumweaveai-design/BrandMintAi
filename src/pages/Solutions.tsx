"use client";

import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import GradientBorder from "@/components/ui/GradientBorder";
import { SOLUTIONS_COPY, BUSINESS_MODEL_COPY } from "@/lib/constants";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { Cpu, RefreshCcw, Layers, ArrowRight, CheckCircle2, TrendingUp, Sparkles, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function SolutionsPage() {
  // Helper to generate dynamic WhatsApp URL with package details
  const getPackageWhatsAppUrl = (pkg: {
    title: string;
    price: string;
    desc: string;
    badge: string;
  }) => {
    const text = [
      `Hi BrandMint AI! 👋`,
      ``,
      `I am interested in getting started with the *${pkg.title}* package.`,
      ``,
      `📋 *Package Details:*`,
      `• *Investment / Price:* ${pkg.price}`,
      `• *Tier / Type:* ${pkg.badge}`,
      `• *Overview:* ${pkg.desc}`,
      ``,
      `Could you please share the next steps, timeline, and how we can get started?`,
    ].join("\n");

    return `https://wa.me/919972965677?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#F8F9FA] text-[#2E384D]">
        <Hero
          title={
            <>
              Practical Solutions <br />
              <GradientText>For Immediate Growth</GradientText>
            </>
          }
          subtitle={SOLUTIONS_COPY.heroSubtitle}
        />

        {/* Division 1: Cash Flow Now Packages */}
        <section className="py-20 bg-[#F8F9FA] relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-2">
                Services & Implementation
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                Cash Flow Now Packages
              </h2>
              <p className="text-[#516F90] text-sm md:text-base mt-2 max-w-2xl">
                Select any package to initiate a direct conversation on WhatsApp with all package details, scope, and pricing pre-loaded.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SOLUTIONS_COPY.packages.map((pkg, idx) => (
                <GlowCard key={idx} className="flex flex-col justify-between h-full bg-white border-[#CBD6E2] shadow-xs hover:border-[#FF5C35]/40 transition-colors">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] text-[10px] font-bold text-[#DF441F] tracking-wider uppercase">
                        {pkg.badge}
                      </span>
                      <span className="text-xl font-bold font-display text-[#2E384D]">
                        {pkg.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-[#2E384D] mt-2">
                      {pkg.title}
                    </h3>
                    <p className="text-[#516F90] text-sm leading-relaxed font-normal">
                      {pkg.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#CBD6E2] flex flex-col gap-2.5">
                    <a
                      href={getPackageWhatsAppUrl(pkg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:scale-[1.01] transition-all group cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>Select & Chat on WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <Link
                      to={`/contact?package=${encodeURIComponent(pkg.title)}`}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#516F90] hover:text-[#FF5C35] transition-colors py-1"
                    >
                      <span>Or inquire via web form</span>
                    </Link>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* Digital Visibility Services */}
        <section className="py-20 bg-white w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Title and philosophy */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Brand Distribution
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                  {SOLUTIONS_COPY.visibilityTitle}
                </h2>
                <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs flex flex-col gap-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#FF5C35] font-bold block">{SOLUTIONS_COPY.philosophyTitle}</span>
                  <p className="text-[#2E384D] text-sm md:text-base leading-relaxed font-medium italic">
                    "{SOLUTIONS_COPY.philosophyText}"
                  </p>
                  <div className="pt-4 border-t border-[#CBD6E2]">
                    <span className="text-[10px] uppercase font-mono text-[#516F90] font-bold block mb-1">Business Engine Path</span>
                    <span className="text-xs font-semibold text-[#DF441F] tracking-wide">
                      {SOLUTIONS_COPY.equation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visibility Services Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {SOLUTIONS_COPY.visibilityServices.map((service, idx) => (
                  <div key={idx} className="p-6 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs flex flex-col gap-3 hover:border-[#FF5C35]/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5C35] shrink-0" />
                      <h3 className="text-base font-bold font-display text-[#2E384D]">{service.title}</h3>
                    </div>
                    <p className="text-[#516F90] text-xs leading-relaxed font-normal pl-6">{service.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Business Model Division Section */}
        <section className="py-20 bg-[#F8F9FA] w-full relative z-10 border-t border-[#CBD6E2]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-3">
                Strategic Model
              </span>
              <h2 className="text-3xl font-bold font-display text-[#2E384D]">
                {BUSINESS_MODEL_COPY.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
              
              {/* Cash Flow Now */}
              <div className="p-8 md:p-12 rounded-3xl bg-white border border-[#CBD6E2] shadow-xs flex flex-col gap-6">
                <span className="text-xs uppercase font-mono text-[#FF5C35] font-bold tracking-wider block">Division 01</span>
                <h3 className="text-2xl font-bold font-display text-[#2E384D]">
                  {BUSINESS_MODEL_COPY.div1Title}
                </h3>
                <p className="text-[#516F90] text-sm leading-relaxed font-normal">
                  {BUSINESS_MODEL_COPY.div1Desc}
                </p>
                <ul className="flex flex-col gap-3">
                  {BUSINESS_MODEL_COPY.div1Items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-[#2E384D]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5C35] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scale Later */}
              <div className="p-8 md:p-12 rounded-3xl bg-white border border-[#CBD6E2] shadow-xs flex flex-col gap-6">
                <span className="text-xs uppercase font-mono text-[#FF5C35] font-bold tracking-wider block">Division 02</span>
                <h3 className="text-2xl font-bold font-display text-[#2E384D]">
                  {BUSINESS_MODEL_COPY.div2Title}
                </h3>
                <p className="text-[#516F90] text-sm leading-relaxed font-normal">
                  {BUSINESS_MODEL_COPY.div2Desc}
                </p>
                <ul className="flex flex-col gap-3">
                  {BUSINESS_MODEL_COPY.div2Items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-[#2E384D]">
                      <Sparkles className="w-4 h-4 text-[#FF5C35] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Revenue Ladder */}
            <div className="max-w-4xl mx-auto mt-20">
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#CBD6E2] shadow-xs text-center flex flex-col gap-6 relative overflow-hidden">
                <span className="text-xs font-mono tracking-widest text-[#FF5C35] font-bold uppercase block">{BUSINESS_MODEL_COPY.ladderTitle}</span>
                <div className="flex flex-wrap justify-center items-center gap-3 relative z-10">
                  {BUSINESS_MODEL_COPY.ladderSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-[#2E384D] font-semibold text-sm md:text-base px-4 py-2 rounded-full bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs shrink-0">
                        {step}
                      </span>
                      {idx < BUSINESS_MODEL_COPY.ladderSteps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-[#FF5C35] shrink-0" />
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

