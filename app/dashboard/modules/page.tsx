import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ModuleRow = {
  id: string;
  phase: string | null;
  phase_label: string | null;
  title: string | null;
  description: string | null;
  kind: string | null;
  order_index: number | null;
  estimated_minutes: number | null;
};

type ModuleProgressRow = {
  module_id: string;
  status: "not_started" | "in_progress" | "completed";
};

function normalizePhaseLabel(value?: string | null) {
  if (!value) return "Journey modules";
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function normalizeKind(value?: string | null) {
  if (!value) return "Module";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const statusCopy: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

async function startModuleAction(formData: FormData) {
  "use server";
  const moduleId = formData.get("moduleId");
  if (typeof moduleId !== "string") return;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const now = new Date().toISOString();
  await supabase
    .from("module_progress")
    .upsert(
      {
        module_id: moduleId,
        user_id: data.user.id,
        status: "in_progress",
        started_at: now,
        completed_at: null,
      },
      { onConflict: "module_id,user_id" }
    );

  revalidatePath("/dashboard/modules");
  revalidatePath("/dashboard");
}

async function completeModuleAction(formData: FormData) {
  "use server";
  const moduleId = formData.get("moduleId");
  if (typeof moduleId !== "string") return;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from("module_progress")
    .select("started_at")
    .eq("user_id", data.user.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  const startedAt = existing?.started_at ?? now;

  await supabase
    .from("module_progress")
    .upsert(
      {
        module_id: moduleId,
        user_id: data.user.id,
        status: "completed",
        started_at: startedAt,
        completed_at: now,
      },
      { onConflict: "module_id,user_id" }
    );

  revalidatePath("/dashboard/modules");
  revalidatePath("/dashboard");
}

export default async function ModulesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const [{ data: moduleRows }, { data: progressRows }] = await Promise.all([
    supabase
      .from("modules")
      .select(
        "id, phase, phase_label, title, description, kind, order_index, estimated_minutes"
      )
      .order("phase", { ascending: true })
      .order("order_index", { ascending: true }),
    supabase
      .from("module_progress")
      .select("module_id, status")
      .eq("user_id", data.user.id),
  ]);

  const modules: ModuleRow[] = moduleRows ?? [];
  const progressMap = new Map(
    (progressRows as ModuleProgressRow[] | null)?.map((row) => [
      row.module_id,
      row.status,
    ]) ?? []
  );

  const grouped = modules.reduce<Map<string, ModuleRow[]>>((map, module) => {
    const label = normalizePhaseLabel(module.phase_label ?? module.phase);
    if (!map.has(label)) {
      map.set(label, []);
    }
    map.get(label)!.push(module);
    return map;
  }, new Map());

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Learning modules
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Your mix of language, culture and job simulations.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Evolgrit alternates formats so you can stay motivated: AI coach prompts,
              live mentor sessions, paperwork walkthroughs and more.
            </p>
          </div>
          <Link
            href="/dashboard/journey"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View journey timeline →
          </Link>
        </div>

        <div className="mt-6 space-y-6">
          {grouped.size === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No modules found yet. Please check back later.
            </div>
          )}

          {Array.from(grouped.entries()).map(([phaseLabel, phaseModules]) => (
            <div key={phaseLabel} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                {phaseLabel}
              </h2>
              <div className="space-y-4">
                {phaseModules.map((module) => {
                  const status =
                    progressMap.get(module.id) ?? ("not_started" as const);
                  const statusLabel =
                    statusCopy[status] ?? statusCopy.not_started;
                  const kindLabel = normalizeKind(module.kind);
                  const minutes =
                    module.estimated_minutes && module.estimated_minutes > 0
                      ? `${module.estimated_minutes} min`
                      : null;

                  return (
                    <article
                      key={module.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                              {kindLabel}
                            </span>
                            {minutes && (
                              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                {minutes}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {module.title ?? "Module"}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {module.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${
                            status === "completed"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : status === "in_progress"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-500"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {status === "not_started" && (
                          <form action={startModuleAction}>
                            <input
                              type="hidden"
                              name="moduleId"
                              value={module.id}
                            />
                            <button
                              type="submit"
                              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                            >
                              Start module
                            </button>
                          </form>
                        )}
                        {status === "in_progress" && (
                          <form action={completeModuleAction}>
                            <input
                              type="hidden"
                              name="moduleId"
                              value={module.id}
                            />
                            <button
                              type="submit"
                              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:border-slate-400"
                            >
                              Mark complete
                            </button>
                          </form>
                        )}
                        {status === "completed" && (
                          <p className="text-xs text-emerald-600">
                            Great job — this module is complete.
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
