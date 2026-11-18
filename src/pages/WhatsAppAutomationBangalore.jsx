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
