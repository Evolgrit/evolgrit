import type { Metadata } from "next";
import EmployersClient from "@/components/EmployersClient";

export const metadata: Metadata = {
  title: "Hire International Talent for Germany – Language-Ready & Job-Prepared",
  description:
    "Evolgrit helps employers hire international talent prepared for Germany with language skills, cultural readiness and onboarding support.",
  alternates: { canonical: "/employers" },
  openGraph: {
    title: "Evolgrit for Employers",
    description:
      "Access motivated international candidates with language, cultural readiness and reliability signals.",
    url: "/employers",
  },
};

export default function EmployersPage() {
  return <EmployersClient />;
}
