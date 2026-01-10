import { supabase } from "./supabaseClient";

type Style = "normal" | "slow";

export async function getOrCreateTtsUrl(params: {
  lineId: string;
  text: string;
  style: Style;
}): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.functions.invoke("tts", {
    body: {
      line_id: params.lineId,
      text: params.text,
      style: params.style,
    },
  });

  if (error) {
    console.error("TTS invoke error", error);
    return null;
  }

  return (data as any)?.url ?? null;
}
