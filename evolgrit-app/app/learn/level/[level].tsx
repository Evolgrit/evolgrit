import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { LevelHeader } from "../../../components/learn/LevelHeader";
import { UnitAccordion } from "../../../components/learn/UnitAccordion";
import { LessonRow } from "../../../components/learn/LessonRow";
import { loadLevelPlan } from "../../../lib/content/loadLevelPlan";
import { getProgressState } from "../../../lib/progressStore";
import { applyDevUnlock, type ItemStatus } from "../../../lib/progress/availability";

const TAB_BAR_HEIGHT = 80;

type PlanItem = {
  id: string;
  title: string;
  meta?: string;
  route: { type: "lesson_runner" | "live_speak" | "stub"; lessonId?: string; id?: string };
  status?: ItemStatus;
};

type PlanUnit = {
  id: string;
  title: string;
  subtitle: string;
  items: PlanItem[];
};

type Plan = {
  level: "A2" | "B1" | "B2";
  title: string;
  subtitle: string;
  units: PlanUnit[];
};

function parseMeta(meta?: string) {
  if (!meta) return { minutes: 3, kindLabel: undefined as string | undefined };
  const parts = meta.split("·").map((p) => p.trim());
  const minutesRaw = parts[0] ?? "3 Min";
  const minutes = parseInt(minutesRaw, 10) || 3;
  const kindLabel = parts[1] ? parts[1] : undefined;
  return { minutes, kindLabel };
}

export default function LevelPlanScreen() {
  const params = useLocalSearchParams<{ level?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const level = (params.level ?? "A2") as "A2" | "B1" | "B2";
  const plan = useMemo(() => loadLevelPlan(level) as Plan, [level]);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const state = await getProgressState();
      const map = state.completedLessons[level] ?? {};
      if (!active) return;
      setCompletedMap(map);
    })();
    return () => {
      active = false;
    };
  }, [level]);

  const unitStatuses = useMemo(() => {
    const result: Record<string, { id: string; status: ItemStatus }[]> = {};
    plan.units.forEach((unit) => {
      const statuses: { id: string; status: ItemStatus }[] = [];
      let firstAvailableFound = false;
      unit.items.forEach((item) => {
        const done = Boolean(completedMap[item.id]);
        if (done) {
          statuses.push({ id: item.id, status: applyDevUnlock("done") });
          return;
        }
        if (!firstAvailableFound) {
          firstAvailableFound = true;
          const recommended = parseMeta(item.meta).minutes <= 3 || (item.meta ?? "").toLowerCase().includes("speaking");
          statuses.push({ id: item.id, status: applyDevUnlock(recommended ? "recommended" : "available") });
          return;
        }
        statuses.push({ id: item.id, status: applyDevUnlock("locked") });
      });
      result[unit.id] = statuses;
    });
    return result;
  }, [plan.units, completedMap]);

  useEffect(() => {
    if (openUnitId) return;
    for (const unit of plan.units) {
      const unitStatus = unitStatuses[unit.id] ?? [];
      const hasAvailable = unitStatus.some((s) => s.status === "available" || s.status === "recommended");
      if (hasAvailable) {
        setOpenUnitId(unit.id);
        break;
      }
    }
  }, [openUnitId, plan.units, unitStatuses]);

  return (
    <ScreenShell title={plan.title} backgroundColor="$bgApp">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <LevelHeader title={plan.title} subtitle={plan.subtitle} onBack={() => router.back()} />
        <YStack gap="$3" padding="$4">
          {plan.units.map((unit) => {
            const unitStatus = unitStatuses[unit.id] ?? [];
            return (
              <UnitAccordion
                key={unit.id}
                title={unit.title}
                subtitle={unit.subtitle}
                open={openUnitId === unit.id}
                onToggle={() => {
                  setOpenUnitId((prev) => (prev === unit.id ? null : unit.id));
                }}
              >
                {unit.items.map((item) => {
                  const status = unitStatus.find((s) => s.id === item.id)?.status ?? applyDevUnlock("available");
                  const meta = parseMeta(item.meta);
                  return (
                    <LessonRow
                      key={item.id}
                      title={item.title}
                      minutes={meta.minutes}
                      kindLabel={meta.kindLabel}
                      status={status as any}
                      onPress={() => {
                        if (item.route.type === "lesson_runner" && item.route.lessonId) {
                          router.push(`/lesson-runner/${item.route.lessonId}`);
                          return;
                        }
                        if (item.route.type === "live_speak" && item.route.id) {
                          router.push(`/speak/live/${item.route.id}`);
                          return;
                        }
                        if (item.route.type === "stub") {
                          Alert.alert("Kommt bald", "Dieses Modul ist noch nicht verfuegbar.");
                          router.push("/learn/coming-soon");
                        }
                      }}
                    />
                  );
                })}
              </UnitAccordion>
            );
          })}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
