export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "Ventures", href: "/ventures" },
  { label: "Quantum Weave", href: "/quantum-weave" },
  { label: "Industries", href: "/industries" },
  { label: "Vision", href: "/vision" },
  { label: "Contact", href: "/contact" },
  { label: "Leads", href: "/admin/leads" },
];

export const SITE_METADATA = {
  name: "BrandMint AI",
  tagline: "The Quantum-Engineered Venture & Intelligent Automation Ecosystem",
  description: "Next-generation venture studio and business automation engine mapping complex structures, building IP products, and forging autonomic intelligence.",
};

// Home & Feature Grid Constants
export const STATS = [
  { value: "4+", label: "Autonomic Venture Products" },
  { value: "99.9%", label: "System Operational Efficiency" },
  { value: "$20M+", label: "Venture Value Generated" },
  { value: "10x", label: "Velocity of Business Scaling" },
];

export const CORE_FEATURES = [
  {
    title: "Autonomic Venture Builder",
    description: "Creating standalone IP products, SaaS platforms, and digital business modules engineered to scale autonomously.",
    icon: "Boxes",
  },
  {
    title: "Quantum-Weave Systems",
    description: "Integrating multi-agent cognitive loops and smart business automation directly into existing corporate foundations.",
    icon: "Network",
  },
  {
    title: "IP Forge & Autonomic Products",
    description: "R&D laboratory for proprietary algorithmic modules, automated licensing, and programmatic revenue streams.",
    icon: "Cpu",
  },
  {
    title: "Autonomous Flow Automation",
    description: "Eliminating administrative latency by writing self-healing workflow scripts and cognitive agency nodes.",
    icon: "Workflow",
  },
  {
    title: "Predictive Intelligence Engines",
    description: "Deploying high-dimensional models that forecast system degradation and capture market arbitrage in real time.",
    icon: "Sparkles",
  },
  {
    title: "Secure Ledger Infrastructure",
    description: "Hardening transaction boundaries using zero-knowledge state logic and smart business contract guardrails.",
    icon: "ShieldAlert",
  },
];

// About Page Copy
export const ABOUT_COPY = {
  heroTitle: "Architecting the Future of Enterprise Velocity",
  heroSubtitle: "We merge high-dimensional systems engineering, advanced automation, and venture capital architecture to synthesize tomorrow's digital conglomerates.",
  paragraphs: [
    "BrandMint AI operates at the intersection of autonomic software engineering and capital asset generation. We do not merely construct landing pages or basic software wrappers; we forge entire self-reinforcing systems.",
    "Founded in 2026, our mandate is to design, model, and spin off proprietary technology assets while injecting cognitive automation into market-leading partners. We refer to this convergence of venture design and deep tech integration as the Autonomic Cycle.",
  ],
  pillars: [
    { title: "Engineering Rigor", desc: "Every component we write complies with atomic modularity, ensuring maximum code reuse and system permanence." },
    { title: "Autonomous Capital", desc: "We design products that operate as decentralized IP networks, reducing humans-in-the-loop to expand margin ceilings." },
    { title: "Cognitive Weaving", desc: "Connecting enterprise telemetry directly into multi-agent decision machines, converting static operations to active autonomic systems." },
  ],
};

// Solutions Page Copy
export const SOLUTIONS_COPY = {
  heroTitle: "Cognitive & Autonomic Infrastructure",
  heroSubtitle: "Decouple growth from headcount. Our custom modules construct self-healing systems and state-of-the-art decision structures.",
  solutions: [
    {
      title: "Autonomic Venture Prototyping",
      desc: "Rapid deployment of fully containerized SaaS systems. We take concepts from schematic to production in weeks instead of quarters, leveraging our pre-engineered modular micro-service stack.",
      features: ["Next.js/React Micro-frontends", "Zod-validated API boundaries", "Autoclass provisioning", "Dockerized deployment pipelines"],
    },
    {
      title: "Cognitive Flow Integration",
      desc: "Replacing fragile, trigger-based workflow tools with deep-reasoning agent networks. These agents monitor operational anomalies, coordinate multi-department tasks, and self-heal on execution failures.",
      features: ["LangChain/LlamaIndex orchestrations", "Context-aware buffer queues", "Vector database caching", "Autonomous exception resolution"],
    },
    {
      title: "Proprietary IP Assets & Licensing",
      desc: "We construct custom algorithms, neural routers, and automated data pipelines that can be licensed as plug-and-play capital assets inside your business units.",
      features: ["Clean code micro-licensing", "High-performance computational nodes", "Automatic telemetry logs", "Zero-knowledge security schemes"],
    },
  ],
};

