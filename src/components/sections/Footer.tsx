import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NAV_LINKS, SITE_METADATA, SOCIAL_LINKS, BRANDMINT_PROGRAMS } from "@/lib/constants";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Social Media SVGs
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

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    const result = await subscribeToNewsletter(email);
    setStatus(result);
    setLoading(false);

    if (result.success) {
      setEmail("");
    }
  };

  // Helper to render correct social icon
  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "linkedin":
        return <LinkedinIcon className="w-4 h-4" />;
      case "twitter":
        return <TwitterIcon className="w-4 h-4" />;
      case "instagram":
        return <InstagramIcon className="w-4 h-4" />;
      case "youtube":
        return <YoutubeIcon className="w-4 h-4" />;
      case "whatsapp":
        return <WhatsAppIcon className="w-4 h-4" />;
      default:
        return <LinkedinIcon className="w-4 h-4" />;
    }
  };

  return (
    <footer className="bg-[#2D3E50] border-t border-[#3E4D5E] text-white pt-20 pb-10 w-full relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Brand Info & Socials */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 overflow-hidden rounded-lg border border-white/15 bg-white transition-transform group-hover:scale-105 duration-200">
              <img
                src="/BrandMint_AI_Logo_Final.png"
                alt="BrandMint AI Logo"
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white transition-colors group-hover:text-[#FF7A59] duration-200">
              BrandMint <span className="text-gradient">AI</span>
            </span>
          </Link>

          <p className="text-[#CBD6E2] text-sm leading-relaxed">
            {SITE_METADATA.description}
          </p>

          {/* Verified Social Media Channels */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#CBD6E2]/70 font-semibold">
              Official Profiles
            </span>
            <div className="flex flex-wrap items-center gap-2.5 text-[#CBD6E2]">
              {SOCIAL_LINKS.filter((s) => s.id !== "mail").map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`BrandMint AI on ${social.name}`}
                  title={`${social.name} (${social.handle})`}
                  className="hover:text-white hover:bg-[#FF5C35] hover:border-[#FF5C35] transition-all p-2.5 bg-white/10 rounded-lg border border-white/10 shadow-xs"
                >
                  {renderSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="flex flex-col gap-5">
          <h4 className="font-display font-semibold !text-white tracking-wider text-sm uppercase">
            Ecosystem Directory
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            {NAV_LINKS.map((link) => {
              const isExternal = link.href.startsWith("http") || link.isExternal;
              return (
                <li key={link.href}>
                  {isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#CBD6E2] hover:text-[#FF7A59] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-[#CBD6E2] hover:text-[#FF7A59] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3: Featured Programs */}
        <div className="flex flex-col gap-5">
          <h4 className="font-display font-semibold !text-white tracking-wider text-sm uppercase">
            Flagship Programs
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            {BRANDMINT_PROGRAMS.slice(0, 5).map((program) => (
              <li key={program.id}>
                <Link
                  to={program.href}
                  className="group flex flex-col gap-0.5 text-[#CBD6E2] hover:text-[#FF7A59] transition-colors"
                >
                  <span className="font-medium text-white group-hover:text-[#FF7A59] transition-colors">
                    {program.title}
                  </span>
                  <span className="text-xs text-[#CBD6E2]/70 group-hover:text-[#CBD6E2] transition-colors line-clamp-1">
                    {program.tagline}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter Integration */}
        <div className="flex flex-col gap-5">
          <h4 className="font-display font-semibold !text-white tracking-wider text-sm uppercase">
            Executive AI Briefing
          </h4>
          <p className="text-[#CBD6E2] text-sm leading-relaxed">
            Subscribe to receive pragmatic AI breakdowns, automation case studies, and incubated IP launch updates.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-3 mt-1">
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-3 pr-12 text-sm text-white placeholder:text-[#CBD6E2]/60 focus:outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/30 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                aria-label="Subscribe to newsletter"
                className="absolute right-1.5 p-2 bg-[#FF5C35] hover:bg-[#DF441F] text-white rounded-full transition-transform hover:scale-105 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>

            {status && (
              <div
                className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium ${
                  status.success
                    ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-200 border border-red-500/30"
                }`}
              >
                {status.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                )}
                <span>{status.message}</span>
              </div>
            )}
          </form>

          <span className="text-[11px] text-[#CBD6E2]/60">
            No spam. Unsubscribe anytime with 1 click.
          </span>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto px-6 border-t border-[#3E4D5E] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CBD6E2]/80">
        <div>
          © {new Date().getFullYear()} {SITE_METADATA.name} Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link to="/contact" className="hover:text-white transition-colors">
            Inquiry Portal
          </Link>
          <a
            href="https://wa.me/919972965677"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            WhatsApp Support
          </a>
          <Link to="/about" className="hover:text-white transition-colors">
            About Studio
          </Link>
          <Link to="/solutions" className="hover:text-white transition-colors">
            Solutions
          </Link>
        </div>
      </div>
    </footer>
  );
}
