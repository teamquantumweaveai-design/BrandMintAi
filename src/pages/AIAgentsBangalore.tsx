
import { Link } from "react-router-dom";

// AI Agent Services
const services = [
  {
    title: "AI Voice Agents",
    description:
      "Assist with incoming calls, capture enquiries, answer common questions and route requests to your team."
  },
  {
    title: "WhatsApp AI Agents",
    description:
      "Respond to WhatsApp enquiries, collect customer requirements and support structured lead follow-ups."
  },
  {
    title: "AI Customer Support Agents",
    description:
      "Help customers find information and escalate complex enquiries to your support team."
  },
  {
    title: "AI Lead Qualification Agents",
    description:
      "Ask relevant questions, capture lead details and prepare information for sales follow-ups."
  },
  {
    title: "AI Workflow Automation",
    description:
      "Connect repetitive business tasks with approved tools and workflows to reduce manual work."
  },
  {
    title: "Custom AI Agent Development",
    description:
      "Design AI assistants around your business processes, integrations and operational needs."
  }
];

// Frequently Asked Questions
const faqs = [
  {
    question: "What is an AI agent for business?",
    answer:
      "An AI agent is software that uses artificial intelligence to interpret requests and perform defined tasks. Businesses can use AI agents for customer enquiries, lead follow-ups and workflow automation."
  },
  {
    question: "Can AI agents integrate with WhatsApp?",
    answer:
      "Yes. AI agents can be connected to supported WhatsApp Business messaging workflows, subject to the required platform permissions and integration setup."
  },
  {
    question: "Can AI agents connect with our CRM?",
    answer:
      "AI agents can integrate with compatible CRM systems to collect lead information, update records and support follow-up workflows."
  },
  {
    question: "How much does AI agent development cost?",
    answer:
      "The cost depends on the workflow complexity, integrations, usage requirements and ongoing support. BrandMint AI can assess your requirements and prepare a suitable proposal."
  },
  {
    question: "Can AI agents replace our employees?",
    answer:
      "AI agents can handle defined repetitive tasks and support employees. Sensitive, complex or exceptional situations can be routed to human team members."
  }
];

const benefits = [
  "Respond to routine enquiries without relying entirely on manual replies.",
  "Collect and organize customer details for follow-up.",
  "Support consistent communication across defined customer workflows.",
  "Reduce repetitive administrative work.",
  "Route important or complex requests to employees when required."
];

const industries = [
  "Clinics and Healthcare Service Providers",
  "Real Estate Businesses",
  "Educational Institutions",
  "Retail and E-commerce Businesses",
  "Professional Service Providers",
  "Small and Growing Businesses"
];

const process = [
  {
    number: "01",
    title: "Workflow Assessment",
    description:
      "Understand your business requirements and identify suitable automation tasks."
  },
  {
    number: "02",
    title: "Solution Design",
    description:
      "Define the AI agent's responsibilities, system integrations and human oversight."
  },
  {
    number: "03",
    title: "Development and Testing",
    description:
      "Configure the workflow and test expected scenarios and exceptions."
  },
  {
    number: "04",
    title: "Deployment and Improvement",
    description:
      "Introduce the solution and improve performance using feedback."
  }
];

export default function AIAgentsBangalore() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#101A30] to-[#0B0F19] px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-blue-900/10" />

        <div className="relative mx-auto max-w-6xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            AI Agents for Business Automation
          </p>

          <h1 className="mb-8 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            AI Agents Company in{" "}
            <span className="text-cyan-400">
              Bangalore
            </span>
          </h1>

          <p className="mb-5 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
            Automate customer enquiries, lead follow-ups
            and repetitive business processes with AI
            agents designed around your operations.
          </p>

          <p className="mb-10 max-w-3xl leading-relaxed text-gray-400">
            BrandMint AI helps businesses in Bangalore
            design and implement practical AI agents
            for customer communication and workflow
            automation.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-[#0B0F19] transition-colors hover:bg-cyan-400"
          >
            Book an AI Consultation
          </Link>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-[#0F172A] px-6 py-20">
        <div className="mx-auto max-w-6xl">

          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            AI Agent Development Services in Bangalore
          </h2>

          <p className="mb-12 max-w-3xl leading-relaxed text-gray-400">
            Explore AI agent solutions designed to
            support customer interactions, organize
            information and automate defined tasks.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-white/10 bg-[#111827] p-7 transition-colors hover:border-cyan-500/40"
              >
                <h3 className="mb-4 text-xl font-semibold">
                  {service.title}
                </h3>

                <p className="leading-relaxed text-gray-400">
                  {service.description}
                </p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl font-bold md:text-4xl">
            How AI Agents Help Your Business
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-300"
              >
                <span
                  className="mr-3 font-bold text-cyan-400"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES SECTION */}
      <section className="bg-[#0F172A] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            AI Agent Solutions for Different Industries
          </h2>

          <p className="mb-10 max-w-3xl leading-relaxed text-gray-400">
            Our AI automation approach can be adapted
            to businesses managing frequent customer
            interactions and repetitive workflows.
          </p>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <div
                key={industry}
                className="rounded-xl border border-white/10 bg-[#111827] p-6 font-medium text-gray-200"
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold md:text-4xl">
            Our AI Agent Implementation Process
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {process.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-white/10 bg-[#111827] p-7"
              >
                <span className="text-lg font-bold text-cyan-400">
                  {step.number}
                </span>

                <h3 className="mb-3 mt-3 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="leading-relaxed text-gray-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BRANDMINT AI */}
      <section className="bg-[#0F172A] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-bold md:text-4xl">
            Why Choose BrandMint AI?
          </h2>

          <p className="mb-5 max-w-3xl leading-relaxed text-gray-300">
            BrandMint AI is a Bangalore-based AI
            automation company focused on practical
            technology solutions for business
            operations and customer communication.
          </p>

          <p className="mb-5 max-w-3xl leading-relaxed text-gray-400">
            We begin by understanding your workflow
            and identifying where an AI agent can
            provide meaningful operational value.
          </p>

          <p className="mb-8 max-w-3xl leading-relaxed text-gray-400">
            Our goal is to build solutions that fit
            your existing processes rather than
            introduce unnecessary complexity.
          </p>

          <p className="max-w-3xl leading-relaxed text-gray-400">
            Explore our{" "}
            <Link
              to="/solutions"
              className="text-cyan-400 hover:underline"
            >
              business automation services
            </Link>
            {" "}and{" "}
            <Link
              to="/whatsapp-automation-bangalore"
              className="text-cyan-400 hover:underline"
            >
              WhatsApp automation solutions in Bangalore
            </Link>.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-3xl font-bold md:text-4xl">
            Frequently Asked Questions About AI Agents
          </h2>

          <div className="space-y-5">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-white/10 bg-[#111827] p-6"
              >
                <h3 className="mb-3 text-lg font-semibold">
                  {faq.question}
                </h3>

                <p className="leading-relaxed text-gray-400">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CONTACT SECTION */}
      <section className="bg-gradient-to-r from-blue-950/50 to-purple-950/40 px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Discuss Your AI Agent Requirements
          </h2>

          <p className="mb-10 leading-relaxed text-gray-300">
            Looking to automate customer enquiries,
            lead follow-ups or repetitive business
            processes? Talk to BrandMint AI about
            a solution designed for your workflow.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-[#0B0F19] transition-colors hover:bg-cyan-400"
          >
            Contact BrandMint AI
          </Link>
        </div>
      </section>

    </main>
  );
}
