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
import LogoStrip from "@/components/sections/LogoStrip";
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
