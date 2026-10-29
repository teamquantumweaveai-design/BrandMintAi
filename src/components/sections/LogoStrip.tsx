import React from "react";

// Same client logos as the /meta-growth/ page (files live in public/meta-growth/assets/clients).
const LOGOS = [
  { file: "tag.png", name: "TAG", height: 32 },
  { file: "custom-teamwear.png", name: "Custom Teamwear", height: 40 },
  { file: "minibe.png", name: "Minibé Indiranagar", height: 30 },
  { file: "bluewaters.svg", name: "Bluewater Adventure Sports", height: 44 },
];

// Few logos, so each track repeats the set enough times to stay wider than large screens.
const REPEAT = 6;

function Track({ hidden }: { hidden?: boolean }) {
  // Two identical tracks loop seamlessly; only the first set in the first track is read out.
  return (
    <ul className="logo-marquee-track" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }, () => LOGOS).flat().map((logo, i) => (
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
