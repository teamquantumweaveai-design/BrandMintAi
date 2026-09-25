"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Boxes,
  Network,
  Cpu,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";

import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import GradientText from "@/components/ui/GradientText";
import GlowCard from "@/components/ui/GlowCard";
import GradientBorder from "@/components/ui/GradientBorder";
import {
  SITE_METADATA,
  STATS,
  PROBLEM_COPY,
  BELIEF_COPY,
  WHAT_WE_DO,
  WHY_BRANDMINT_COPY,
  VENTURES_COPY,
  HOME_COPY,
  WHO_WE_SERVE_COPY,
  CONTACT_COPY,
  BRANDMINT_PROGRAMS,
} from "@/lib/constants";
import { fadeIn, staggerContainer } from "@/lib/motion";

export default function Home() {
  const [activeServeTab, setActiveServeTab] = useState(0);

  // Map icon strings to Lucide components
  const iconMap: Record<string, any> = {
    Boxes: Boxes,
    Network: Network,
    Cpu: Cpu,
    TrendingUp: TrendingUp,
  };

  const problemBadges = [
    "Growth & Revenue",
    "Digital Visibility",
    "Customer Acquisition",
    "Process Automation",
    "Community Engagement",
    "Scalable Operations",
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#F8F9FA] text-[#2E384D]">
        
        {/* HERO SECTION */}
        <section className="relative min-h-0 sm:min-h-[85vh] lg:min-h-screen flex flex-col items-center justify-start sm:justify-center pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 overflow-hidden w-full bg-[#F8F9FA]">
          {/* Background elements */}
          <div className="absolute inset-0 grid-bg opacity-45 z-0 pointer-events-none" />
          <div className="absolute inset-0 mesh-glow z-0 pointer-events-none" />
          
          {/* Decorative Warm Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF5C35]/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
            <motion.div
              variants={staggerContainer(0.12, 0.1)}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center gap-6"
            >
              {/* Badge */}
              <motion.div
                variants={fadeIn("up", 0.1, 0.5)}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] text-xs font-semibold text-[#DF441F] shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF5C35]" />
                <span>Autonomous Ventures & Business Systems Studio</span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                variants={fadeIn("up", 0.2, 0.6)}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-[#2E384D] max-w-5xl leading-[1.08] sm:leading-[1.05]"
              >
                Building Systems That <br />
                <GradientText>Help People Grow.</GradientText>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeIn("up", 0.25, 0.6)}
                className="text-[#FF5C35] font-mono text-sm md:text-base font-semibold uppercase tracking-wider mt-2"
              >
                {HOME_COPY.heroSubtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                variants={fadeIn("up", 0.3, 0.6)}
                className="text-[#516F90] text-base md:text-lg lg:text-xl max-w-3xl leading-relaxed font-normal mt-2"
              >
                {HOME_COPY.heroDescription}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeIn("up", 0.4, 0.6)}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 w-full sm:w-auto"
              >
                <Link
                  to={HOME_COPY.cta[0].href}
                  className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-4 rounded-full overflow-hidden text-sm font-semibold transition-all duration-300 bg-[#FF5C35] hover:bg-[#DF441F] hover:scale-102 hover:shadow-[0_4px_20px_rgba(255,92,53,0.35)] text-white"
                >
                  <span>{HOME_COPY.cta[0].label}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={HOME_COPY.cta[1].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#CBD6E2] bg-white text-sm font-semibold hover:bg-[#F8F9FA] transition-colors text-[#2E384D] shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{HOME_COPY.cta[1].label}</span>
                </a>

                <Link
                  to={HOME_COPY.cta[2].href}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#CBD6E2] bg-white text-sm font-semibold hover:bg-[#F8F9FA] transition-colors text-[#2E384D] shadow-xs"
                >
                  <Boxes className="w-4 h-4 text-[#FF5C35]" />
                  <span>{HOME_COPY.cta[2].label}</span>
                </Link>
              </motion.div>

              {/* Stats Bar */}
              <motion.div
                variants={fadeIn("up", 0.5, 0.7)}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-16 mt-16 border-t border-[#CBD6E2]/70 w-full max-w-5xl"
              >
                {STATS.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                    <span className="text-3xl md:text-4xl font-bold font-display text-[#2E384D] tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-[#516F90] text-xs font-semibold uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* WHAT WE HELP YOU DO SECTION */}
        <section className="py-24 bg-white border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center flex flex-col gap-4 mb-16">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Our Focus
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]">
                What We Help You Do
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {HOME_COPY.helpYouDo.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-4 p-6 rounded-2xl border border-[#CBD6E2]/80 bg-[#F8F9FA] hover:border-[#FF5C35]/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5C35] shrink-0 mt-0.5 shadow-xs">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-[#2E384D] text-base md:text-lg leading-relaxed font-normal mt-1">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Core Philosophy Banner - HubSpot Signature Sunrise Gradient */}
            <div className="max-w-4xl mx-auto mt-12">
              <div className="hubspot-sunrise-gradient p-8 md:p-14 rounded-3xl text-center flex flex-col gap-5 relative overflow-hidden shadow-lg border border-[#FADAE5]">
                <span className="text-xs font-mono tracking-widest text-[#DF441F] uppercase font-bold block">Core Philosophy</span>
                <p className="text-2xl md:text-3xl font-display text-[#2E384D] leading-relaxed font-bold relative z-10">
                  "{HOME_COPY.coreMessage}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROBLEM SECTION */}
        <section id="problem" className="py-24 bg-[#F8F9FA] border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Heading & Summary */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                  Structural Diagnosis
                </span>
                <h2 className="text-3xl md:text-5xl font-bold font-display text-[#2E384D] tracking-tight leading-tight">
                  {PROBLEM_COPY.title}
                </h2>
                <p className="text-[#516F90] text-base leading-relaxed font-normal">
                  {PROBLEM_COPY.subtitle}
                </p>
                <div className="mt-6 p-6 rounded-2xl bg-white border border-[#CBD6E2] shadow-xs relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                  <p className="text-[#2E384D] font-semibold text-lg leading-relaxed relative z-10">
                    "{PROBLEM_COPY.summary}"
                  </p>
                </div>
              </div>

              {/* Right Column: Struggles Grid */}
              <div className="lg:col-span-7 flex flex-wrap gap-4 lg:pt-16">
                {problemBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="px-6 py-4 rounded-2xl bg-white border border-[#CBD6E2] hover:border-red-500/40 hover:shadow-sm transition-all duration-300 text-base font-semibold text-[#2E384D] tracking-wide flex items-center gap-3 shrink-0"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                    {badge}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* WHAT WE BELIEVE SECTION */}
        <section id="believe" className="py-24 bg-white border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center flex flex-col gap-4 mb-20">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Our Creed
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D] max-w-3xl mx-auto leading-tight">
                {BELIEF_COPY.headline}
              </h2>
            </div>

            {/* Belief Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {BELIEF_COPY.beliefs.map((belief, idx) => (
                <div key={idx} className="relative group p-8 rounded-2xl bg-[#F8F9FA] border border-[#CBD6E2] hover:border-[#FF5C35]/50 hover:shadow-md transition-all flex flex-col gap-4 h-full">
                  <span className="font-mono text-xs text-[#516F90] font-semibold">BELIEF 0{idx + 1}</span>
                  <h3 className="text-xl font-bold font-display text-[#2E384D] mt-2 leading-snug">
                    {belief.title}
                  </h3>
                  <p className="text-[#FF5C35] text-base font-semibold tracking-wide">
                    {belief.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Simple Belief Block */}
            <div className="max-w-4xl mx-auto mt-20">
              <div className="bg-[#F8F9FA] border border-[#CBD6E2] p-8 md:p-12 rounded-3xl text-center flex flex-col gap-4 relative overflow-hidden shadow-xs">
                <span className="text-xs font-mono tracking-widest text-[#FF5C35] uppercase font-bold block">OUR CORE PRINCIPLE</span>
                <p className="text-xl md:text-2xl font-display text-[#2E384D] leading-relaxed font-semibold italic relative z-10">
                  "{BELIEF_COPY.simpleBelief.quote}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE DO SECTION */}
        <section id="what-we-do" className="py-24 bg-[#F8F9FA] border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center flex flex-col gap-4 mb-20">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Our Capabilities
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]">
                {WHAT_WE_DO.title}
              </h2>
              <p className="text-[#516F90] text-sm md:text-base max-w-xl mx-auto font-normal leading-relaxed">
                {WHAT_WE_DO.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHAT_WE_DO.services.map((srv, idx) => {
                const Icon = iconMap[srv.icon] || HelpCircle;
                return (
                  <div key={idx} className="flex flex-col gap-6 h-full justify-between p-6 rounded-2xl bg-white border border-[#CBD6E2] shadow-xs hover:border-[#FF5C35]/50 hover:shadow-md transition-all">
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5C35] shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold font-display text-[#2E384D] mt-2">
                        {srv.title}
                      </h3>
                      <p className="text-[#516F90] text-sm leading-relaxed font-normal">
                        {srv.desc}
                      </p>
                    </div>
                    <Link to="/about" className="pt-4 flex items-center text-xs font-semibold text-[#FF5C35] group hover:text-[#DF441F] transition-colors cursor-pointer">
                      <span>Explore details</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BRANDMINT FLAGSHIP PROGRAMS & GROWTH TRACKS SECTION */}
        <section id="programs" className="py-24 bg-white border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
              <div>
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-2">
                  Operating Pathways
                </span>
                <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]">
                  BrandMint AI Programs
                </h2>
              </div>
              <p className="text-[#516F90] text-sm md:text-base max-w-md leading-relaxed">
                Structured programs built for immediate cash flow, high-retention automation, and long-term leverage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BRANDMINT_PROGRAMS.map((program) => (
                <div
                  key={program.id}
                  className="flex flex-col justify-between h-full bg-[#F8F9FA] rounded-2xl border border-[#CBD6E2] p-7 hover:border-[#FF5C35]/50 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FFF2EE] border border-[#FFDCD3] text-[10px] font-bold text-[#DF441F] tracking-wider uppercase">
                        {program.badge}
                      </span>
                      <span className="text-xs font-semibold text-[#516F90] font-mono">
                        {program.durationOrPricing}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold font-display text-[#2E384D] group-hover:text-[#FF5C35] transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-xs text-[#FF7A59] font-medium mt-0.5">
                        {program.tagline}
                      </p>
                    </div>

                    <p className="text-[#516F90] text-sm leading-relaxed font-normal">
                      {program.description}
                    </p>

                    <div className="pt-2 border-t border-[#CBD6E2]/70 flex flex-col gap-2">
                      {program.highlights.map((highlight, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-[#2E384D]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5C35] shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#CBD6E2]/80">
                    <Link
                      to={program.href}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#CBD6E2] text-xs font-semibold text-[#2E384D] group-hover:bg-[#FF5C35] group-hover:text-white group-hover:border-[#FF5C35] transition-all shadow-2xs"
                    >
                      <span>{program.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Consultation Banner */}
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#2D3E50] to-[#1E293B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <span className="text-xs font-mono text-[#FF7A59] uppercase tracking-wider font-bold">
                  Need Custom Architecture?
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Not sure which program fits your current business stage?
                </h3>
                <p className="text-sm text-[#CBD6E2] max-w-xl">
                  Speak directly with our systems engineers to determine whether you need a Growth Scan, an Academy Intensive, or Custom Automation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-full bg-[#FF5C35] hover:bg-[#DF441F] text-white text-xs font-semibold shadow-xs transition-all"
                >
                  Book Discovery Call
                </Link>
                <a
                  href="https://wa.me/919972965677?text=Hi%20BrandMint%20AI!%20I%20would%20like%20guidance%20on%20choosing%20the%20right%20program."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-semibold transition-all"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE SERVE SECTION */}
        <section id="partners" className="py-24 bg-white border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center flex flex-col gap-4 mb-20">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Our Audience
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]">
                {WHO_WE_SERVE_COPY.title}
              </h2>
            </div>

            {/* Interactive Tab Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Tab names selectors (Left column) */}
              <div className="lg:col-span-4 flex flex-col gap-2">
                {WHO_WE_SERVE_COPY.audiences.map((aud, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveServeTab(idx)}
                    className={`text-left px-6 py-4 rounded-xl font-display font-semibold transition-all duration-200 border flex justify-between items-center ${
                      activeServeTab === idx
                        ? "bg-[#FFF2EE] border-[#FF5C35] text-[#FF5C35] shadow-xs"
                        : "border-transparent text-[#516F90] hover:text-[#2E384D] hover:bg-[#F8F9FA]"
                    }`}
                  >
                    <span>{aud.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                      activeServeTab === idx ? "text-[#FF5C35] translate-x-1" : "text-[#516F90]"
                    }`} />
                  </button>
                ))}
              </div>

              {/* Tab Content details (Right column) */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeServeTab}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="p-8 md:p-12 rounded-2xl bg-[#F8F9FA] border border-[#CBD6E2] shadow-xs relative overflow-hidden flex flex-col gap-6 justify-between min-h-[220px]"
                  >
                    <div className="flex flex-col gap-4">
                      <span className="font-mono text-xs text-[#FF5C35] uppercase tracking-widest font-semibold">
                        Focus Target
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold font-display text-[#2E384D]">
                        {WHO_WE_SERVE_COPY.audiences[activeServeTab].title}
                      </h3>
                      <p className="text-[#516F90] text-base leading-relaxed font-normal">
                        {WHO_WE_SERVE_COPY.audiences[activeServeTab].desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>

        {/* OUR VENTURES SECTION */}
        <section id="ventures" className="py-24 bg-[#F8F9FA] border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
              <div>
                <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest block mb-2">
                  Incubated Operations
                </span>
                <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]">
                  {VENTURES_COPY.heroTitle}
                </h2>
              </div>
              <p className="text-[#516F90] text-sm md:text-base max-w-md">
                {VENTURES_COPY.heroSubtitle}
              </p>
            </div>

            {/* Featured Venture Cards */}
            <div className="flex flex-col gap-12">
              {VENTURES_COPY.ventures.map((venture, idx) => (
                <div key={idx} className="bg-white border border-[#CBD6E2] shadow-sm rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
                  
                  {/* Left content */}
                  <div className="lg:col-span-7 flex flex-col gap-6 z-10">
                    <span className="px-3.5 py-1 w-fit rounded-full bg-[#FFF2EE] border border-[#FFDCD3] text-xs font-semibold text-[#DF441F] tracking-wider uppercase">
                      Venture Entity 0{idx + 1}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold font-display text-[#2E384D]">
                      {venture.name}
                    </h3>
                    <h4 className="text-gradient text-lg font-semibold font-display">
                      {venture.tagline}
                    </h4>
                    <p className="text-[#516F90] text-base leading-relaxed font-normal">
                      {venture.description}
                    </p>
                    <div className="pt-4">
                      {venture.ctaHref.startsWith("http") ? (
                        <a
                          href={venture.ctaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5C35] hover:bg-[#DF441F] text-white text-sm font-semibold shadow-xs transition-all"
                        >
                          <span>{venture.ctaText}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <Link
                          to={venture.ctaHref}
                          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5C35] hover:bg-[#DF441F] text-white text-sm font-semibold shadow-xs transition-all"
                        >
                          <span>{venture.ctaText}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right visual representation */}
                  <div className="lg:col-span-5 relative w-full h-[280px] md:h-[320px] rounded-2xl border border-[#CBD6E2] overflow-hidden flex items-center justify-center p-[1px] bg-[#F8F9FA]">
                    <div className="absolute inset-0 grid-bg opacity-30 z-0" />
                    
                    <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                      <div className="w-20 h-20 rounded-full border border-[#FFDCD3] flex items-center justify-center bg-[#FFF2EE] shadow-sm text-[#FF5C35]">
                        <Network className="w-8 h-8 animate-spin-slow" />
                      </div>
                      <span className="font-display text-sm font-bold text-[#2E384D] tracking-wide">{venture.name}</span>
                      <span className="text-xs text-[#516F90] font-medium">Active Portfolio Venture</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY BRANDMINT AI SECTION */}
        <section id="why-brandmint" className="py-24 bg-white border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center flex flex-col gap-4 mb-20">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Our Differentiators
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]">
                {WHY_BRANDMINT_COPY.title}
              </h2>
              <p className="text-[#516F90] text-sm md:text-base max-w-xl mx-auto font-normal leading-relaxed">
                {WHY_BRANDMINT_COPY.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {WHY_BRANDMINT_COPY.pillars.map((pillar, idx) => (
                <div key={idx} className="flex flex-col gap-4 p-8 rounded-2xl border border-[#CBD6E2] bg-[#F8F9FA] hover:border-[#FF5C35]/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF5C35] shadow-[0_0_8px_rgba(255,92,53,0.4)]" />
                    <h3 className="text-lg font-bold font-display text-[#2E384D]">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-[#516F90] text-sm leading-relaxed font-normal pl-5">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto mt-12">
              <div className="p-8 rounded-3xl bg-[#FFF2EE] border border-[#FFDCD3] text-center flex flex-col gap-4 shadow-xs">
                <span className="text-xs font-mono uppercase tracking-wider text-[#DF441F] font-bold">Our Promise</span>
                <p className="text-[#2E384D] text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                  "{WHY_BRANDMINT_COPY.promise}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* START A CONVERSATION / CTA SECTION - HubSpot Signature Deep Forest Teal Banner */}
        <section id="contact" className="py-24 bg-[#F8F9FA] border-t border-[#CBD6E2]/60 relative z-10 w-full overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#0D3330] p-10 md:p-16 text-center flex flex-col items-center gap-8">
              {/* Radial glow accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5C35]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D3E50]/40 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF7A59] relative z-10">
                <span>Join the Ecosystem</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-display !text-white tracking-tight leading-tight relative z-10">
                {CONTACT_COPY.title}
              </h2>
              <p className="text-[#A5C4BD] text-base leading-relaxed max-w-xl mx-auto font-light relative z-10">
                {CONTACT_COPY.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2 relative z-10">
                <Link
                  to={CONTACT_COPY.ctaButtons[1].href}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FF5C35] hover:bg-[#DF441F] text-white font-semibold text-sm hover:scale-102 hover:shadow-[0_4px_20px_rgba(255,92,53,0.4)] transition-all"
                >
                  <span>{CONTACT_COPY.ctaButtons[1].label}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <a
                  href={CONTACT_COPY.ctaButtons[2].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/25 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: {CONTACT_COPY.whatsapp}</span>
                </a>
              </div>

              {/* Bengaluru Contact Info */}
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center gap-2 text-xs text-[#CBD6E2] relative z-10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7A59]" />
                  <span className="font-semibold text-white">{CONTACT_COPY.companyName}</span>
                </div>
                <span className="max-w-md text-center font-light leading-relaxed text-[#CBD6E2]/80">
                  {CONTACT_COPY.address.join(" ")}
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
