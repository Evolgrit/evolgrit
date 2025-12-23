import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EmployerProfilePage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?role=employer");

  await supabase
    .from("employer_profiles")
    .upsert(
      {
        id: data.user.id,
        contact_email: data.user.email,
      },
      { onConflict: "id" }
    );

  const { data: profile } = await supabase
    .from("employer_profiles")
    .select(
      "company_name, website, industry, company_size, hq_country, contact_name, contact_email, phone, description"
    )
    .eq("id", data.user.id)
    .single();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        Company profile
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        Tell us about your company
      </h1>
      {searchParams.saved && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Saved successfully.
        </div>
      )}
      <form action={saveProfile} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-900">Company name</label>
          <input
            name="company_name"
            defaultValue={profile?.company_name ?? ""}
            className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-900">Website</label>
            <input
              name="website"
              defaultValue={profile?.website ?? ""}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-900">Industry</label>
            <input
              name="industry"
              defaultValue={profile?.industry ?? ""}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-900">Company size</label>
            <input
              name="company_size"
              defaultValue={profile?.company_size ?? ""}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-900">Headquarters country</label>
            <input
              name="hq_country"
              defaultValue={profile?.hq_country ?? ""}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-900">Contact name</label>
            <input
              name="contact_name"
              defaultValue={profile?.contact_name ?? ""}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-900">Contact email</label>
            <input
              name="contact_email"
              defaultValue={profile?.contact_email ?? data.user.email ?? ""}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-900">Phone</label>
          <input
            name="phone"
            defaultValue={profile?.phone ?? ""}
            className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-900">Description</label>
          <textarea
            name="description"
            defaultValue={profile?.description ?? ""}
            rows={4}
            className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        <div className="pt-2 text-right">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Save profile
          </button>
        </div>
      </form>
    </div>
  );
}

async function saveProfile(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?role=employer");

  const toValue = (key: string) => {
    const value = formData.get(key);
    if (!value) return null;
    const trimmed = String(value).trim();
    return trimmed || null;
  };

  await supabase.from("employer_profiles").upsert({
    id: data.user.id,
    company_name: toValue("company_name"),
    website: toValue("website"),
    industry: toValue("industry"),
    company_size: toValue("company_size"),
    hq_country: toValue("hq_country"),
    contact_name: toValue("contact_name"),
    contact_email: toValue("contact_email") ?? data.user.email,
    phone: toValue("phone"),
    description: toValue("description"),
  });

  redirect("/employer/profile?saved=1");
}