// Our Approach Steps
export const APPROACH_COPY = {
  heroTitle: "The Autonomic Synthesis Cycle",
  heroSubtitle: "How we analyze, construct, and spin off self-sustaining businesses and automated enterprise networks.",
  steps: [
    {
      number: "01",
      phase: "Telemetry & Discovery",
      title: "Operational Heat Mapping",
      description: "We audit your workflows to extract structural bottlenecks, data silos, and repeating human operational patterns. This creates a functional math-model of the organization.",
    },
    {
      number: "02",
      phase: "Architecture & Design",
      title: "Modularity Modeling",
      description: "We define core components, data contracts, and boundary policies. By utilizing strict design token systems, we ensure the future application layer remains infinite in scale.",
    },
    {
      number: "03",
      phase: "Synthesis & Assembly",
      title: "Accelerated Construction",
      description: "Our engineers build the solution using our proprietary BrandMint component vault. By reusing robust primitives, we avoid building common layers from scratch.",
    },
    {
      number: "04",
      phase: "Autonomic Run",
      title: "Cognitive Handover",
      description: "The systems are deployed with continuous telemetry and self-healing error handlers. We hook the software into automated maintenance scripts, ensuring negligible upkeep costs.",
    },
  ],
};

// Ventures Portfolio
export const VENTURES_COPY = {
  heroTitle: "Autonomic Venture Portfolio",
  heroSubtitle: "Proprietary software engines and modular platforms engineered, incubated, and scaled by BrandMint AI.",
  ventures: [
    {
      name: "QuantumScribe",
      tagline: "Autonomous Regulatory Compliance Forge",
      status: "Incubating",
      description: "Utilizes deep-reasoning compliance models to auto-draft, audit, and submit high-dimensional financial filings with zero manual friction.",
      metrics: "99.8% compliance accuracy, $1.2M seed-raised",
    },
    {
      name: "SynthFlow AI",
      tagline: "Autonomic Supply-Chain Orchestration Network",
      status: "Active (Series A)",
      description: "A self-correcting logistics layer that reroutes cargo, negotiates rates with autonomous carriers, and updates inventory books in real time.",
      metrics: "34% container cost reduction, scaled to 14 ports",
    },
    {
      name: "LedgerWeave",
      tagline: "DeFi State Engine Primitives",
      status: "Exited (Acquired)",
      description: "Provides state-synchronization software for high-frequency liquidity pools. Acquired in Q4 2025 to form the backplane of global settlement nodes.",
      metrics: "Processed $4.5B transaction volume, acquisition exit",
    },
    {
      name: "CyberNetix",
      tagline: "Autonomous Agent-Mesh Security Shield",
      status: "Incubating",
      description: "Provisions lightweight micro-agents that inhabit server instances, sniffing out anomalous memory access patterns and neutralizing vector leaks.",
      metrics: "0.2ms threat mitigation latency, 400k nodes active",
    },
  ],
};

// Quantum Weave Specialized Engine Page Copy
export const QUANTUM_WEAVE_COPY = {
  heroTitle: "The Quantum-Weave Engine",
  heroSubtitle: "Our proprietary integration layer connecting core databases, cognitive agency loops, and modular user interfaces.",
  intro: "The Quantum-Weave engine is the crowning IP of BrandMint AI. It functions as a real-time reactive backplane that binds discrete corporate software systems into a single self-coordinating organism.",
  specs: [
    { title: "Unified Mesh State", desc: "No more REST-call daisy chains. Quantum-Weave operates on a distributed event log, ensuring absolute consistency across all databases and interfaces." },
    { title: "Dynamic Logic Compilation", desc: "Workflows adapt dynamically on the fly based on incoming stream telemetry. If a node delays, the engine compiles a temporary rerouting branch." },
    { title: "Modulation Protocol", desc: "Components hook directly into CSS Variables and customizable design states, allowing UI interfaces to reshape themselves based on user intent profiles." },
  ],
};

// Industries Copy
export const INDUSTRIES_COPY = {
  heroTitle: "Autonomic Solutions Across Industries",
  heroSubtitle: "We deploy state-of-the-art autonomic systems to sectors where operational latency directly translates to capital loss.",
  sectors: [
    { name: "FinTech & Automated Trading", desc: "Deploying high-frequency telemetry parsers and automated zero-knowledge ledger state contracts to secure digital transactions." },
    { name: "Logistics & Fleet Coordination", desc: "Utilizing SynthFlow agent networks to orchestrate route selections, fuel optimization, and automated carrier bidding logs." },
    { name: "HealthTech Records & Auditing", desc: "Architecting zero-trust medical databases that compile and audit patient logs without exposing unencrypted personal telemetry." },
    { name: "Energy Grid Telemetry", desc: "Running predictive analytics grids that forecast local spikes and automate secondary power source bids in microseconds." },
  ],
};

// Vision Copy
export const VISION_COPY = {
  heroTitle: "The Horizon of Autonomic Systems",
  heroSubtitle: "A 10-year outlook on the transition of standard corporate entities into decentralized, self-healing cognitive units.",
  timeline: [
    { year: "2026", goal: "Ecosystem Foundation", details: "Deployment of BrandMint core design primitives and first-generation agent meshes for SaaS incubation." },
    { year: "2028", goal: "Zero-Human Back-Office", details: "Spinning off full accounting, legal, and operational agency bundles that handle corporate compliance completely programmatically." },
    { year: "2031", goal: "Autonomic Conglomerates", details: "Integrating cross-venture logic where separate companies trade equity, services, and cloud resources autonomously to optimize balance sheets." },
    { year: "2035", goal: "Ubiquitous Quantum Mesh", details: "Coordinating thousands of globally distributed networks compiling their user interfaces dynamically via local cognitive agents." },
  ],
};
