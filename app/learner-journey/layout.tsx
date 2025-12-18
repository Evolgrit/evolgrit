import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learner journey",
  description:
    "See how Evolgrit guides learners from language foundations to job readiness through structured batches, AI coaching, and mentoring.",
  alternates: { canonical: "/learner-journey" },
  openGraph: {
    title: "The Evolgrit learner journey",
    description:
      "A structured batch-based journey from German learning to job readiness in Germany.",
    url: "/learner-journey",
  },
};

export default function LearnerJourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
