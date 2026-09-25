export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Business Growth", href: "/business-growth" },
  { label: "Quantum Weave", href: "/quantum-weave" },
  { label: "Ventures", href: "/ventures" },
  { label: "Academy", href: "/academy" },
  { label: "Contact", href: "/contact" },
];

export const HEADER_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Cashflow Copy", href: "https://cashflowcopy.in/", isExternal: true },
      { label: "Freemium", href: "http://brandmintai.io/freemium", isExternal: true },
      { label: "Film Success", href: "http://brandmintai.io/filmsuccess", isExternal: true },
    ],
  },
  { label: "Business Growth", href: "/business-growth" },
  { label: "Quantum Weave", href: "/quantum-weave" },
  { label: "Ventures", href: "/ventures" },
  {
    label: "Academy",
    href: "/academy",
    children: [
      { label: "IGR Academy", href: "http://brandmintai.io/igr.academy", isExternal: true },
      { label: "Appu AI", href: "http://brandmintai.io/appuai", isExternal: true },
      { label: "Insta Skills", href: "http://brandmintai.io/instaskills", isExternal: true },
      { label: "AI Filmmaking", href: "http://brandmintai.io/aifilmmaking", isExternal: true },
      { label: "Full AI", href: "http://brandmintai.io/fullai", isExternal: true },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const SITE_METADATA = {
  name: "BrandMint AI",
  tagline: "AI • Automation • Growth • Digital Transformation",
  description: "Building systems that help people grow. We create ventures, business systems, communities and intellectual property designed for long-term value.",
};

// Global Stats reflecting system efficiency and venture scaling
export const STATS = [
  { value: "5+", label: "Venture Products Active" },
  { value: "99.9%", label: "Process Automation Uptime" },
  { value: "10x", label: "Velocity of Brand Scaling" },
  { value: "100%", label: "Systems-First Approach" },
];

// BrandMint AI Home Page Copy
export const HOME_COPY = {
  heroTitle: "Building Systems That Help People Grow.",
  heroSubtitle: "AI. Automation. Growth. Digital Transformation.",
  heroDescription: "We help businesses simplify operations, improve visibility, adopt practical AI, automate repetitive work and build systems for sustainable growth.",
  cta: [
    { label: "Book a Discovery Consultation", href: "/contact" },
    { label: "Talk on WhatsApp", href: "https://wa.me/919972965677" },
    { label: "Explore Our Solutions", href: "/solutions" },
  ],
  helpYouDo: [
    "Build a stronger digital presence.",
    "Generate and follow up with more enquiries.",
    "Automate repetitive business work.",
    "Use AI to increase speed, clarity and consistency.",
    "Improve business processes and customer engagement.",
    "Build systems that can be documented, taught and scaled.",
  ],
  coreMessage: "Businesses do not need more tools. They need better systems.",
};

// BrandMint AI Problem Copy
export const PROBLEM_COPY = {
  title: "The Problem",
  subtitle: "Businesses have more tools than ever, yet many still struggle with growth, visibility, customer acquisition, automation, community engagement and scalability.",
  summary: "The challenge is often not a lack of technology. It is a lack of connected, practical systems.",
};

// BrandMint AI Core Beliefs
export const BELIEF_COPY = {
  title: "What We Believe",
  headline: "Businesses Don't Need More Tools. They Need Better Systems.",
  beliefs: [
    { title: "Technology should simplify work.", subtitle: "Not complicate it." },
    { title: "Growth should be predictable.", subtitle: "Not accidental." },
    { title: "Communities should create value.", subtitle: "Not just followers." },
    { title: "Create value.", subtitle: "Before revenue." },
  ],
  simpleBelief: {
    quote: "Technology changes. Markets change. Trends change. But organisations that build strong systems create lasting value.",
  }
};

// What We Do (About / Capabilities)
export const WHAT_WE_DO = {
  title: "What We Do",
  subtitle: "We create ventures, business systems, communities and intellectual property designed around real-world problems and long-term value.",
  services: [
    {
      id: "ventures",
      title: "Build Ventures",
      desc: "Create and grow businesses around real-world problems and opportunities.",
      icon: "Boxes",
    },
    {
      id: "systems",
      title: "Design Systems",
      desc: "Simplify operations, communication, growth and engagement.",
      icon: "Network",
    },
    {
      id: "ip",
      title: "Develop Intellectual Property",
      desc: "Turn ideas into frameworks, assets, processes and scalable solutions.",
      icon: "Cpu",
    },
    {
      id: "growth",
      title: "Enable Growth",
      desc: "Help organisations adopt practical technology, automation and better ways of working.",
      icon: "TrendingUp",
    },
  ],
};

// About Page Copy
export const ABOUT_COPY = {
  heroTitle: "About BrandMint AI",
  whoWeAre: "BrandMint AI Pvt. Ltd. creates ventures, business systems, communities and intellectual property designed around real-world problems and long-term value.",
  missionTitle: "Our Mission",
  missionDesc: "Help businesses discover opportunities, build better systems, implement practical AI and achieve measurable growth.",
  visionTitle: "Our Vision",
  visionDesc: "Build an ecosystem of ventures, systems and intellectual property that helps businesses, communities and institutions grow with greater clarity, capability and confidence.",
};

// Why BrandMint AI Copy
export const WHY_BRANDMINT_COPY = {
  title: "Why BrandMint AI",
  subtitle: "Businesses have more tools than ever, yet many still struggle. The challenge is often not a lack of technology. It is a lack of connected, practical systems.",
  pillars: [
    { title: "Practical before complicated", desc: "We focus on what works, prioritizing simplicity over unnecessary technology complexity.", icon: "CheckCircle2" },
    { title: "Systems before activities", desc: "Activities without systems are random. We build connected frameworks that deliver repeatable results.", icon: "Layers" },
    { title: "Long-term thinking", desc: "We build for sustainability and decade-scale value, rejecting short-term vanity metrics.", icon: "Shield" },
    { title: "Innovation with purpose", desc: "We leverage automation and AI only where they create immediate, measurable value.", icon: "Zap" },
    { title: "AI leverage with responsibility", desc: "Using advanced tools to amplify human capabilities without losing accountability.", icon: "Cpu" },
    { title: "Value before revenue", desc: "Establishing trust, utility, and outcomes first before extracting financial return.", icon: "TrendingUp" },
    { title: "Continuous improvement", desc: "Constantly iterating, refining, and optimizing systems to adapt to changing environments.", icon: "RefreshCcw" },
  ],
  promise: "We do not simply recommend more tools. We identify the business problem, build the right workflow, implement it, measure it and improve it.",
};

// Solutions Copy
export const SOLUTIONS_COPY = {
  heroTitle: "Cash Flow Now",
  heroSubtitle: "Start with practical solutions that solve immediate business problems and create the foundation for longer-term systems.",
  packages: [
    {
      title: "Growth Consultation",
      price: "₹999",
      desc: "A practical business-growth conversation to identify opportunities, problems, priorities and the next best step.",
      badge: "Quick Start",
    },
    {
      title: "AI & Digital Growth Package",
      price: "₹9,999",
      desc: "Digital presence, marketing assets, messaging and growth foundations.",
      badge: "Popular Setup",
    },
    {
      title: "Business AI & Automation Setup",
      price: "₹14,999",
      desc: "Practical AI and automation workflows that reduce repetitive work and improve execution.",
      badge: "Systems Core",
    },
    {
      title: "WhatsApp & Lead Generation",
      price: "Custom Quote",
      desc: "WhatsApp-led customer engagement and lead-generation workflows.",
      badge: "Custom Asset",
    },
    {
      title: "AI Business Automation",
      price: "Custom Quote",
      desc: "AI-assisted workflows for repetitive business processes and customer operations.",
      badge: "Custom Asset",
    },
    {
      title: "Digital Marketing & Growth Management",
      price: "Monthly Retainer",
      desc: "Ongoing digital marketing, content, growth and implementation support.",
      badge: "Retainer",
    },
    {
      title: "AI Business Partner",
      price: "Monthly Plan",
      desc: "Ongoing strategic and implementation support using AI, systems thinking and practical business guidance.",
      badge: "Strategic Layer",
    },
  ],
  visibilityTitle: "Digital Visibility Services",
  visibilityServices: [
    { title: "Marketing Creatives", desc: "Eye-catching posts and banners." },
    { title: "Content Support", desc: "Engaging content that connects." },
    { title: "Business Messaging", desc: "Clear messaging that builds trust." },
    { title: "AI-Powered Marketing Assets", desc: "Smart, modern and conversion-focused assets." },
    { title: "Growth Recommendations", desc: "Practical ideas to improve growth." },
    { title: "SEO", desc: "Improve search visibility." },
    { title: "AEO", desc: "Improve visibility in AI-generated answers." },
    { title: "GEO", desc: "Improve visibility across maps, local search and platforms." },
    { title: "Google Business optimization", desc: "Refining your local map and search presence." },
    { title: "Social media and digital growth support", desc: "Practical distribution channels to capture demand." },
  ],
  philosophyTitle: "Marketing First",
  philosophyText: "Marketing creates conversations. Conversations create trust. Trust creates sales. Sales create cash flow. Systems then make growth more repeatable and scalable.",
  equation: "Marketing → Conversations → Trust → Sales → Cash Flow → Systems → Scale",
};

// Business Growth Copy (How we work, scan, journey)
export const BUSINESS_GROWTH_COPY = {
  heroTitle: "Business Growth System",
  heroSubtitle: "We turn identified opportunities into practical workflows, repeatable processes, automation and measurable operating systems.",
  approachTitle: "Our Approach",
  approachDesc: "We do not begin with tools. We begin with the business problem.",
  steps: [
    { number: "01", phase: "Telemetry", title: "Understand", desc: "Understand the customer, business, workflow, challenge and desired outcome." },
    { number: "02", phase: "Prioritize", title: "Prioritize", desc: "Identify what is urgent, what matters most and where the biggest opportunity is." },
    { number: "03", phase: "Synthesis", title: "Implement", desc: "Build the simplest practical solution using the right combination of people, process, AI and automation." },
    { number: "04", phase: "Metrics", title: "Measure", desc: "Track the outcome using clear operational or business metrics." },
    { number: "05", phase: "Evolution", title: "Improve", desc: "Learn from results and continuously improve the workflow." },
    { number: "06", phase: "Scale", title: "Document & Scale", desc: "Turn working knowledge into systems that can be taught, delegated and scaled." },
  ],
  aiPrinciple: "AI should increase speed, clarity and consistency. It should not replace thinking, responsibility or customer understanding.",
  scanTitle: "Quantum Growth Scan™",
  scanDesc: "A practical starting point for businesses that want clarity before investing in tools or complex solutions.",
  scanUncovers: [
    "Where the business is losing opportunities.",
    "What can be improved immediately.",
    "Which AI tools actually matter.",
    "What the next best step should be.",
  ],
  journeyTitle: "Growth Journey",
  journeySteps: [
    "Quantum Growth Scan™",
    "Growth Consultation",
    "Quantum Growth Blueprint™",
    "Business Growth Systems™",
    "AI Business Partner™",
    "Growth Partner™",
  ],
};

// AI Business Partner Copy
export const AI_BUSINESS_PARTNER_COPY = {
  title: "AI Business Partner",
  desc: "The AI Business Partner approach combines strategic thinking, implementation support, AI leverage and systems thinking.",
  supportAreas: [
    "Business clarity and positioning.",
    "Marketing and messaging.",
    "Lead generation and follow-up.",
    "WhatsApp and conversational commerce.",
    "AI workflows and automation.",
    "Digital systems and process improvement.",
    "Content and storytelling.",
    "Business experiments and opportunity discovery.",
    "Documentation, SOPs and repeatable systems.",
  ],
  founderLayerTitle: "Founder Intelligence Layer",
  founderLayerDesc: "The Kaaranji Shreedhar AMA system is positioned as a strategic intelligence, founder-thinking, mentorship and systems-thinking layer for the Quantum Weave ecosystem.",
  mentoringFlowTitle: "Mentoring Flow",
  mentoringFlowSteps: [
    "Understand the problem",
    "Identify the root cause",
    "Simplify",
    "Create direction",
    "Implement",
    "Build long-term thinking",
  ],
};

// Quantum Weave Venture Copy
export const QUANTUM_WEAVE_COPY = {
  heroTitle: "Quantum Weave",
  heroSubtitle: "Core Venture of BrandMint AI Pvt. Ltd.",
  positioning: "Quantum Weave is the AI innovation and implementation venture of BrandMint AI Pvt. Ltd.",
  focusTitle: "Operational Focus",
  focus: [
    "AI and automation",
    "Business systems",
    "Marketing technology",
    "Conversational commerce",
    "Product innovation",
    "Practical implementation and continuous learning",
  ],
  commerceTitle: "Community Commerce",
  commerceDesc: "An AI-powered community-commerce infrastructure connecting buyers, communities, institutions, creators, suppliers and manufacturers.",
  commerceFlow: ["Discover", "Design", "Connect", "Transact"],
  capabilities: [
    "Community-led commerce.",
    "Design-first discovery.",
    "Demand intelligence.",
    "Reward-driven participation.",
    "AI-assisted matching.",
  ],
  mfgTitle: "Manufacturing Intelligence",
  mfgDesc: "An AI-powered Manufacturing Intelligence Network connecting demand, design, decisions, production and logistics.",
  mfgWorkflow: [
    "Customer Order",
    "AI Visualizer",
    "Approval",
    "Validation",
    "Factory Assignment",
    "Production",
    "Delivery",
  ],
  mfgEngine: [
    "AI Visualizer",
    "AI Quote Engine",
    "AI Validation",
    "AI Routing",
    "AI Intelligence Engine",
  ],
  eduTitle: "Education & Employability",
  eduDesc: "Quantum Weave × JobMatrix is positioned as a measurable, AI-enabled placement system for colleges, TPOs and career services teams.",
  eduJourney: ["Profile", "Optimize", "Match", "Apply", "Track", "Intervene"],
  pilotPhilosophyTitle: "Pilot Philosophy",
  pilotPhilosophyDesc: "Start small. Prove the workflow. Measure the result. Improve or scale.",
};

// Who We Serve Copy
export const WHO_WE_SERVE_COPY = {
  title: "Who We Serve",
  audiences: [
    { title: "Businesses", desc: "Small and growing organisations seeking practical growth systems, digital visibility, automation and AI adoption." },
    { title: "Communities", desc: "Groups that want stronger engagement, meaningful participation and community-led commerce." },
    { title: "Educational Institutions", desc: "Institutions exploring innovation, employability, AI adoption and community-building initiatives." },
    { title: "Sports Ecosystems", desc: "Teams, academies and organisers looking to strengthen identity and engagement." },
    { title: "Founders & Leaders", desc: "People building organisations that want to grow with clarity, systems and purpose." },
    { title: "Youth & Aspiring Entrepreneurs", desc: "People moving from clarity → skills → implementation → income → entrepreneurship → employment creation." },
  ],
};

// Academy Copy
export const ACADEMY_COPY = {
  heroTitle: "Academy & People",
  heroSubtitle: "Knowledge becomes valuable when it is applied, documented, improved and taught.",
  philosophyTitle: "Learning Philosophy",
  philosophyFlow: ["Learn", "Apply", "Teach", "Lead"],
  philosophyDesc: "Knowledge becomes valuable when it is applied, documented, improved and taught.",
  ladderTitle: "Learning Ladder",
  ladderSteps: ["Student", "Operator", "Mentor", "Leader", "Founder"],
  modelTitle: "100-Day Transformation Model",
  modelStages: [
    { stage: "Days 1–20", desc: "Business clarity, ICP, offer and marketing fundamentals." },
    { stage: "Days 21–40", desc: "Copywriting, content, creative thinking and lead generation." },
    { stage: "Days 41–60", desc: "Meta CTW, WhatsApp systems, AI tools and automation." },
    { stage: "Days 61–80", desc: "Client projects, implementation, case studies and portfolio building." },
    { stage: "Days 81–100", desc: "Consulting, mentoring, business development and income generation." },
  ],
  circleTitle: "Growth Circle",
  circleDesc: "A practical community layer for AI strategies, business growth insights, automation, tools that work and real-world learning.",
};

// Our Ventures & Business Model (Cash Flow Now + Scale Later)
export const VENTURES_COPY = {
  heroTitle: "Our Ventures",
  heroSubtitle: "Incubated, engineered, and scaled by BrandMint AI.",
  ventures: [
    {
      name: "Quantum Weave",
      tagline: "Community Commerce & Merchandise Infrastructure",
      description: "An AI-powered community-commerce infrastructure connecting buyers, communities, institutions, creators, suppliers and manufacturers.",
      ctaText: "Explore Quantum Weave",
      ctaHref: "https://quantumweaveai.io/",
    },
  ],
};

export const BUSINESS_MODEL_COPY = {
  title: "Business Model: Cash Flow Now + Scale Later",
  div1Title: "Division 1 — Cash Flow Now",
  div1Desc: "Practical services that generate immediate business value and near-term revenue.",
  div1Items: [
    "WhatsApp Business and conversational commerce.",
    "AI automation.",
    "Lead generation.",
    "Digital marketing and social media support.",
    "Google Business optimization.",
    "Consulting.",
    "Implementation projects.",
    "Monthly retainers.",
  ],
  div2Title: "Division 2 — Scale Later",
  div2Desc: "Scalable products, platforms and ecosystems designed for recurring revenue and long-term leverage.",
  div2Items: [
    "AI-powered entrepreneurship platform.",
    "Community commerce ecosystem.",
    "Subscriptions.",
    "SaaS systems.",
    "Marketplace systems.",
    "AI intelligence and data products.",
    "Technology platforms and intellectual property.",
  ],
  ladderTitle: "Revenue Ladder",
  ladderSteps: [
    "Consultation",
    "Creative / Setup Packages",
    "Monthly Retainers",
    "Training",
    "AI Systems",
    "Community & Memberships",
  ],
};

// What We Are Building
export const WHAT_WE_ARE_BUILDING_COPY = {
  title: "Beyond Services",
  subtitle: "BrandMint AI is building an ecosystem of ventures, systems and intellectual property designed to create value beyond founder effort.",
  items: [
    "Community Commerce Platforms",
    "Business Growth Systems",
    "Automation Frameworks",
    "AI-Powered Assistants",
    "Knowledge Assets",
    "Technology Platforms",
    "Intellectual Property Portfolios",
  ],
  directionTitle: "Long-term Direction",
  directionDesc: "Build systems that create leverage, recurring value, stronger capabilities and sustainable growth.",
  simpleBelief: "Technology changes. Markets change. Trends change. But organisations that build strong systems create lasting value.",
};

// Contact Copy
export const CONTACT_COPY = {
  title: "Let's build something meaningful.",
  subtitle: "Whether you're building a business, a community, a team or an idea, let's explore what can be improved, automated or built.",
  ctaButtons: [
    { label: "Get My Quantum Growth Scan™", href: "/business-growth" },
    { label: "Book a Consultation", href: "/contact" },
    { label: "Talk on WhatsApp", href: "https://wa.me/919972965677" },
    { label: "Explore Our Solutions", href: "/solutions" },
  ],
  companyName: "BrandMint AI Pvt. Ltd.",
  address: [
    "No. 3, Lingappa Layout, 1st Cross,",
    "Sri Sri Sri Shivakumara Swamiji Road,",
    "Bengaluru – 560090",
  ],
  whatsapp: "+91 99729 65677",
  website: "www.brandmint.ai",
  closingLine: "Think better. Build better. Grow better. Proven Expertise. Amplified by AI.",
};

// Social Media Integrations for BrandMint AI
export interface SocialLink {
  id: string;
  name: string;
  url: string;
  handle: string;
  description: string;
  icon: "linkedin" | "twitter" | "instagram" | "youtube" | "whatsapp" | "mail";
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/brandmint-ai",
    handle: "BrandMint AI",
    description: "Follow company announcements, executive AI insights, and venture architecture.",
    icon: "linkedin",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    url: "https://x.com/brandmintai",
    handle: "@brandmintai",
    description: "Real-time updates, systems thinking, and AI automation breakdowns.",
    icon: "twitter",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/brandmintai",
    handle: "@brandmintai",
    description: "Behind the scenes, visual frameworks, and growth community stories.",
    icon: "instagram",
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com/@brandmintai",
    handle: "@brandmintai",
    description: "Deep dive workshops, automation tutorials, and systems playbooks.",
    icon: "youtube",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Official",
    url: "https://wa.me/919972965677",
    handle: "+91 99729 65677",
    description: "Instant direct messaging for consultation, inquiries, and fast support.",
    icon: "whatsapp",
  },
  {
    id: "mail",
    name: "Direct Email",
    url: "mailto:connect@brandmintai.io",
    handle: "connect@brandmintai.io",
    description: "Official inquiries, partnerships, and venture correspondence.",
    icon: "mail",
  },
];

// Comprehensive Catalog of BrandMint AI Programs
export interface BrandMintProgram {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  category: "Strategy & Audit" | "Venture Studio" | "Academy & Training" | "Implementation";
  durationOrPricing: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  href: string;
  isExternal?: boolean;
}

export const BRANDMINT_PROGRAMS: BrandMintProgram[] = [
  {
    id: "growth-scan",
    title: "Quantum Growth Scan™",
    tagline: "Comprehensive Opportunity & Bottleneck Diagnostic",
    badge: "Signature Diagnostic",
    category: "Strategy & Audit",
    durationOrPricing: "Complimentary Audit",
    description: "A precision diagnostic for businesses that want clarity before investing in tools. Uncovers where you are losing leads, what can be automated immediately, and which AI tools actually matter.",
    highlights: [
      "Leakage audit across acquisition & follow-up",
      "Process automation feasibility evaluation",
      "Tailored high-ROI next-steps action plan"
    ],
    ctaLabel: "Get Quantum Growth Scan™",
    href: "/business-growth#scan",
  },
  {
    id: "growth-consultation",
    title: "Growth Consultation Program",
    tagline: "Strategic Advisory & Operating Clarity",
    badge: "Quick Start",
    category: "Strategy & Audit",
    durationOrPricing: "₹999 / Session",
    description: "A focused, 1-on-1 strategic growth session to identify immediate business problems, prioritize opportunities, and establish a pragmatic roadmap.",
    highlights: [
      "Deep dive into current operating hurdles",
      "Simplification of tech stack and workflows",
      "Clear, actionable 30-day priorities"
    ],
    ctaLabel: "Book Consultation",
    href: "/solutions",
  },
  {
    id: "business-automation",
    title: "Business AI & Automation Setup",
    tagline: "Custom Workflows That Eliminate Repetitive Work",
    badge: "Core Setup",
    category: "Implementation",
    durationOrPricing: "₹14,999 / Setup",
    description: "End-to-end practical AI and automation infrastructure: automated lead intake, WhatsApp CRM integrations, client onboarding, and repetitive data workflows.",
    highlights: [
      "WhatsApp & omnichannel lead routing",
      "Automated follow-ups & CRM qualification",
      "Elimination of manual repetitive tasks"
    ],
    ctaLabel: "Deploy Automation",
    href: "/solutions",
  },
  {
    id: "100-day-transformation",
    title: "100-Day Transformation Model",
    tagline: "Applied Operator Intensive for Teams & Leaders",
    badge: "Flagship Academy",
    category: "Academy & Training",
    durationOrPricing: "Structured 5-Stage Path",
    description: "An intensive applied program moving participants from clarity to real-world deployment: business foundations, copywriting, WhatsApp systems, client implementations, and consulting.",
    highlights: [
      "Hands-on execution over passive theory",
      "Deployment of live client systems & case studies",
      "Mastery from Student → Operator → Leader"
    ],
    ctaLabel: "Explore Academy Path",
    href: "/academy",
  },
  {
    id: "growth-circle",
    title: "BrandMint Growth Circle™",
    tagline: "Exclusive Peer Learning & Mastermind Layer",
    badge: "Community",
    category: "Academy & Training",
    durationOrPricing: "By Application / Invite",
    description: "A curated community of founders, operators, and growth leaders sharing real-world AI strategies, automation blueprints, and practical execution insights.",
    highlights: [
      "Private mastermind sessions & case breakdowns",
      "Early access to incubated IP & automation templates",
      "High-trust peer networking & collaboration"
    ],
    ctaLabel: "Apply for Growth Circle",
    href: "/academy#growth-circle",
  },
  {
    id: "ai-business-partner",
    title: "AI Business Partner™ Program",
    tagline: "Embedded Strategic & Systems Growth Partnership",
    badge: "Strategic Retainer",
    category: "Strategy & Audit",
    durationOrPricing: "Monthly Retainer",
    description: "An ongoing strategic engagement providing dedicated guidance, AI systems architecture, marketing positioning, and continuous operational improvement.",
    highlights: [
      "Dedicated systems thinking & AI leverage",
      "Conversational commerce & funnel architecture",
      "Continuous optimization of business SOPs"
    ],
    ctaLabel: "Partner With Us",
    href: "/business-growth",
  },
  {
    id: "quantum-weave",
    title: "Quantum Weave™ Venture Program",
    tagline: "AI-Powered Community Commerce & Manufacturing",
    badge: "Incubated Venture",
    category: "Venture Studio",
    durationOrPricing: "Enterprise / Ecosystem",
    description: "BrandMint AI's core venture infrastructure connecting buyers, communities, creators, and manufacturing networks through AI demand intelligence and visualizers.",
    highlights: [
      "Community-led commerce & merchandise network",
      "AI Visualizer & automated quote engine",
      "Integrated factory routing & placement pipelines"
    ],
    ctaLabel: "Explore Quantum Weave",
    href: "/quantum-weave",
  },
];


