
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://brandmintai.io";

type PageSEO = {
  title: string;
  description: string;
};

const pages: Record<string, PageSEO> = {
  "/": {
    title: "AI Automation Company in Bangalore | BrandMint AI",
    description:
      "BrandMint AI provides AI agents, WhatsApp automation, CRM integration and business process automation in Bangalore. Explore AI solutions for your business."
  },

  "/whatsapp-automation-bangalore": {
    title:
      "WhatsApp Automation Company in Bangalore | BrandMint AI",
    description:
      "WhatsApp automation services in Bangalore by BrandMint AI. Automate customer enquiries, lead qualification, CRM integrations and follow-ups."
  },

  "/ai-agents-bangalore": {
    title:
      "AI Agents Company in Bangalore | BrandMint AI",
    description:
      "Build AI agents for customer support, lead follow-ups and business automation in Bangalore. BrandMint AI designs practical AI workflows for businesses."
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

  "/ventures": {
    title: "AI Ventures & Products | BrandMint AI",
    description:
      "Explore ventures and AI-powered products developed by BrandMint AI, alongside business automation services and technology solutions."
  },

  "/academy": {
    title: "AI & Digital Skills Training | BrandMint AI Academy",
    description:
      "Explore BrandMint AI Academy programs and practical training in AI tools, digital marketing and business technology skills."
  },

  "/quantum-weave": {
    title: "Quantum Weave AI | BrandMint AI",
    description:
      "Explore Quantum Weave AI, a BrandMint AI initiative focused on artificial intelligence, automation and business growth."
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

// Service-specific structured data.
// The Organization schema already exists in index.html.

const serviceSchemas: Record<
  string,
  Record<string, unknown>
> = {
  "/ai-agents-bangalore": {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id":
      "https://brandmintai.io/ai-agents-bangalore#service",
    name: "AI Agent Development Services in Bangalore",
    serviceType:
      "AI Agent Development and Business Automation",
    description:
      "BrandMint AI provides AI agent development in Bangalore for customer enquiries, lead qualification, customer support and business workflow automation.",
    url:
      "https://brandmintai.io/ai-agents-bangalore",
    provider: {
      "@id": "https://brandmintai.io/#organization"
    },
    areaServed: {
      "@type": "City",
      name: "Bengaluru"
    }
  },

  "/whatsapp-automation-bangalore": {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id":
      "https://brandmintai.io/whatsapp-automation-bangalore#service",
    name: "WhatsApp Automation Services in Bangalore",
    serviceType: "WhatsApp Business Automation",
    description:
      "BrandMint AI provides WhatsApp automation in Bangalore for customer enquiries, lead qualification, automated follow-ups and CRM integration.",
    url:
      "https://brandmintai.io/whatsapp-automation-bangalore",
    provider: {
      "@id": "https://brandmintai.io/#organization"
    },
    areaServed: {
      "@type": "City",
      name: "Bengaluru"
    }
  }
};

export default function SEOManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";

    const page = pages[path];

    // Remove schema from the previously visited service page.
    // This prevents incorrect structured data after navigation.
    const schemaId = "brandmint-service-schema";

    document.getElementById(schemaId)?.remove();

    if (!page) return;

    // Update the page title.
    document.title = page.title;

    // Update the meta description.
    let description =
      document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      );

    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }

    description.content = page.description;

    // Update the canonical URL.
    // Keep the existing canonical format for now.
    let canonical =
      document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href =
      SITE_URL + (path === "/" ? "/" : path);

    // Update social sharing metadata.
    const setSocialMeta = (
      attribute: "property" | "name",
      key: string,
      content: string
    ) => {
      let meta =
        document.querySelector<HTMLMetaElement>(
          `meta[${attribute}="${key}"]`
        );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }

      meta.content = content;
    };

    setSocialMeta(
      "property",
      "og:title",
      page.title
    );

    setSocialMeta(
      "property",
      "og:description",
      page.description
    );

    setSocialMeta(
      "property",
      "og:url",
      canonical.href
    );

    setSocialMeta(
      "name",
      "twitter:title",
      page.title
    );

    setSocialMeta(
      "name",
      "twitter:description",
      page.description
    );

    // Add structured data for applicable service pages.
    const serviceSchema = serviceSchemas[path];

    if (serviceSchema) {
      const schemaScript =
        document.createElement("script");

      schemaScript.id = schemaId;
      schemaScript.type = "application/ld+json";
      schemaScript.textContent =
        JSON.stringify(serviceSchema);

      document.head.appendChild(schemaScript);
    }

  }, [pathname]);

  return null;
}
