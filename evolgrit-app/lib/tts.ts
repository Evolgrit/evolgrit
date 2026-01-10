import type { AudioSource } from "expo-audio";

export type LineWithAudio = {
  audio_url?: string | AudioSource;
  audio_slow_url?: string | AudioSource;
  text?: string;
  sentence?: string;
};

/**
 * Placeholder TTS resolver.
 * Later we will fetch/generate a real URL for the line.
 * For now it returns null so the UI can disable the button gracefully.
 */
export function getTtsUrlForLine(_line: LineWithAudio): AudioSource | null {
  return null;
}

export function getLineAudioSources(line: LineWithAudio): {
  normal: AudioSource | null;
  slow: AudioSource | null;
} {
  const normal = (line.audio_url as AudioSource) ?? getTtsUrlForLine(line);
  const slow = (line.audio_slow_url as AudioSource) ?? null;
  return { normal: normal ?? null, slow: slow ?? null };
}
