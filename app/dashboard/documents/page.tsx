import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DocumentsClient from "../DocumentsClient";

type DocumentRow = {
  id: string;
  category: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  title: string | null;
};

export default async function DocumentsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: documents } = await supabase
    .from("documents")
    .select(
      "id, category, storage_path, file_name, mime_type, size_bytes, created_at, title"
    )
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <DocumentsClient
      userId={data.user.id}
      initialDocuments={(documents as DocumentRow[]) ?? []}
    />
  );
}
