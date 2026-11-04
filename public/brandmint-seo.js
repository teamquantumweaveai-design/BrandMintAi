
(function () {
  "use strict";

  if (window.__brandmintSEOInitialized) return;
  window.__brandmintSEOInitialized = true;

  const SITE_URL = "https://brandmintai.io";

  const pages = {
    "/": {
      title: "AI, Business & WhatsApp Automation in Bangalore | BrandMint AI",
      description:
        "BrandMint AI provides AI automation, business automation and WhatsApp automation in Bangalore. Automate leads, customer support and business workflows."
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

  function normalizePath(pathname) {
    const path = pathname.replace(/\/+$/, "") || "/";
    return path;
  }

  function setMetaDescription(content) {
    let meta = document.querySelector(
      'meta[name="description"]'
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  }

  function setCanonical(path) {
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute(
      "href",
      SITE_URL + (path === "/" ? "/" : path)
    );
  }

  function updateSEO() {
    const path = normalizePath(
      window.location.pathname
    );

    const page = pages[path];

    // Do not overwrite metadata for unconfigured pages.
    if (!page) return;

    document.title = page.title;

    setMetaDescription(page.description);
    setCanonical(path);
  }

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    const result = originalPushState.apply(
      this,
      arguments
    );

    queueMicrotask(updateSEO);
    return result;
  };

  history.replaceState = function () {
    const result = originalReplaceState.apply(
      this,
      arguments
    );

    queueMicrotask(updateSEO);
    return result;
  };

  window.addEventListener("popstate", updateSEO);
  window.addEventListener("pageshow", updateSEO);

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      updateSEO,
      { once: true }
    );
  } else {
    updateSEO();
  }
})();
