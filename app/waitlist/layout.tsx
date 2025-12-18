import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the learner waitlist",
  description:
    "Join the Evolgrit learner waitlist and get notified when the next batch opens. Learn German faster, become job-ready, and start your career in Germany.",
  alternates: { canonical: "/waitlist" },
  openGraph: {
    title: "Join the Evolgrit learner waitlist",
    description:
      "Get notified when the next batch opens. AI-powered German learning, cultural readiness, and job preparation.",
    url: "/waitlist",
  },
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
