import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ModuleDetailRow = {
  id: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  content: string | null;
  resources: string | null;
  estimated_minutes: number | null;
  kind: string | null;
  phase_label: string | null;
};

type ModuleProgressState = "not_started" | "in_progress" | "completed";
type ModuleProgressRow = {
  status: ModuleProgressState;
  completed_at: string | null;
};

async function startDetailModuleAction(formData: FormData) {
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
  revalidatePath(`/dashboard/modules/${formData.get("slug")}`);
}

async function completeDetailModuleAction(formData: FormData) {
  "use server";
  const moduleId = formData.get("moduleId");
  const slug = formData.get("slug");
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

  await supabase.from("readiness_events").insert({
    user_id: data.user.id,
    type: "module_completed",
    metadata: { module_id: moduleId, slug },
  });

  revalidatePath("/dashboard/modules");
  revalidatePath(`/dashboard/modules/${slug}`);
  revalidatePath("/dashboard");
}

export default async function ModuleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: moduleRow } = await supabase
    .from("modules")
    .select(
      "id, slug, title, description, content, resources, estimated_minutes, kind, phase_label"
    )
    .eq("slug", decodeURIComponent(params.slug))
    .eq("is_active", true)
    .maybeSingle<ModuleDetailRow>();

  if (!moduleRow) {
    redirect("/dashboard/modules");
  }

  const { data: progressRow } = await supabase
    .from("module_progress")
    .select("status, completed_at")
    .eq("user_id", data.user.id)
    .eq("module_id", moduleRow.id)
    .maybeSingle<ModuleProgressRow>();

  const status: ModuleProgressState =
    progressRow?.status ?? ("not_started" as const);
  const minutes =
    moduleRow.estimated_minutes && moduleRow.estimated_minutes > 0
      ? `${moduleRow.estimated_minutes} min`
      : null;

  const contentBlocks =
    moduleRow.content
      ?.split("\n")
      .map((line) => line.trim())
      .filter(Boolean) ?? [];

  return (
    <main className="space-y-6">
      <Link
        href="/dashboard/modules"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
      >
        ← Back to modules
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {moduleRow.phase_label ?? "Module"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {moduleRow.title ?? "Learning module"}
        </h1>
        {moduleRow.description && (
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            {moduleRow.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {moduleRow.kind && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              {moduleRow.kind}
            </span>
          )}
          {minutes && <span>{minutes}</span>}
        </div>

        <div className="mt-6 space-y-3">
          {contentBlocks.length > 0 ? (
            contentBlocks.map((block, idx) => (
              <p key={idx} className="text-sm text-slate-700 leading-relaxed">
                {block}
              </p>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              This module will guide you through realistic practice for your batch.
            </p>
          )}
          {moduleRow.resources && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {moduleRow.resources}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {status !== "completed" && (
            <>
              {status === "not_started" ? (
                <form action={startDetailModuleAction}>
                  <input type="hidden" name="moduleId" value={moduleRow.id} />
                  <input type="hidden" name="slug" value={moduleRow.slug ?? ""} />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    Start module
                  </button>
                </form>
              ) : (
                <form action={completeDetailModuleAction}>
                  <input type="hidden" name="moduleId" value={moduleRow.id} />
                  <input type="hidden" name="slug" value={moduleRow.slug ?? ""} />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
                  >
                    Mark as completed
                  </button>
                </form>
              )}
            </>
          )}
          {status === "completed" && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Completed · {progressRow?.completed_at?.slice(0, 10) ?? "today"}
            </span>
          )}
        </div>
      </section>
    </main>
  );
}
