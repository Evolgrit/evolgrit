"use client";

import MarketingTopbar from "./MarketingTopbar";
import { Reveal } from "@/components/ui/Reveal";
import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { JourneyPreviewSection } from "@/components/marketing/sections/JourneyPreviewSection";
import { EmployersSection } from "@/components/marketing/sections/EmployersSection";
import { BrandMeaningSection } from "@/components/marketing/sections/BrandMeaningSection";
import { WhoSection } from "@/components/marketing/sections/WhoSection";
import { FinalCtaSection } from "@/components/marketing/sections/FinalCtaSection";

export default function HomePageClient() {
  return (
    <>
      <MarketingTopbar />
      <main className="min-h-screen bg-slate-50 pb-16 text-slate-900">
        <Reveal delayMs={180}>
          <HeroSection />
        </Reveal>

        <Reveal delayMs={260}>
          <WhoSection variant="preview" />
        </Reveal>

        <Reveal delayMs={320}>
          <JourneyPreviewSection />
        </Reveal>

        <Reveal delayMs={380}>
          <EmployersSection variant="preview" />
        </Reveal>

        <Reveal delayMs={440}>
          <BrandMeaningSection ctaVariant="preview" />
        </Reveal>

        <Reveal delayMs={500}>
          <FinalCtaSection />
        </Reveal>
      </main>
    </>
  );
}
