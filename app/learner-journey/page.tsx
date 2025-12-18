import type { Metadata } from "next";
import LearnerJourneyClient from "@/components/LearnerJourneyClient";

export const metadata: Metadata = {
  title: "How Evolgrit Works – From German Learning to Job Placement",
  description:
    "See how Evolgrit guides learners from German language training to job readiness and successful onboarding in Germany.",
  alternates: { canonical: "/learner-journey" },
  openGraph: {
    title: "The Evolgrit learner journey",
    description:
      "A structured batch-based journey from German learning to job readiness in Germany.",
    url: "/learner-journey",
  },
};

export default function LearnerJourneyPage() {
  return <LearnerJourneyClient />;
}
