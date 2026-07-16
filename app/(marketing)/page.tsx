import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import LogoStrip from "@/components/sections/LogoStrip";
import FeatureGrid from "@/components/sections/FeatureGrid";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import GradientText from "@/components/ui/GradientText";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero
          title={
            <>
              Architecting the Next Era of <br />
              <GradientText>Autonomic Ventures</GradientText>
            </>
          }
          subtitle="A premium corporate venture studio and intelligent automation ecosystem mapping business processes into cognitive, self-sustaining software systems."
          showStats={true}
        />
        <LogoStrip />
        <FeatureGrid />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
