"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b border-transparent",
        isScrolled
          ? "bg-bg/85 backdrop-blur-md border-white/5 py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-accent-from to-accent-to p-[1px]">
            <div className="w-full h-full bg-bg rounded-lg flex items-center justify-center transition-transform group-hover:scale-95 duration-200">
              <Activity className="w-4 h-4 text-accent-to group-hover:text-accent-from transition-colors" />
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white transition-all group-hover:text-accent-to duration-200">
            BrandMint <span className="text-gradient">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  isActive
                    ? "text-white bg-white/5 border border-white/5"
                    : "text-muted hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/contact"
            className="group relative flex items-center gap-1.5 px-5 py-2.5 rounded-full overflow-hidden text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-accent-from to-accent-to hover:scale-103 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white"
          >
            <span>Inquiry Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-muted hover:text-white bg-white/5 border border-white/5"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-white/15 overflow-hidden w-full"
          >
            <div className="px-6 py-8 flex flex-col gap-6 max-h-[calc(100vh-80px)] overflow-y-auto">
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block py-2 text-lg font-semibold font-display border-l-2 pl-3 transition-colors",
                          isActive
                            ? "text-accent-to border-accent-to"
                            : "text-muted border-transparent hover:text-white hover:border-white/20"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div variants={itemVariants} className="pt-4 border-t border-white/5">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-accent-from to-accent-to text-white font-semibold text-sm hover:opacity-90"
                >
                  <span>Inquiry Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
