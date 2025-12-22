import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DocumentsClient from "../DocumentsClient";

type DocumentRow = {
  id: string;
  bucket_id: string;
  object_path: string;
  category: string;
  doc_type: string | null;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  status: string | null;
  created_at: string;
};

export default async function DocumentsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: documents } = await supabase
    .from("documents")
    .select(
      "id, bucket_id, object_path, category, doc_type, file_name, mime_type, size_bytes, status, created_at"
    )
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <DocumentsClient initialDocuments={(documents as DocumentRow[]) ?? []} />
  );
}
