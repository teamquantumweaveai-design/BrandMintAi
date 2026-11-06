import React, { useEffect } from 'react';
import './WhatsAppAutomationBangalore.css';

const PHONE = '919972965677';
const WA_TEXT = encodeURIComponent('Hello BrandMint AI, I would like a WhatsApp automation demo for my business in Bangalore.');
const WHATSAPP = `https://wa.me/${PHONE}?text=${WA_TEXT}`;

const capabilities = [
  { num: '01', title: 'Instant enquiry handling', body: 'Greet incoming leads, collect key details and route conversations to the right team.' },
  { num: '02', title: 'Lead qualification', body: 'Ask useful questions, capture confirmed answers and make follow-ups easier for your sales team.' },
  { num: '03', title: 'CRM and Google Sheets', body: 'Connect approved workflows with your existing systems, where supported by the tools and APIs.' },
  { num: '04', title: 'Customer updates', body: 'Send permitted order, appointment or service updates through appropriate WhatsApp messaging workflows.' },
  { num: '05', title: 'AI-assisted conversations', body: 'Handle routine questions with well-designed AI assistance and clear escalation boundaries.' },
  { num: '06', title: 'Human handoff', body: 'Transfer conversations to your team when customers need personal attention or an exception arises.' }
];
const steps = [
  { n: '01', title: 'Discover', body: 'We understand your enquiries, team workload and existing tools.' },
  { n: '02', title: 'Design', body: 'We map the conversation journey, permissions and handoff rules.' },
  { n: '03', title: 'Implement', body: 'We connect the approved platform, integrations and message flows.' },
  { n: '04', title: 'Improve', body: 'We test with real scenarios and refine based on measurable results.' }
];
const faqs = [
  { q: 'What is WhatsApp automation for business?', a: 'It is a set of approved message flows, integrations and optional AI assistance that helps businesses handle enquiries, collect information, follow up appropriately and route conversations.' },
  { q: 'Do I need the WhatsApp Business Platform (API)?', a: 'It depends on your use case and volume. Advanced multi-user integrations and certain automated messaging workflows may require WhatsApp Business Platform access through an eligible setup.' },
  { q: 'Can you connect WhatsApp with my CRM or Google Sheets?', a: 'Often, yes, subject to your current software, available APIs, permissions and data handling requirements. We assess compatibility during discovery.' },
  { q: 'Can automation send promotional messages to everyone?', a: 'No. Businesses must follow Meta’s current WhatsApp policies, including applicable opt-in, template and customer-service window requirements. We design workflows around those rules.' },
  { q: 'How much does WhatsApp automation cost in Bangalore?', a: 'Pricing depends on conversation volume, message types, integrations, AI requirements and ongoing support. Platform and messaging charges may be separate from implementation fees. Request a scoped proposal.' },
  { q: 'Can a person take over a chatbot conversation?', a: 'Yes. Where supported by the selected platform, we can design handoff rules so a team member handles sensitive, complex or high-value enquiries.' }
];

function Arrow() { return <span aria-hidden="true">↗</span>; }
function ContactButton({ children = 'Book a WhatsApp demo', secondary = false }) {
  return <a className={`bmwa-button ${secondary ? 'bmwa-button-outline' : ''}`} href={WHATSAPP} target="_blank" rel="noopener noreferrer">{children} <Arrow /></a>;
}

