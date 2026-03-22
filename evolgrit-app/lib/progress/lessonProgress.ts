import AsyncStorage from "@react-native-async-storage/async-storage";

export type ResumeInfo = {
  lessonId: string;
  stepIndex: number;
  totalSteps: number;
  updatedAt: number;
  title?: string;
  subtitle?: string;
  level?: "A1" | "A2" | "B1" | "B2" | "JOB";
} | null;

const PROGRESS_PREFIX = "lesson_progress:";

function parseLevel(level?: string | null, lessonId?: string) {
  if (level === "A1" || level === "A2" || level === "B1" || level === "B2") return level;
  if (lessonId?.startsWith("a1_")) return "A1";
  if (lessonId?.startsWith("a2_")) return "A2";
  if (lessonId?.startsWith("b1_")) return "B1";
  if (lessonId?.startsWith("b2_")) return "B2";
  if (lessonId?.startsWith("pflege_") || lessonId?.startsWith("job_pflege_")) return "JOB";
  return undefined;
}

export async function getLatestResumeInfo(): Promise<ResumeInfo> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const progressKeys = keys.filter((key) => key.startsWith(PROGRESS_PREFIX));
    if (!progressKeys.length) return null;

    const entries = await AsyncStorage.multiGet(progressKeys);
    let latest: ResumeInfo = null;

    for (const [key, value] of entries) {
      if (!value) continue;
      let parsed: any = null;
      try {
        parsed = JSON.parse(value);
      } catch {
        continue;
      }
      const lessonId = key.replace(PROGRESS_PREFIX, "");
      const stepIndex = typeof parsed?.stepIndex === "number" ? parsed.stepIndex : 0;
      const totalSteps = typeof parsed?.totalSteps === "number" ? parsed.totalSteps : 0;
      const updatedAt = typeof parsed?.updatedAt === "number" ? parsed.updatedAt : 0;
      if (stepIndex <= 0) continue;
      if (totalSteps && stepIndex >= totalSteps) continue;

      const candidate: ResumeInfo = {
        lessonId,
        stepIndex,
        totalSteps,
        updatedAt,
        title: parsed?.title ?? lessonId,
        subtitle: parsed?.subtitle,
        level: parseLevel(parsed?.level, lessonId),
      };

      if (!latest || (candidate.updatedAt ?? 0) > (latest.updatedAt ?? 0)) {
        latest = candidate;
      }
    }

    return latest;
  } catch {
    return null;
  }
}

export async function getLessonResume(lessonId: string): Promise<ResumeInfo> {
  try {
    const raw = await AsyncStorage.getItem(`${PROGRESS_PREFIX}${lessonId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const stepIndex = typeof parsed?.stepIndex === "number" ? parsed.stepIndex : 0;
    const totalSteps = typeof parsed?.totalSteps === "number" ? parsed.totalSteps : 0;
    const updatedAt = typeof parsed?.updatedAt === "number" ? parsed.updatedAt : 0;
    return {
      lessonId,
      stepIndex,
      totalSteps,
      updatedAt,
      title: parsed?.title ?? lessonId,
      subtitle: parsed?.subtitle,
      level: parseLevel(parsed?.level, lessonId),
    };
  } catch {
    return null;
  }
}
