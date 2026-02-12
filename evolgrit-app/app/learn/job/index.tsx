import React, { useCallback, useState } from "react";
import { LayoutAnimation, Platform, Pressable, ScrollView, UIManager } from "react-native";
import { useRouter } from "expo-router";
import { Text, XStack, YStack, useTheme } from "tamagui";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { setSelectedJobTrack } from "../../../lib/jobStore";
import { setLastJobFocus } from "../../../lib/nextActionStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { ChevronDown, ChevronRight, Lock } from "lucide-react-native";
import { DEV_UNLOCK_ALL } from "../../../lib/config/devFlags";

type JobModule = {
  title: string;
  subtitle?: string;
  durationMin?: number;
  route?: string;
  locked?: boolean;
};

type JobUnit = {
  id: string;
  title: string;
  subtitle?: string;
  modules: JobModule[];
};

type JobGroup = {
  id: string;
  title: string;
  subtitle: string;
  bg: string;
  units: JobUnit[];
};

const JOBS: JobGroup[] = [
  {
    id: "pflege",
    title: "Pflege",
    subtitle: "Patienten · Übergabe · Alltag",
    bg: "$surfaceJob",
    units: [
      {
        id: "pflege_u1",
        title: "Unit 1 · Start im Dienst",
        subtitle: "Aufnahme und Schmerzen",
        modules: [
          { title: "Modul 1", subtitle: "Aufnahme & Übergabe", durationMin: 12, route: "/learn/job/pflege/01" },
          { title: "Modul 2", subtitle: "Schmerzen & Maßnahmen", durationMin: 14, route: "/learn/job/pflege/02" },
        ],
      },
      {
        id: "pflege_u2",
        title: "Unit 2 · Beobachten & Dokumentieren",
        subtitle: "Medikamente und Dokumentation",
        modules: [
          { title: "Modul 3", subtitle: "Medikamente & Zeiten", durationMin: 16, route: "/learn/job/pflege/03" },
          { title: "Modul 4", subtitle: "Übergabe & Dokumentation", durationMin: 18, route: "/learn/job/pflege/04" },
        ],
      },
      {
        id: "pflege_u3",
        title: "Unit 3 · Routine & Sicherheit",
        subtitle: "Vitalwerte und Hygiene",
        modules: [
          { title: "Modul 5", subtitle: "Vitalwerte", durationMin: 12, route: "/learn/job/pflege/05" },
          { title: "Modul 6", subtitle: "Hygiene & Sicherheit", durationMin: 12, route: "/learn/job/pflege/06" },
        ],
      },
      {
        id: "pflege_u4",
        title: "Unit 4 · Verantwortung",
        subtitle: "Melden und Beobachten",
        modules: [
          { title: "Modul 7", subtitle: "Verantwortung & Meldewege", durationMin: 12, route: "/learn/job/pflege/07" },
          { title: "Modul 8", subtitle: "Beobachten & Begründen", durationMin: 14, route: "/learn/job/pflege/08" },
        ],
      },
      {
        id: "pflege_u5",
        title: "Unit 5 · Kommunikation",
        subtitle: "Gespräche und Grenzen",
        modules: [
          { title: "Modul 9", subtitle: "Schwierige Gespräche", durationMin: 14, route: "/learn/job/pflege/09" },
          { title: "Modul 10", subtitle: "Rechte & Grenzen", durationMin: 12, route: "/learn/job/pflege/10" },
        ],
      },
      {
        id: "pflege_u6",
        title: "Unit 6 · Prüfung & Organisation",
        subtitle: "Prüfung und Selbstorganisation",
        modules: [
          { title: "Modul 11", subtitle: "Prüfung – kurz & strukturiert", durationMin: 12, route: "/learn/job/pflege/11" },
          { title: "Modul 12", subtitle: "Selbstorganisation & Stress", durationMin: 12, route: "/learn/job/pflege/12" },
        ],
      },
    ],
  },
  {
    id: "handwerk",
    title: "Handwerk",
    subtitle: "Werkstatt · Baustelle · Team",
    bg: "$surfaceLanguage",
    units: [
      {
        id: "handwerk_u1",
        title: "Unit 1 · Einstieg",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "handwerk_u2",
        title: "Unit 2 · Teamarbeit",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "handwerk_u3",
        title: "Unit 3 · Alltag",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "gastro",
    title: "Gastro",
    subtitle: "Service · Küche · Bestellungen",
    bg: "$surfaceLife",
    units: [
      {
        id: "gastro_u1",
        title: "Unit 1 · Service",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "gastro_u2",
        title: "Unit 2 · Küche",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "gastro_u3",
        title: "Unit 3 · Ablauf",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "logistik",
    title: "Logistik",
    subtitle: "Lieferung · Routen · Übergaben",
    bg: "$surfaceFocus",
    units: [
      {
        id: "logistik_u1",
        title: "Unit 1 · Übergabe",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "logistik_u2",
        title: "Unit 2 · Route",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "logistik_u3",
        title: "Unit 3 · Alltag",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "reinigung",
    title: "Reinigung",
    subtitle: "Räume · Aufgaben · Rückmeldung",
    bg: "$surfaceLife",
    units: [
      {
        id: "reinigung_u1",
        title: "Unit 1 · Einstieg",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "reinigung_u2",
        title: "Unit 2 · Ordnung",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "reinigung_u3",
        title: "Unit 3 · Abschluss",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "lager",
    title: "Lager",
    subtitle: "Waren · Ordnung · Rückfragen",
    bg: "$surfaceLanguage",
    units: [
      {
        id: "lager_u1",
        title: "Unit 1 · Einstieg",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "lager_u2",
        title: "Unit 2 · Ordnung",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "lager_u3",
        title: "Unit 3 · Rückfragen",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "kueche",
    title: "Küche",
    subtitle: "Vorbereitung · Abläufe · Hygiene",
    bg: "$surfaceFocus",
    units: [
      {
        id: "kueche_u1",
        title: "Unit 1 · Einstieg",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "kueche_u2",
        title: "Unit 2 · Hygiene",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "kueche_u3",
        title: "Unit 3 · Abschluss",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
];

export default function JobSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);
  const theme = useTheme();
  const iconColor = theme.textSecondary?.val ?? theme.text?.val ?? "black";

  const toggleJob = useCallback(
    (jobId: string) => {
      if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
      LayoutAnimation.configureNext(
        LayoutAnimation.create(220, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setOpenJobId((prev) => (prev === jobId ? null : jobId));
      setOpenUnitId(null);
    },
    []
  );

  const toggleUnit = useCallback((unitId: string) => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(
      LayoutAnimation.create(220, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setOpenUnitId((prev) => (prev === unitId ? null : unitId));
  }, []);

  return (
    <ScreenShell title="Job & Zukunft" showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <YStack padding="$4" gap="$4">
          <YStack gap="$3">
            {JOBS.map((job) => {
              const open = openJobId === job.id;
              return (
                <YStack key={job.id} backgroundColor="$bgSurface" borderRadius="$6">
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => toggleJob(job.id)}
                    style={({ pressed }) => ({
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                  >
                    <YStack padding="$4" borderRadius="$6" backgroundColor={job.bg} gap="$2">
                      <XStack alignItems="center" justifyContent="space-between">
                        <YStack gap="$1">
                          <Text fontWeight="800" color="$text">
                            {job.title}
                          </Text>
                          <Text color="$textSecondary">{job.subtitle}</Text>
                        </YStack>
                        {open ? <ChevronDown size={18} color={iconColor} /> : <ChevronRight size={18} color={iconColor} />}
                      </XStack>
                    </YStack>
                  </Pressable>
                  {open ? (
                    <YStack paddingHorizontal="$3" paddingBottom="$3" gap="$2">
                      {job.units.map((unit) => {
                        const unitOpen = openUnitId === unit.id;
                        return (
                          <YStack key={unit.id} gap="$2">
                            <Pressable
                              accessibilityRole="button"
                              onPress={() => toggleUnit(unit.id)}
                              style={({ pressed }) => ({
                                transform: [{ scale: pressed ? 0.98 : 1 }],
                              })}
                            >
                              <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                paddingVertical="$3"
                                paddingHorizontal="$3"
                                borderRadius="$6"
                                backgroundColor="$bgSurface"
                              >
                                <YStack gap="$1" flex={1} minWidth={0}>
                                  <Text fontWeight="700" color="$text" numberOfLines={1}>
                                    {unit.title}
                                  </Text>
                                  {unit.subtitle ? (
                                    <Text color="$textSecondary" numberOfLines={1}>
                                      {unit.subtitle}
                                    </Text>
                                  ) : null}
                                </YStack>
                                {unitOpen ? <ChevronDown size={16} color={iconColor} /> : <ChevronRight size={16} color={iconColor} />}
                              </XStack>
                            </Pressable>
                            {unitOpen ? (
                              <YStack gap="$2" paddingLeft="$2">
                                {unit.modules.map((mod) => {
                                  const isLocked = Boolean(mod.locked) || !mod.route;
                                  const canOpen = DEV_UNLOCK_ALL ? Boolean(mod.route) : !isLocked && Boolean(mod.route);
                                  return (
                                    <Pressable
                                      key={`${unit.id}-${mod.title}`}
                                      accessibilityRole="button"
                                      onPress={async () => {
                                        if (!canOpen) return;
                                        await setSelectedJobTrack(job.id);
                                        await setLastJobFocus(job.id);
                                        router.push(mod.route as any);
                                      }}
                                      style={({ pressed }) => ({
                                        transform: [{ scale: pressed ? 0.98 : 1 }],
                                        opacity: !canOpen ? 0.6 : 1,
                                      })}
                                    >
                                      <XStack
                                        alignItems="center"
                                        justifyContent="space-between"
                                        paddingVertical="$3"
                                        paddingHorizontal="$3"
                                        borderRadius="$6"
                                        backgroundColor="$bgSurface"
                                      >
                                        <YStack gap="$1" flex={1} minWidth={0}>
                                          <Text fontWeight="700" color="$text" numberOfLines={1}>
                                            {mod.title}
                                          </Text>
                                          {mod.subtitle ? (
                                            <Text color="$textSecondary" numberOfLines={1}>
                                              {mod.subtitle}
                                            </Text>
                                          ) : null}
                                        </YStack>
                                        <XStack alignItems="center" gap="$2">
                                          {mod.durationMin ? (
                                            <Text color="$textSecondary" fontSize={12}>
                                              ~{mod.durationMin} Min
                                            </Text>
                                          ) : null}
                                          {isLocked ? <Lock size={16} color={iconColor} /> : null}
                                        </XStack>
                                      </XStack>
                                    </Pressable>
                                  );
                                })}
                              </YStack>
                            ) : null}
                          </YStack>
                        );
                      })}
                    </YStack>
                  ) : null}
                </YStack>
              );
            })}
          </YStack>
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
