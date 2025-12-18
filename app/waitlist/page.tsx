import type { Metadata } from "next";
import WaitlistClient from "@/components/WaitlistClient";

export const metadata: Metadata = {
  title: "Join the Evolgrit Waitlist – Learn German & Get Job-Ready for Germany",
  description:
    "Apply for the next Evolgrit batch. Learn German, prepare for jobs in Germany and get guided support from language to onboarding.",
  alternates: { canonical: "/waitlist" },
  openGraph: {
    title: "Join the Evolgrit learner waitlist",
    description:
      "Get notified when the next batch opens. AI-powered German learning, cultural readiness, and job preparation.",
    url: "/waitlist",
  },
};

export default function WaitlistPage() {
  return <WaitlistClient />;
}
