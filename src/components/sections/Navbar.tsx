import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HEADER_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-[#CBD6E2]/70 shadow-xs py-3.5"
          : "bg-[#F8F9FA]/80 backdrop-blur-xs border-transparent py-4.5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 overflow-hidden rounded-lg border border-[#CBD6E2]/80 bg-white transition-transform group-hover:scale-95 duration-200 shadow-xs">
            <img
              src="/BrandMint_AI_Logo_Final.png"
              alt="BrandMint AI Logo"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-[#2E384D] transition-colors group-hover:text-[#FF5C35] duration-200">
            BrandMint <span className="text-gradient">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {HEADER_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const isExternal = link.href.startsWith("http") || link.isExternal;
            const linkClasses = cn(
              "px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
              isActive
                ? "text-[#FF5C35] bg-[#FF5C35]/10 border border-[#FF5C35]/25"
                : "text-[#516F90] hover:text-[#2E384D] hover:bg-black/5"
            );

            if (isExternal) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                to={link.href}
                className={linkClasses}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center shrink-0">
          <Link
            to="/contact"
            className="group relative flex items-center gap-1.5 px-5 py-2.5 rounded-full overflow-hidden text-sm font-semibold transition-all duration-300 bg-[#FF5C35] hover:bg-[#DF441F] hover:shadow-[0_4px_16px_rgba(255,92,53,0.35)] hover:scale-102 text-white"
          >
            <span>Inquiry Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-[#2E384D] hover:text-[#FF5C35] bg-black/5 border border-[#CBD6E2]/70"
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
            className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-[#CBD6E2] shadow-xl overflow-hidden w-full"
          >
            <div className="px-6 py-8 flex flex-col gap-6 max-h-[calc(100vh-80px)] overflow-y-auto">
              <div className="flex flex-col gap-3">
                {HEADER_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const isExternal = link.href.startsWith("http") || link.isExternal;
                  const mobileLinkClasses = cn(
                    "block py-2 text-base font-semibold font-display border-l-2 pl-3 transition-colors",
                    isActive
                      ? "text-[#FF5C35] border-[#FF5C35]"
                      : "text-[#516F90] border-transparent hover:text-[#2E384D] hover:border-[#CBD6E2]"
                  );

                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className={mobileLinkClasses}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className={mobileLinkClasses}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.div variants={itemVariants} className="pt-4 border-t border-[#CBD6E2]/40">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF5C35] hover:bg-[#DF441F] text-white font-semibold text-sm shadow-sm hover:opacity-95"
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
