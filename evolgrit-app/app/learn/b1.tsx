import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Stack, Text, XStack, YStack } from "tamagui";
import { ScreenShell } from "../../components/system/ScreenShell";
import { SectionHeader } from "../../components/system/SectionHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import b1Seed from "../../content/b1/b1_seed.json";
import { supabase } from "../../lib/supabaseClient";
import { NavBackButton } from "../../components/system/NavBackButton";
import { SoftButton } from "../../components/system/SoftButton";

function groupB1DrillsByWeek(drills: any[]) {
  const byWeek: Record<number, any[]> = {};
  drills.forEach((d) => {
    if (!d.week) return;
    if (!byWeek[d.week]) byWeek[d.week] = [];
    byWeek[d.week].push(d);
  });
  return Object.keys(byWeek)
    .map((w) => ({
      week: Number(w),
      lessons: byWeek[Number(w)],
    }))
    .sort((a, b) => a.week - b.week);
}

export default function B1Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [b1Drills, setB1Drills] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const TAB_BAR_HEIGHT = 80;

  async function loadB1FromSupabase() {
    if (!supabase) {
      setB1Drills([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("drills")
      .select("slug,title,context,target_text,week,level,type,mentor_tip")
      .eq("level", "B1")
      .order("week", { ascending: true });
    if (error) {
      setB1Drills([]);
    } else {
      setB1Drills(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadB1FromSupabase();
  }, []);

  const b1WeeksSeed = (b1Seed as any[]).filter((w) => w.level === "B1");
  const grouped = b1Drills && b1Drills.length ? groupB1DrillsByWeek(b1Drills) : b1WeeksSeed;

  return (
    <ScreenShell title="B1" leftContent={<NavBackButton fallbackRoute="/learn/language" />}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16,
          paddingHorizontal: 16,
        }}
      >
        <SectionHeader
          label="B1"
          title="B1 Lektionen"
          subtext="Prüfungsmodus ruhig und strukturiert."
          marginBottom="$4"
        />

        {loading ? (
          <Text color="$muted">Lade Inhalte…</Text>
        ) : (
          <YStack gap="$3">
            {grouped.map((w: any) => (
              <YStack key={w.week} backgroundColor="rgba(0,0,0,0.02)" borderRadius="$6" padding="$3" gap="$2">
                <Text fontWeight="900" color="$text">
                  Lektion {w.week}
                </Text>

                <YStack gap="$1">
                  {w.lessons.map((lesson: any, idx: number) => (
                    <React.Fragment key={lesson.slug ?? idx}>
                      <XStack alignItems="center" gap="$3" paddingVertical="$2">
                        <YStack flex={1} minWidth={0} gap="$1">
                          <Text fontWeight="800" color="$text" numberOfLines={1}>
                            {lesson.title}
                          </Text>
                          <Text color="$muted" numberOfLines={2}>
                            {lesson.context ?? lesson.target_text ?? ""}
                          </Text>
                        </YStack>
                        <SoftButton label="Start" tone="strong" onPress={() => router.push(`/lesson?lessonId=${lesson.slug}`)} />
                      </XStack>
                      {idx < w.lessons.length - 1 ? <Stack height={1} backgroundColor="$borderColor" /> : null}
                    </React.Fragment>
                  ))}
                </YStack>
              </YStack>
            ))}
          </YStack>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
