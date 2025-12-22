import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const recommendedRoles = [
  {
    id: "role-1",
    title: "Childcare assistant · Kita Sonnenstrahl",
    summary:
      "Support morning routines, parent conversations and playful German practice with children aged 3–6.",
    requirements: ["German A2+", "Experience with children", "Shift flexibility"],
  },
  {
    id: "role-2",
    title: "Logistics coordinator · UrbanHub",
    summary:
      "Coordinate inbound goods, scanners and safety briefings in a multilingual team.",
    requirements: ["German B1", "Warehouse or logistics experience", "Night shifts possible"],
  },
  {
    id: "role-3",
    title: "Bus driver trainee · CityTransit",
    summary:
      "Hybrid language + driving license upgrade to start in local public transport within 6 months.",
    requirements: ["Driver license", "German A2/B1", "Customer mindset"],
  },
  {
    id: "role-4",
    title: "Care assistant · Seniorenhaus",
    summary:
      "Work alongside senior nurses, focus on everyday German for care situations and family updates.",
    requirements: ["German A2+", "Empathy", "Willingness to learn care vocabulary"],
  },
];

const nextActions = [
  {
    title: "Upload CV / certificates",
    description: "Add PDFs so employers can verify your experience quickly.",
    href: "/dashboard/documents",
    cta: "Go to documents",
  },
  {
    title: "Finish job language module",
    description: "Complete at least one job-focused module per week.",
    href: "/dashboard/modules",
    cta: "Open modules",
  },
  {
    title: "Book employer intro call",
    description: "Meet a hiring partner and get feedback on readiness signals.",
    href: "/dashboard/mentors",
    cta: "Contact mentor",
  },
];

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, german_level, target, current_country")
    .eq("id", data.user.id)
    .single();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Jobs & opportunities
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Recommended roles once your batch unlocks matching.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              These are based on common partner needs. Saving interest now helps us prepare
              interviews when your readiness score is complete.
            </p>
          </div>
          <Link
            href="/dashboard/modules"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Work on job language →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {recommendedRoles.map((role) => (
            <article
              key={role.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{role.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{role.summary}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm hover:border-slate-400"
                >
                  Save interest
                </button>
              </div>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {role.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Your job readiness
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Stay consistent so we can unlock matches.
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">German level</p>
              <p className="text-lg font-semibold text-slate-900">
                {profile?.german_level ?? "Not set"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Target role in Germany</p>
              <p className="text-lg font-semibold text-slate-900">
                {profile?.target ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Current country</p>
              <p className="text-lg font-semibold text-slate-900">
                {profile?.current_country ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Mentor notes</p>
              <p className="text-sm text-slate-600">
                We’ll unlock matches once your profile is complete and modules are up to
                date.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Next actions
          </p>
          <ul className="mt-4 space-y-4">
            {nextActions.map((action) => (
              <li
                key={action.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {action.title}
                    </p>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </div>
                  <Link
                    href={action.href}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm hover:border-slate-400"
                  >
                    {action.cta}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
