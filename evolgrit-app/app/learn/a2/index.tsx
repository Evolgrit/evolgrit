import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { YStack } from "tamagui";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { LevelHeader } from "../../../components/learn/LevelHeader";
import { UnitAccordion } from "../../../components/learn/UnitAccordion";
import { LessonRow } from "../../../components/learn/LessonRow";
import { getProgressState } from "../../../lib/progressStore";
import type { LessonStatus } from "../../../components/learn/StatusIcon";

const TAB_BAR_HEIGHT = 80;

const DEV_UNLOCK_ALL = typeof __DEV__ !== "undefined" ? __DEV__ : false;
const A2_INDEX = require("../../../content/a2/a2_index.json");
const UNIT_DATA: Record<string, any> = {
  a2_u01: require("../../../content/a2/units/a2_u01.json"),
  a2_u02: require("../../../content/a2/units/a2_u02.json"),
  a2_u03: require("../../../content/a2/units/a2_u03.json"),
  a2_u04: require("../../../content/a2/units/a2_u04.json"),
  a2_u05: require("../../../content/a2/units/a2_u05.json"),
  a2_u06: require("../../../content/a2/units/a2_u06.json"),
  a2_u07: require("../../../content/a2/units/a2_u07.json"),
  a2_u08: require("../../../content/a2/units/a2_u08.json"),
  a2_u09: require("../../../content/a2/units/a2_u09.json"),
  a2_u10: require("../../../content/a2/units/a2_u10.json"),
  a2_u11: require("../../../content/a2/units/a2_u11.json"),
  a2_u12: require("../../../content/a2/units/a2_u12.json"),
  a2_u13: require("../../../content/a2/units/a2_u13.json"),
  a2_u14: require("../../../content/a2/units/a2_u14.json"),
  a2_u15: require("../../../content/a2/units/a2_u15.json"),
};

type ItemStatus = {
  id: string;
  status: LessonStatus;
};

function labelForKind(kind: string) {
  switch (kind) {
    case "mini":
      return "Mini";
    case "quiz":
      return "Quiz";
    case "abschluss":
      return "Abschluss";
    case "speaking":
      return "Speaking";
    default:
      return "Lesson";
  }
}

export default function A2IndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const state = await getProgressState();
      if (!active) return;
      setCompletedMap(state.completedLessons.A2 ?? {});
    })();
    return () => {
      active = false;
    };
  }, []);

  const units = useMemo(() => {
    const list = (A2_INDEX?.units ?? []) as { id: string }[];
    return list.map((u) => UNIT_DATA[u.id]).filter(Boolean);
  }, []);

  const unitStatuses = useMemo(() => {
    const result: Record<string, ItemStatus[]> = {};
    units.forEach((unit) => {
      const statuses: ItemStatus[] = [];
      let firstAvailableFound = false;
      unit.items.forEach((item: any) => {
        const done = Boolean(completedMap[item.id]);
        if (done) {
          statuses.push({ id: item.id, status: "done" });
          return;
        }
        if (DEV_UNLOCK_ALL) {
          statuses.push({ id: item.id, status: "available" });
          return;
        }
        if (!firstAvailableFound) {
          firstAvailableFound = true;
          statuses.push({ id: item.id, status: "available" });
          return;
        }
        statuses.push({ id: item.id, status: "locked" });
      });
      result[unit.id] = statuses;
    });
    return result;
  }, [completedMap, units]);

  useEffect(() => {
    if (openUnitId) return;
    for (const unit of units) {
      const unitStatus = unitStatuses[unit.id] ?? [];
      const hasAvailable = unitStatus.some((s) => s.status === "available" || s.status === "recommended");
      if (hasAvailable) {
        setOpenUnitId(unit.id);
        break;
      }
    }
  }, [openUnitId, unitStatuses, units]);

  return (
    <ScreenShell title="A2 – Unterwegs" backgroundColor="$bgApp">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <LevelHeader
          title={A2_INDEX?.title ?? "A2 – Unterwegs"}
          subtitle={A2_INDEX?.subtitle ?? "8 Lektionen · 3-Minuten Aufgaben"}
          onBack={() => router.back()}
        />
        <YStack gap="$3" padding="$4">
          {units.map((unit) => {
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
                {unit.items.map((item: any) => {
                  const itemStatus = unitStatus.find((s) => s.id === item.id)?.status ?? "available";
                  return (
                    <LessonRow
                      key={item.id}
                      title={item.title}
                      minutes={item.durationMin ?? item.minutes}
                      kindLabel={labelForKind(item.kind)}
                      status={itemStatus}
                      onPress={() => router.push(`/lesson-runner/${item.id}`)}
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
