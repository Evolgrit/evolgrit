import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { LevelHeader } from "../../../components/learn/LevelHeader";
import { UnitAccordion } from "../../../components/learn/UnitAccordion";
import { LessonRow } from "../../../components/learn/LessonRow";
import { getProgressState } from "../../../lib/progressStore";
import type { LessonStatus } from "../../../components/learn/StatusIcon";

const DEV_UNLOCK_ALL = typeof __DEV__ !== "undefined" ? __DEV__ : false;
const A1_INDEX = require("../../../content/a1/a1_index.json");
const UNIT_DATA: Record<string, any> = {
  a1_u01: require("../../../content/a1/units/a1_u01.json"),
  a1_u02: require("../../../content/a1/units/a1_u02.json"),
  a1_u03: require("../../../content/a1/units/a1_u03.json"),
  a1_u04: require("../../../content/a1/units/a1_u04.json"),
  a1_u05: require("../../../content/a1/units/a1_u05.json"),
  a1_u06: require("../../../content/a1/units/a1_u06.json"),
  a1_u07: require("../../../content/a1/units/a1_u07.json"),
  a1_u08: require("../../../content/a1/units/a1_u08.json"),
  a1_u09: require("../../../content/a1/units/a1_u09.json"),
  a1_u10: require("../../../content/a1/units/a1_u10.json"),
  a1_u11: require("../../../content/a1/units/a1_u11.json"),
  a1_u12: require("../../../content/a1/units/a1_u12.json"),
  a1_u13: require("../../../content/a1/units/a1_u13.json"),
  a1_u14: require("../../../content/a1/units/a1_u14.json"),
  a1_u15: require("../../../content/a1/units/a1_u15.json"),
  a1_u16: require("../../../content/a1/units/a1_u16.json"),
  a1_u17: require("../../../content/a1/units/a1_u17.json"),
  a1_u18: require("../../../content/a1/units/a1_u18.json"),
  a1_u19: require("../../../content/a1/units/a1_u19.json"),
  a1_u20: require("../../../content/a1/units/a1_u20.json"),
};

const TAB_BAR_HEIGHT = 80;

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

export default function A1UnitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const state = await getProgressState();
      if (!active) return;
      setCompletedMap(state.completedLessons.A1 ?? {});
    })();
    return () => {
      active = false;
    };
  }, []);

  const units = useMemo(() => {
    const list = (A1_INDEX?.units ?? []) as { id: string }[];
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
          const isRecommended = item.minutes <= 3 || item.kind === "speaking";
          statuses.push({ id: item.id, status: isRecommended ? "recommended" : "available" });
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
  }, [openUnitId, unitStatuses]);

  return (
    <ScreenShell title="A1" backgroundColor="$bgApp">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <LevelHeader
          title={A1_INDEX?.title ?? "A1 – Ankommen"}
          subtitle={A1_INDEX?.subtitle ?? "80 Lektionen · 3-Minuten Aufgaben"}
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
