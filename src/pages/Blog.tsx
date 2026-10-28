
import React, { useState } from "react";
import { Link } from "react-router-dom";

type Article = {
  title: string;
  description: string;
  category: string;
  href: string;
};

const articles: Article[] = [
  {
    title: "7 Small Business Automation Ideas That Save Time",
    description:
      "Discover practical automation ideas that help small businesses save time, reduce repetitive work and improve everyday operations.",
    category: "Business Automation",
    href: "/small-business-automation-ideas/",
  },
  {
    title: "How to Build a WhatsApp Lead Follow-Up System for a Small Business",
    description:
      "Learn how to improve lead response, organize enquiries and build a more consistent WhatsApp follow-up process.",
    category: "WhatsApp Automation",
    href: "/whatsapp-lead-follow-up-system/",
  },
  {
    title: "AI Business Automation: Frequently Asked Questions",
    description:
      "Answers to common questions about AI automation, AI agents, business workflows and getting started with practical AI solutions.",
    category: "AI Solutions",
    href: "/ai-business-faq/",
  },
  {
    title: "How to Connect Website Leads, CRM, Email and WhatsApp Into One Workflow",
    description:
      "Explore how businesses can connect lead capture, CRM records, email notifications and WhatsApp conversations.",
    category: "CRM Automation",
    href: "/connect-website-leads-to-crm/",
  },
];

const categories = [
  "All Articles",
  "Business Automation",
  "WhatsApp Automation",
  "AI Solutions",
  "CRM Automation",
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All Articles");

  const visibleArticles =
    activeCategory === "All Articles"
      ? articles
      : articles.filter(
          (article) => article.category === activeCategory
        );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Blog Header */}
      <header className="border-b border-white/10 bg-[#0B0F19]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            BrandMint AI
          </Link>

          <Link
            to="/contact"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Talk to Us
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-6 pb-14 pt-20 text-center">
          <div className="mx-auto max-w-4xl">
            <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Insights &amp; Resources
            </span>

            <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              AI Automation &amp; Business Growth Blog
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Practical guides on AI solutions, WhatsApp Business
              automation, CRM integrations and smarter workflows
              for growing businesses.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const selected = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={selected}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                    selected
                      ? "border-cyan-400 bg-cyan-400 text-slate-950"
                      : "border-white/15 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            {visibleArticles.map((article) => (
              <article
                key={article.href}
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
              >
                <span className="mb-5 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                  {article.category}
                </span>

                <h2 className="text-2xl font-bold leading-snug">
                  {article.title}
                </h2>

                <p className="mt-4 flex-1 leading-7 text-slate-300">
                  {article.description}
                </p>

                {/* Normal anchor keeps standalone article URLs intact */}
                <a
                  href={article.href}
                  className="mt-8 inline-flex w-fit items-center gap-2 font-semibold text-cyan-300 transition hover:text-white"
                >
                  Read Article
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">
            Ready to Automate Your Business?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            Explore practical AI automation, WhatsApp workflows
            and CRM solutions designed for business growth.
          </p>

          <Link
            to="/solutions"
            className="mt-7 inline-flex rounded-full bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Explore Our Solutions
          </Link>
        </section>
      </main>
    </div>
  );
}
