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
              Business Automation Services <br />
              <GradientText>in Bangalore</GradientText>
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
