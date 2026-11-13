
import { Link } from "react-router-dom";

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

export default function AIAgentsBangalore() {
  return (
    <main className="ai-agents-page">

      {/* Hero */}
      <section>
        <p>AI Agents for Business Automation</p>

        <h1>AI Agents Company in Bangalore</h1>

        <p>
          Automate customer enquiries, lead follow-ups
          and repetitive business processes with AI
          agents designed around your operations.
        </p>

        <p>
          BrandMint AI helps businesses in Bangalore
          design and implement practical AI agents
          for customer communication and workflow
          automation.
        </p>

        <Link to="/contact">
          Book an AI Consultation
        </Link>
      </section>

      {/* Services */}
      <section>
        <h2>AI Agent Development Services in Bangalore</h2>

        <p>
          Explore AI agent solutions designed to
          support customer interactions, organize
          information and automate defined tasks.
        </p>

        <div className="ai-agents-services">
          {services.map((service) => (
            <article key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h2>How AI Agents Help Your Business</h2>

        <ul>
          <li>
            Respond to routine enquiries without
            relying entirely on manual replies.
          </li>

          <li>
            Collect and organize customer details
            for follow-up.
          </li>

          <li>
            Support consistent communication across
            defined customer workflows.
          </li>

          <li>
            Reduce repetitive administrative work.
          </li>

          <li>
            Route important or complex requests
            to employees when required.
          </li>
        </ul>
      </section>

      {/* Industries */}
      <section>
        <h2>AI Agent Solutions for Different Industries</h2>

        <p>
          Our AI automation approach can be adapted
          to businesses managing frequent customer
          interactions and repetitive workflows.
        </p>

        <ul>
          <li>Clinics and healthcare service providers</li>
          <li>Real estate businesses</li>
          <li>Educational institutions</li>
          <li>Retail and e-commerce businesses</li>
          <li>Professional service providers</li>
          <li>Other small and growing businesses</li>
        </ul>
      </section>

      {/* Process */}
      <section>
        <h2>Our AI Agent Implementation Process</h2>

        <ol>
          <li>
            <strong>Workflow Assessment:</strong>
            {" "}Understand your business requirements
            and identify suitable automation tasks.
          </li>

          <li>
            <strong>Solution Design:</strong>
            {" "}Define the AI agent's responsibilities,
            system integrations and human oversight.
          </li>

          <li>
            <strong>Development and Testing:</strong>
            {" "}Configure the workflow and test
            expected scenarios and exceptions.
          </li>

          <li>
            <strong>Deployment and Improvement:</strong>
            {" "}Introduce the solution and improve
            performance using feedback.
          </li>
        </ol>
      </section>

      {/* About */}
      <section>
        <h2>Why Choose BrandMint AI?</h2>

        <p>
          BrandMint AI is a Bangalore-based AI
          automation company focused on practical
          technology solutions for business
          operations and customer communication.
        </p>

        <p>
          We begin by understanding your workflow
          and identifying where an AI agent can
          provide meaningful operational value.
        </p>

        <p>
          Our goal is to build solutions that fit
          your existing processes rather than
          introduce unnecessary complexity.
        </p>

        <p>
          Explore our{" "}
          <Link to="/solutions">
            business automation services
          </Link>
          {" "}and{" "}
          <Link to="/whatsapp-automation-bangalore">
            WhatsApp automation solutions in Bangalore
          </Link>.
        </p>
      </section>

      {/* FAQ */}
      <section>
        <h2>Frequently Asked Questions About AI Agents</h2>

        {faqs.map((faq) => (
          <article key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>

      {/* Contact CTA */}
      <section>
        <h2>Discuss Your AI Agent Requirements</h2>

        <p>
          Looking to automate customer enquiries,
          lead follow-ups or repetitive business
          processes? Talk to BrandMint AI about
          a solution designed for your workflow.
        </p>

        <Link to="/contact">
          Contact BrandMint AI
        </Link>
      </section>

    </main>
  );
}
