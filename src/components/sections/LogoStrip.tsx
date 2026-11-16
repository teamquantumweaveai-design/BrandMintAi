
import React from "react";

// Optimized client logo assets.
// Original files remain available in the public directory.
const LOGOS = [
  {
    file: "tag.png",
    name: "TAG",
    height: 32,
  },
  {
    file: "custom-teamwear.webp",
    name: "Custom Teamwear",
    height: 40,
  },
  {
    file: "minibe.webp",
    name: "Minibé Indiranagar",
    height: 30,
  },
  {
    file: "bluewaters.svg",
    name: "Bluewater Adventure Sports",
    height: 44,
  },
  {
    file: "shree-krishna-gaana-nilaya.webp",
    name: "Shree Krishna Gaana Nilaya",
    height: 52,
  },
];

const REPEAT = 6;
const BASE_PATH = "/meta-growth/assets/clients/";

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className="logo-marquee-track"
      aria-hidden={hidden || undefined}
    >
      {Array.from(
        { length: REPEAT },
        () => LOGOS
      )
        .flat()
        .map((logo, i) => (
          <li
            key={i}
            aria-hidden={
              i >= LOGOS.length || undefined
            }
          >
            <img
              src={`${BASE_PATH}${logo.file}`}
              alt={
                hidden || i >= LOGOS.length
                  ? ""
                  : logo.name
              }
              style={{
                height: logo.height,
                width: "auto",
              }}
              loading="lazy"
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
