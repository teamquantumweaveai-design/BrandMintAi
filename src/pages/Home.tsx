                  {/* Right visual representation */}
                  <div className="lg:col-span-5 relative w-full h-[280px] md:h-[320px] rounded-2xl border border-[#CBD6E2] overflow-hidden flex items-center justify-center p-[1px] bg-[#F8F9FA]">
                    <div className="absolute inset-0 grid-bg opacity-30 z-0" />
                    
                    <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                      <div className="w-20 h-20 rounded-full border border-[#FFDCD3] flex items-center justify-center bg-[#FFF2EE] shadow-sm text-[#FF5C35]">
                        <Network className="w-8 h-8 animate-spin-slow" />
                      </div>
                      <span className="font-display text-sm font-bold text-[#2E384D] tracking-wide">{venture.name}</span>
                      <span className="text-xs text-[#516F90] font-medium">Active Portfolio Venture</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY BRANDMINT AI SECTION */}
        <section id="why-brandmint" className="py-24 bg-white border-t border-[#CBD6E2]/60 relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center flex flex-col gap-4 mb-20">
              <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest">
                Our Differentiators
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#2E384D]">
                {WHY_BRANDMINT_COPY.title}
              </h2>
              <p className="text-[#516F90] text-sm md:text-base max-w-xl mx-auto font-normal leading-relaxed">
                {WHY_BRANDMINT_COPY.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {WHY_BRANDMINT_COPY.pillars.map((pillar, idx) => (
                <div key={idx} className="flex flex-col gap-4 p-8 rounded-2xl border border-[#CBD6E2] bg-[#F8F9FA] hover:border-[#FF5C35]/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF5C35] shadow-[0_0_8px_rgba(255,92,53,0.4)]" />
                    <h3 className="text-lg font-bold font-display text-[#2E384D]">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-[#516F90] text-sm leading-relaxed font-normal pl-5">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto mt-12">
              <div className="p-8 rounded-3xl bg-[#FFF2EE] border border-[#FFDCD3] text-center flex flex-col gap-4 shadow-xs">
                <span className="text-xs font-mono uppercase tracking-wider text-[#DF441F] font-bold">Our Promise</span>
                <p className="text-[#2E384D] text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                  "{WHY_BRANDMINT_COPY.promise}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* START A CONVERSATION / CTA SECTION - HubSpot Signature Deep Forest Teal Banner */}
        <section id="contact" className="py-24 bg-[#F8F9FA] border-t border-[#CBD6E2]/60 relative z-10 w-full overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#0D3330] p-10 md:p-16 text-center flex flex-col items-center gap-8">
              {/* Radial glow accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5C35]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D3E50]/40 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF7A59] relative z-10">
                <span>Join the Ecosystem</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-display !text-white tracking-tight leading-tight relative z-10">
                {CONTACT_COPY.title}
              </h2>
              <p className="text-[#A5C4BD] text-base leading-relaxed max-w-xl mx-auto font-light relative z-10">
                {CONTACT_COPY.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2 relative z-10">
                <Link
                  to={CONTACT_COPY.ctaButtons[1].href}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FF5C35] hover:bg-[#DF441F] text-white font-semibold text-sm hover:scale-102 hover:shadow-[0_4px_20px_rgba(255,92,53,0.4)] transition-all"
                >
                  <span>{CONTACT_COPY.ctaButtons[1].label}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <a
                  href={CONTACT_COPY.ctaButtons[2].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/25 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: {CONTACT_COPY.whatsapp}</span>
                </a>
              </div>

              {/* Bengaluru Contact Info */}
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center gap-2 text-xs text-[#CBD6E2] relative z-10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7A59]" />
                  <span className="font-semibold text-white">{CONTACT_COPY.companyName}</span>
                </div>
                <span className="max-w-md text-center font-light leading-relaxed text-[#CBD6E2]/80">
                  {CONTACT_COPY.address.join(" ")}
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
