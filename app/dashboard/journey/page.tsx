import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import NewJourneyEvent from "./new-event";

const statusClasses: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  recorded: "bg-slate-50 text-slate-600 border-slate-100",
  upcoming: "bg-blue-50 text-blue-700 border-blue-100",
};

function formatDate(value?: string | null) {
  if (!value) return "Today";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Today";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default async function JourneyPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: events } = await supabase
    .from("journey_events")
    .select("id, title, detail, event_date, created_at, status, phase")
    .eq("user_id", data.user.id)
    .order("event_date", { ascending: false })
    .limit(25);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr),minmax(0,380px)]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Learner journey timeline
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Document every step toward work in Germany.
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Add milestones, learnings and small wins so mentors and employers can
              see how far you have come. These entries feed your readiness profile.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Reflect on language, culture and job moments.</li>
              <li>• Prepare for mentor calls with concrete examples.</li>
              <li>• Build a story for employers that shows consistency.</li>
            </ul>
            <Link
              href="/dashboard/modules"
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Go to learning modules →
            </Link>
          </div>

          <NewJourneyEvent />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Timeline
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Recent journey entries
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Showing {events?.length ?? 0} items
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {events && events.length > 0 ? (
            events.map((event) => {
              const statusKey = event.status ?? "recorded";
              const badgeClass = statusClasses[statusKey] ?? statusClasses.recorded;

              return (
                <article
                  key={event.id}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {formatDate(event.event_date ?? event.created_at)}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {event.title ?? "Journey moment"}
                      </h3>
                      {event.phase && (
                        <p className="text-xs text-slate-500">{event.phase}</p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${badgeClass}`}
                    >
                      {statusKey.replace(/_/g, " ")}
                    </span>
                  </div>
                  {event.detail && (
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {event.detail}
                    </p>
                  )}
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No journey entries yet. Use the form above to capture your first moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
