import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const services = [
  {
    title: "Lead Capture & Routing",
    description:
      "Bring enquiries from forms, campaigns and approved channels into a structured process, then route them to the right team member.",
  },
  {
    title: "CRM Integration",
    description:
      "Connect supported CRM systems and business tools to reduce duplicate entry and keep lead information organized.",
  },
  {
    title: "Sales Follow-up Workflows",
    description:
      "Set up reminders, task assignments and consent-based follow-up workflows so opportunities do not rely on manual tracking alone.",
  },
  {
    title: "WhatsApp & Enquiry Automation",
    description:
      "Connect approved WhatsApp business workflows to lead qualification, customer responses and handoff to your sales team.",
  },
  {
    title: "Pipeline Visibility",
    description:
      "Track lead stages, owners and next actions to give your team a clearer view of active opportunities.",
  },
  {
    title: "Custom Business Workflows",
    description:
      "Design integrations and automation around your team's existing process, tools and approval requirements.",
  },
];

const steps = [
  "Understand your lead sources and sales process",
  "Identify manual handoffs, delays and missing information",
  "Design the CRM integration and follow-up workflow",
  "Implement, test and hand over the approved workflow",
];

const faqs = [
  {
    question: "What is CRM automation?",
    answer:
      "CRM automation uses connected tools and rules to organize lead data, assign tasks, schedule follow-ups and reduce repetitive sales administration.",
  },
  {
    question: "Can CRM automation connect with WhatsApp?",
    answer:
      "Depending on your CRM and WhatsApp Business setup, supported integrations can help route customer enquiries, record lead details and support consent-based follow-ups.",
  },
  {
    question: "Do we need to replace our existing CRM?",
    answer:
      "Not necessarily. We first review your current CRM and integrations. If your tools support the required workflow, we can plan around the existing setup.",
  },
  {
    question: "Is CRM automation suitable for small businesses in Bangalore?",
    answer:
      "It can be useful for small teams that receive recurring enquiries and need structured ownership, follow-up reminders and visibility into the sales process.",
  },
];

export default function CRMAutomationBangalore() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8F9FA] text-[#2E384D]">
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#DF441F]">
              BrandMint AI · Bengaluru
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              CRM Automation Services in Bangalore
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#516F90] md:text-lg">
              Organize enquiries, connect business tools and build reliable sales
              follow-up workflows. BrandMint AI helps Bangalore businesses
              reduce manual lead handling through practical CRM automation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5C35] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#DF441F]"
              >
                Discuss Your CRM Workflow <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 rounded-full border border-[#CBD6E2] px-7 py-3.5 text-sm font-semibold text-[#2E384D] transition-colors hover:border-[#FF5C35]"
              >
                Explore Our Solutions
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20" aria-labelledby="crm-services-heading">
          <div className="mx-auto max-w-7xl px-6">
            <h2 id="crm-services-heading" className="text-3xl font-bold md:text-4xl">
              CRM and Sales Automation Solutions
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-[#516F90]">
              We plan automation around your actual lead sources, tools and team
              responsibilities rather than forcing a one-size-fits-all setup.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="rounded-2xl border border-[#CBD6E2] bg-white p-7 shadow-sm">
                  <CheckCircle2 className="mb-4 h-6 w-6 text-[#FF5C35]" />
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#516F90]">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20" aria-labelledby="crm-process-heading">
          <div className="mx-auto max-w-7xl px-6">
            <h2 id="crm-process-heading" className="text-3xl font-bold md:text-4xl">
              How We Approach CRM Automation
            </h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-4 rounded-2xl border border-[#CBD6E2] bg-[#F8F9FA] p-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF2EE] font-bold text-[#DF441F]">
                    {index + 1}
                  </span>
                  <span className="pt-1 font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-20" aria-labelledby="crm-related-heading">
          <div className="mx-auto max-w-7xl px-6">
            <h2 id="crm-related-heading" className="text-3xl font-bold md:text-4xl">
              Explore Related Automation Services
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link to="/whatsapp-automation-bangalore" className="rounded-2xl border border-[#CBD6E2] bg-white p-7 transition-colors hover:border-[#FF5C35]">
                <h3 className="text-lg font-bold">WhatsApp Automation in Bangalore</h3>
                <p className="mt-2 text-sm text-[#516F90]">Learn how WhatsApp enquiry workflows can connect with your customer follow-up process.</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#DF441F]">Explore WhatsApp Automation <ArrowRight className="h-4 w-4" /></span>
              </Link>
              <Link to="/ai-agents-bangalore" className="rounded-2xl border border-[#CBD6E2] bg-white p-7 transition-colors hover:border-[#FF5C35]">
                <h3 className="text-lg font-bold">AI Agents in Bangalore</h3>
                <p className="mt-2 text-sm text-[#516F90]">Explore AI agents that assist with enquiries, qualification and operational workflows.</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#DF441F]">Explore AI Agents <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-20" aria-labelledby="crm-faq-heading">
          <div className="mx-auto max-w-4xl px-6">
            <h2 id="crm-faq-heading" className="text-3xl font-bold md:text-4xl">
              CRM Automation FAQs
            </h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-[#CBD6E2] p-6">
                  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#516F90]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <MessageCircle className="mx-auto mb-4 h-9 w-9 text-[#FF5C35]" />
            <h2 className="text-3xl font-bold md:text-4xl">Make Your Lead Follow-ups Easier to Manage</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#516F90]">
              Tell us which tools you use and where enquiries or follow-ups get stuck.
              We can discuss a practical automation approach for your business.
            </p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF5C35] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#DF441F]">
              Contact BrandMint AI <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
