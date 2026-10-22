import React from "react";

// Same client logos as the /meta-growth/ page (files live in public/meta-growth/assets/clients).
const LOGOS = [
  { file: "ey.png", name: "EY", height: 30 },
  { file: "buhler.png", name: "Bühler", height: 16 },
  { file: "bluewaters.svg", name: "Bluewater Adventure Sports", height: 34 },
  { file: "ramaiah.svg", name: "Ramaiah", height: 29 },
  { file: "toyota.png", name: "Toyota", height: 32 },
  { file: "tata-power-solar.png", name: "Tata Power Solar", height: 30 },
  { file: "canara-bank.png", name: "Canara Bank", height: 24 },
  { file: "bel-officers-club.png", name: "Bharat Electronics Officers' Club", height: 40 },
  { file: "ctdi.png", name: "CTDI", height: 22 },
  { file: "coe-hm.png", name: "H&M Center of Excellence", height: 36 },
  { file: "st-josephs.png", name: "St Joseph's School", height: 40 },
  { file: "vision-india.png", name: "Vision India", height: 22 },
  { file: "feather.png", name: "Feather Z-16", height: 38 },
  { file: "applied-materials.png", name: "Applied Materials", height: 32 },
  { file: "tag.png", name: "TAG", height: 30 },
  { file: "custom-teamwear.png", name: "Custom Teamwear", height: 38 },
];

function Track({ hidden }: { hidden?: boolean }) {
  // Each track holds the set twice so it always covers wide screens; two tracks loop seamlessly.
  return (
    <ul className="logo-marquee-track" aria-hidden={hidden || undefined}>
      {[...LOGOS, ...LOGOS].map((logo, i) => (
        <li key={i} aria-hidden={i >= LOGOS.length || undefined}>
          <img
            src={`/meta-growth/assets/clients/${logo.file}`}
            alt={hidden || i >= LOGOS.length ? "" : logo.name}
            style={{ height: logo.height }}
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
}

export default function LogoStrip() {
  return (
    <section className="py-10 sm:py-12 bg-white border-y border-[#CBD6E2]/60 relative z-10 w-full overflow-hidden">
      <p className="mb-6 px-6 text-xs uppercase font-semibold text-[#516F90] tracking-widest text-center">
        Brands our group has delivered for
      </p>
      <div className="logo-marquee">
        <Track />
        <Track hidden />
      </div>
    </section>
  );
}
