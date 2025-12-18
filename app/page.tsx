import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "Evolgrit – German Language & Job Preparation for Working in Germany",
  description:
    "Evolgrit prepares international talent for working in Germany with AI-powered German learning, job readiness and guided onboarding.",
};

export default function HomePage() {
  return <HomePageClient />;
}
