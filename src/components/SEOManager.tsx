
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://brandmintai.io";

const pages: Record<string, {
  title: string;
  description: string;
}> = {
  "/": {
    title: "AI, Business & WhatsApp Automation in Bangalore | BrandMint AI",
    description:
      "BrandMint AI provides AI automation, business automation and WhatsApp automation in Bangalore. Automate leads, customer support and business workflows."
  },

  // WhatsApp Automation Bangalore Landing Page
  "/whatsapp-automation-bangalore": {
    title:
      "WhatsApp Automation Company in Bangalore | BrandMint AI",
    description:
      "WhatsApp automation services in Bangalore by BrandMint AI. Automate customer enquiries, lead qualification, CRM integrations and follow-ups."
  },

  "/solutions": {
    title: "Business Automation Services in Bangalore | BrandMint AI",
    description:
      "Explore AI agents, WhatsApp Business automation, CRM integrations and workflow automation services from BrandMint AI in Bangalore."
  },

  "/about": {
    title: "About BrandMint AI | AI Automation Company in Bangalore",
    description:
      "Learn about BrandMint AI, a Bangalore-based company building AI solutions, WhatsApp automation, CRM integrations and business growth systems."
  },

  "/blog": {
    title: "AI Automation & Business Growth Blog | BrandMint AI",
    description:
      "Explore practical guides on AI agents, WhatsApp automation, lead follow-ups, CRM integrations and business growth."
  },

  "/contact": {
    title: "Contact BrandMint AI | AI Automation in Bangalore",
    description:
      "Contact BrandMint AI in Bangalore to discuss AI agents, WhatsApp Business automation, CRM integrations and business automation solutions."
  },

  "/business-growth": {
    title: "Business Growth & Automation Consulting | BrandMint AI",
    description:
      "Improve lead follow-ups, customer engagement and business workflows with practical growth and AI automation solutions from BrandMint AI."
  },

  "/ai-consulting-services": {
    title: "AI Consulting Services in Bangalore | BrandMint AI",
    description:
      "Explore AI consulting for business automation, AI agents, WhatsApp workflows and CRM integrations with BrandMint AI in Bangalore."
  },

  "/business-workflow-audit": {
    title: "Business Workflow Audit & Automation Guide | BrandMint AI",
    description:
      "Learn how to identify workflow bottlenecks, missed enquiries and manual processes before planning practical business automation."
  },

  "/ai-business-faq": {
    title: "AI Automation for Business: FAQs | BrandMint AI",
    description:
      "Get answers to common questions about AI business automation, AI agents, WhatsApp automation, CRM integrations and implementation."
  }
};

export default function SEOManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    const page = pages[path];

    if (!page) return;

    document.title = page.title;

    let description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );

    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }

    description.content = page.description;

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = SITE_URL + path;
  }, [pathname]);

  return null;
}
