import Constants from "expo-constants";

type Rate = "normal" | "slow";

type TtsResponse = {
  ok: boolean;
  mime: string;
  base64: string;
  voice?: string;
  locale?: string;
  rate?: Rate;
};

export async function getTtsBase64({ text, rate = "normal" }: { text: string; rate?: Rate }) {
  const url = `${Constants.expoConfig?.extra?.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/azure-tts`;
  const anonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("[tts] Missing Supabase URL or anon key");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ text, rate }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`[tts] Request failed: ${res.status} ${msg}`);
  }

  const data = (await res.json()) as TtsResponse;
  if (!data.ok || !data.base64) throw new Error("[tts] Invalid response");
  return data;
}
