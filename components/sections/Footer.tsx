"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { NAV_LINKS, SITE_METADATA } from "@/lib/constants";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-white/5 pt-20 pb-10 w-full relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-accent-from to-accent-to p-[1px]">
              <div className="w-full h-full bg-bg rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-accent-to" />
              </div>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              BrandMint <span className="text-gradient">AI</span>
            </span>
          </Link>
          <p className="text-muted text-sm leading-relaxed max-w-sm">
            {SITE_METADATA.description}
          </p>
          <div className="flex items-center gap-4 text-muted">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-to transition-colors p-2 bg-white/5 rounded-lg border border-white/5">
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-to transition-colors p-2 bg-white/5 rounded-lg border border-white/5">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-to transition-colors p-2 bg-white/5 rounded-lg border border-white/5">
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="flex flex-col gap-5">
          <h4 className="font-display font-semibold text-white tracking-wider text-sm uppercase">
            Ecosystem Directory
          </h4>
          <ul className="grid grid-cols-2 gap-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources / Ventures */}
        <div className="flex flex-col gap-5">
          <h4 className="font-display font-semibold text-white tracking-wider text-sm uppercase">
            Autonomic Labs
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link href="/ventures" className="text-muted hover:text-white transition-colors">
                QuantumScribe
              </Link>
            </li>
            <li>
              <Link href="/ventures" className="text-muted hover:text-white transition-colors">
                SynthFlow AI
              </Link>
            </li>
            <li>
              <Link href="/ventures" className="text-muted hover:text-white transition-colors">
                LedgerWeave
              </Link>
            </li>
            <li>
              <Link href="/quantum-weave" className="text-gradient hover:opacity-85 transition-opacity">
                Quantum-Weave Engine
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="flex flex-col gap-5">
          <h4 className="font-display font-semibold text-white tracking-wider text-sm uppercase">
            Receive System Updates
          </h4>
          <p className="text-muted text-sm leading-relaxed">
            Subscribe to our program logs to receive alpha updates on new incubated IP launches.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center mt-2">
            <input
              type="email"
              placeholder="operator@system.io"
              className="w-full bg-surface border border-white/10 rounded-full px-5 py-3 pr-12 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent-from focus:ring-1 focus:ring-accent-from transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-2 bg-gradient-to-r from-accent-from to-accent-to text-white rounded-full hover:scale-105 transition-transform"
              aria-label="Subscribe"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <div>
          © {new Date().getFullYear()} {SITE_METADATA.name}. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Telemetry Protocol
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Node Agreement
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Security Schematics
          </a>
        </div>
      </div>
    </footer>
  );
}
