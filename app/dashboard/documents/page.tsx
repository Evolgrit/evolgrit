import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DocumentsClient from "../DocumentsClient";

type DocumentRow = {
  id: string;
  category: string;
  path: string;
  filename: string;
  mime_type: string | null;
  size: number | null;
  created_at: string;
};

export default async function DocumentsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: documents } = await supabase
    .from("documents")
    .select("id, category, path, filename, mime_type, size, created_at")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <DocumentsClient
      userId={data.user.id}
      initialDocuments={(documents as DocumentRow[]) ?? []}
    />
  );
}
