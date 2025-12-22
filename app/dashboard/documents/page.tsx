import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const documentCategories = [
  {
    id: "personal",
    title: "Personal",
    description: "Passport / ID, residence permit, family documents.",
  },
  {
    id: "work",
    title: "Work & contracts",
    description: "Work contracts, payslips, employment confirmations.",
  },
  {
    id: "education",
    title: "Education",
    description: "Diplomas, transcripts, reference letters.",
  },
  {
    id: "certifications",
    title: "Certifications",
    description: "Driver license, forklift cards, language certificates.",
  },
];

function getCategoryLabel(id?: string | null) {
  return documentCategories.find((cat) => cat.id === id)?.title ?? "documents";
}

async function placeholderUploadAction(formData: FormData) {
  "use server";
  const category = formData.get("category");
  const categoryParam =
    typeof category === "string" && category.length > 0 ? category : "unknown";
  redirect(`/dashboard/documents?status=storage-missing&category=${categoryParam}`);
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const status = typeof searchParams?.status === "string" ? searchParams.status : "";
  const categoryParam =
    typeof searchParams?.category === "string" ? searchParams.category : undefined;
  const showPlaceholderMessage = status === "storage-missing";

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Documents hub
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Keep everything ready for employers and authorities.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Upload scanned PDFs or images once storage is enabled. For now, organize what
              you already have and track missing items.
            </p>
          </div>
          <Link
            href="/dashboard/modules"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Finish onboarding tasks →
          </Link>
        </div>

        {showPlaceholderMessage && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Storage not configured yet for {getCategoryLabel(categoryParam)}. Your mentor
            will notify you once uploads are enabled.
          </div>
        )}

        <div className="mt-6 space-y-6">
          {documentCategories.map((category) => (
            <article
              key={category.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {category.title}
                  </p>
                  <p className="text-sm text-slate-600">{category.description}</p>
                </div>
                <form action={placeholderUploadAction}>
                  <input type="hidden" name="category" value={category.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-400"
                  >
                    Upload document
                  </button>
                </form>
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                No files yet. You can scan or export PDFs once storage is ready.
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