export default function WhatsAppAutomationBangalore() {
  useEffect(() => {
    // The site's global brandmint-seo.js should also have a matching route entry.
    const title = 'WhatsApp Automation Company in Bangalore | BrandMint AI';
    const description = 'WhatsApp automation services in Bangalore by BrandMint AI. Automate enquiries, lead qualification, CRM updates and human handoffs. Book a demo.';
    document.title = title;
    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, selector.includes('property=') ? 'og:description' : selector.includes('name="robots"') ? 'robots' : 'description'); document.head.appendChild(el); }
      el.setAttribute('content', value);
    };
    setMeta('meta[name="description"]', 'name', description);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = 'https://brandmintai.io/whatsapp-automation-bangalore';
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'bmwa-structured-data';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@graph': [
        { '@type': 'WebPage', '@id': 'https://brandmintai.io/whatsapp-automation-bangalore#webpage', url: 'https://brandmintai.io/whatsapp-automation-bangalore', name: title, description, inLanguage: 'en-IN' },
        { '@type': 'Service', name: 'WhatsApp Automation Services in Bangalore', serviceType: 'WhatsApp business workflow automation and integrations', provider: { '@type': 'Organization', name: 'BrandMint AI Pvt. Ltd.', url: 'https://brandmintai.io/' }, areaServed: { '@type': 'City', name: 'Bengaluru' }, url: 'https://brandmintai.io/whatsapp-automation-bangalore' },
        { '@type': 'FAQPage', mainEntity: faqs.map(({q,a}) => ({ '@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: a} })) }
      ]
    });
    document.getElementById(ld.id)?.remove();
    document.head.appendChild(ld);
    return () => { ld.remove(); };
  }, []);

  return <div className="bmwa">
    <header className="bmwa-topbar">
      <a href="/" className="bmwa-logo" aria-label="BrandMint AI homepage"><span className="bmwa-logo-icon">B</span><span>BrandMint <b>AI</b><small>PRIVATE LIMITED</small></span></a>
      <nav aria-label="Landing page navigation"><a href="#solutions">Solutions</a><a href="#process">How it works</a><a href="#faq">FAQs</a></nav>
      <a href={WHATSAPP} className="bmwa-nav-cta" target="_blank" rel="noopener noreferrer">Book a demo <Arrow /></a>
    </header>

    <main>
      <section className="bmwa-hero">
        <div className="bmwa-wrap bmwa-hero-grid">
          <div>
            <p className="bmwa-eyebrow"><span className="bmwa-dot"/> WHATSAPP AUTOMATION · BANGALORE</p>
            <h1>Every customer enquiry deserves <em>a better response.</em></h1>
            <p className="bmwa-lede">Custom WhatsApp automation for Bangalore businesses. Capture enquiries, qualify leads, connect your tools and hand over to your team at the right moment.</p>
            <div className="bmwa-actions"><ContactButton>Book your free discovery call</ContactButton><a className="bmwa-link" href="#solutions">Explore the solutions <Arrow /></a></div>
            <div className="bmwa-hero-points"><span>✓ Workflow-first approach</span><span>✓ CRM integration options</span><span>✓ Human handoff</span></div>
          </div>
          <div className="bmwa-illustration" aria-label="Illustration of an automated WhatsApp lead conversation">
            <div className="bmwa-illus-top"><span className="bmwa-avatar">B</span><span><strong>BrandMint AI</strong><small>Example automation journey</small></span><span className="bmwa-online">●</span></div>
            <div className="bmwa-chat-body">
              <div className="bmwa-bubble incoming">Hi! I'd like to know about your service.</div>
              <div className="bmwa-bubble outgoing">Welcome! 👋 What would you like help with today?</div>
              <div className="bmwa-options"><span>Explore services</span><span>Book a consultation</span></div>
              <div className="bmwa-bubble incoming">Book a consultation</div>
              <div className="bmwa-bubble outgoing">Great. I'll collect a few details so our team can help.</div>
            </div>
            <div className="bmwa-flow"><span>Enquiry received</span><b>→</b><span>Lead qualified</span><b>→</b><span>Team notified</span></div>
            <p className="bmwa-illus-caption">Illustrative workflow, not a live product screenshot.</p>
          </div>
        </div>
      </section>

      <section className="bmwa-strip" aria-label="Our focus"><div className="bmwa-wrap bmwa-strip-inner"><span>Less manual repetition.</span><span>Better lead visibility.</span><span>Clearer customer conversations.</span></div></section>

      <section className="bmwa-section" id="solutions"><div className="bmwa-wrap">
        <div className="bmwa-section-heading"><p className="bmwa-kicker">WHAT WE CAN BUILD</p><h2>WhatsApp automation built around <em>your workflow.</em></h2><p>From a first enquiry to a meaningful next step, the right system should simplify work for both customers and teams.</p></div>
        <div className="bmwa-card-grid">{capabilities.map(x => <article className="bmwa-card" key={x.num}><span className="bmwa-card-num">{x.num}</span><h3>{x.title}</h3><p>{x.body}</p></article>)}</div>
      </div></section>

      <section className="bmwa-section bmwa-section-alt"><div className="bmwa-wrap bmwa-split">
        <div><p className="bmwa-kicker">WHO IT'S FOR</p><h2>Built for businesses that cannot afford to lose context.</h2><p className="bmwa-muted">No one-size-fits-all bot. We start with the actual customer journey, the information your team needs and the next useful action.</p><ContactButton>Discuss your use case</ContactButton></div>
        <div className="bmwa-usecases">
          {['Retail & ecommerce — enquiries, product selection and order updates','Clinics & services — appointment requests and human escalation','Education & training — course enquiries and lead routing','B2B sales — qualification, reminders and CRM updates'].map(x => <div key={x}><span>✓</span>{x}</div>)}
        </div>
      </div></section>

      <section className="bmwa-section" id="process"><div className="bmwa-wrap"><div className="bmwa-section-heading"><p className="bmwa-kicker">OUR IMPLEMENTATION PROCESS</p><h2>Simple for customers. <em>Thoughtful underneath.</em></h2></div><div className="bmwa-steps">{steps.map(x => <article key={x.n}><span>{x.n}</span><h3>{x.title}</h3><p>{x.body}</p></article>)}</div></div></section>

      <section className="bmwa-banner"><div className="bmwa-wrap bmwa-banner-inner"><div><p className="bmwa-kicker">NOT SURE WHERE TO START?</p><h2>Start with one real business bottleneck.</h2><p>We can review your enquiry journey and identify a practical first automation.</p></div><ContactButton>Talk to BrandMint AI</ContactButton></div></section>

      <section className="bmwa-section bmwa-faq" id="faq"><div className="bmwa-wrap"><div className="bmwa-section-heading"><p className="bmwa-kicker">FREQUENTLY ASKED QUESTIONS</p><h2>Answers before you automate.</h2></div><div className="bmwa-faq-list">{faqs.map(x => <details key={x.q}><summary>{x.q}<span aria-hidden="true">+</span></summary><p>{x.a}</p></details>)}</div></div></section>

      <section className="bmwa-last"><div className="bmwa-wrap"><p className="bmwa-kicker">BRANDMINT AI · BENGALURU</p><h2>Make every enquiry easier to act on.</h2><p>Tell us what your team manages manually. We'll explore a practical WhatsApp automation workflow.</p><ContactButton>Book a WhatsApp automation demo</ContactButton><div className="bmwa-contact"><a href="tel:+919972965677">+91 99729 65677</a><a href="mailto:connect@brandmintai.io">connect@brandmintai.io</a></div></div></section>
    </main>
    <footer className="bmwa-footer"><div className="bmwa-wrap"><div><strong>BrandMint AI Pvt. Ltd.</strong><p>No. 3, Lingappa Layout, 1st Cross, Sri Sri Sri Shivakumara Swamiji Road, Bengaluru – 560090</p></div><div><a href="/">Home</a><a href="/solutions">Solutions</a><a href="/contact">Contact</a></div></div></footer>
  </div>;
}
