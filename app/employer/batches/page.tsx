import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function EmployerBatchesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return null;
  }

  const { data: readinessRows, error } = await supabaseAdmin
    .from("employer_readiness_view")
    .select("readiness_score")
    .gte("readiness_score", 50);

  if (error) {
    console.error("batches readiness error", error);
  }

  const readyCount = readinessRows?.length ?? 0;

  const batches = [
    {
      slug: "alpha",
      name: "Batch Alpha",
      status: "Active",
      startWindow: "Now – Apr 2025",
      description:
        "Care, childcare and drivers focusing on language + cultural readiness.",
      signal: `${readyCount} candidates ready`,
    },
    {
      slug: "beta",
      name: "Batch Beta",
      status: "Upcoming",
      startWindow: "May – Jul 2025",
      description: "Logistics + hospitality learners preparing for relocation.",
      signal: "Recruiting cohort",
    },
    {
      slug: "private",
      name: "Private Beta",
      status: "Invite-only",
      startWindow: "Aug 2025",
      description: "Custom batch for partners with dedicated onboarding support.",
      signal: "Request access",
    },
  ];

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          Batches
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Batches</h1>
        <p className="mt-2 text-sm text-slate-600">
          A batch is a structured group of learners moving through readiness together.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {batches.map((batch) => (
          <article
            key={batch.slug}
            className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between text-sm">
              <h2 className="text-lg font-semibold text-slate-900">{batch.name}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  batch.status === "Active"
                    ? "bg-emerald-50 text-emerald-700"
                    : batch.status === "Upcoming"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {batch.status}
              </span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
              {batch.startWindow}
            </p>
            <p className="mt-3 flex-1 text-sm text-slate-600">{batch.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-slate-500">{batch.signal}</p>
              <a
                href={`/employer/batches/${batch.slug}`}
                className="text-sm font-medium text-slate-900 hover:text-slate-700"
              >
                View batch →
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
