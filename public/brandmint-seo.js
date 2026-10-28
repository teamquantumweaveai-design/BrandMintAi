
(function () {
  const pages = {
    "/": {
      title: "AI Solutions & Business Automation in Bangalore | BrandMint AI",
      description:
        "BrandMint AI offers AI solutions, AI agents, WhatsApp Business automation, CRM integrations and business growth systems in Bangalore."
    },
    "/solutions": {
      title: "AI Automation Solutions for Businesses | BrandMint AI",
      description:
        "Explore AI automation solutions, AI agents, WhatsApp Business automation, CRM integrations and connected business workflows."
    },
    "/about": {
      title: "About BrandMint AI | WhatsApp Automation Company in Bangalore",
      description:
        "Learn about BrandMint AI, a Bangalore-based company building AI solutions, automation systems and practical business growth workflows."
    },
    "/blog": {
      title: "AI Automation & Business Growth Blog | BrandMint AI",
      description:
        "Read guides on AI automation, WhatsApp lead follow-up, CRM integrations, AI agents and business growth from BrandMint AI."
    },
    "/contact": {
      title: "Contact BrandMint AI | AI WhatsApp Automation Experts in Bangalore",
      description:
        "Contact BrandMint AI in Bangalore to discuss AI solutions, WhatsApp automation, AI agents, CRM integrations and business workflows."
    }
  };

  function updateSEO() {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const page = pages[path];
    if (!page) return;

    document.title = page.title;

    let description = document.querySelector('meta[name="description"]');

    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }

    description.content = page.description;
  }

  const originalPushState = history.pushState;
  history.pushState = function () {
    const result = originalPushState.apply(this, arguments);
    queueMicrotask(updateSEO);
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function () {
    const result = originalReplaceState.apply(this, arguments);
    queueMicrotask(updateSEO);
    return result;
  };

  window.addEventListener("popstate", updateSEO);
  document.addEventListener("DOMContentLoaded", updateSEO);
  updateSEO();
})();
