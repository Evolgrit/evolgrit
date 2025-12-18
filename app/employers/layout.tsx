import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For employers",
  description:
    "Hire job-ready international talent that’s ready to stay. Evolgrit helps you build a reliable international hiring pipeline.",
  alternates: { canonical: "/employers" },
  openGraph: {
    title: "Evolgrit for Employers",
    description:
      "Access motivated international candidates with language, cultural readiness and reliability signals.",
    url: "/employers",
  },
};

export default function EmployersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
