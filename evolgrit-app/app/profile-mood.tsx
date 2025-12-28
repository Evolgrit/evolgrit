import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Text } from "tamagui";

import { PillButton } from "../components/system/PillButton";
import { GlassCard } from "../components/system/GlassCard";
import { loadMoods, saveMood, type Mood, dayKey } from "../lib/moodStore";

const MOOD_COLOR: Record<Mood, string> = {
  calm: "#2ECC71",
  stressed: "#F1C40F",
  no_time: "#E74C3C",
};

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7; // Mon=0
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}
function startOfMonth(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfMonthGrid(d: Date) {
  const first = startOfMonth(d);
  const day = first.getDay();
  const diff = (day + 6) % 7;
  return addDays(first, -diff);
}

export default function ProfileMood() {
  const [moods, setMoods] = useState<Record<string, Mood>>({});
  const [anchor, setAnchor] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  useEffect(() => {
    (async () => {
      setMoods(await loadMoods());
    })();
  }, []);

  const weekStart = useMemo(() => startOfWeek(anchor), [anchor]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  async function setMoodForSelected(mood: Mood) {
    const next = await saveMood(selected, mood);
    setMoods(next);
  }

  const selectedMood = moods[dayKey(selected)] ?? null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <Stack flexDirection="row" alignItems="center" paddingHorizontal={16} paddingVertical={12} gap={12}>
        <Pressable onPress={() => window.history.back()} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
        <Stack>
          <Text fontSize={18} fontWeight="900" color="$text">
            Mood & check-ins
          </Text>
          <Text color="$muted" marginTop={2}>
            Log one mood per day
          </Text>
        </Stack>
      </Stack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <GlassCard>
          <Stack flexDirection="row" gap={10} marginBottom={12}>
            <Stack flex={1}>
              <PillButton label="Week" onPress={() => setViewMode("week")} />
            </Stack>
            <Stack flex={1}>
              <PillButton label="Month" onPress={() => setViewMode("month")} />
            </Stack>
          </Stack>

          <Stack flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={12}>
            <Pressable onPress={() => setAnchor(addDays(anchor, viewMode === "week" ? -7 : -30))} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={18} color="#111827" />
            </Pressable>
            <Text fontWeight="800" color="$text">
              {monthLabel(anchor)}
            </Text>
            <Pressable onPress={() => setAnchor(addDays(anchor, viewMode === "week" ? +7 : +30))} style={{ padding: 6 }}>
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </Pressable>
          </Stack>

          {viewMode === "week" ? (
            <Stack flexDirection="row" justifyContent="space-between">
              {weekDays.map((d) => {
                const key = dayKey(d);
                const mood = moods[key];
                const isSel = sameDay(d, selected);
                return (
                  <Pressable
                    key={key}
                    onPress={() => setSelected(d)}
                    style={{
                      width: 44,
                      borderRadius: 12,
                      paddingVertical: 10,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: isSel ? "#111827" : "rgba(17,24,39,0.08)",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Text fontSize={11} color="$muted" fontWeight="800">
                      {d.toLocaleString(undefined, { weekday: "short" })}
                    </Text>
                    <Text marginTop={4} fontSize={16} fontWeight="900" color="$text">
                      {d.getDate()}
                    </Text>
                    <Stack marginTop={6} height={8}>
                      {mood ? <Stack width={8} height={8} borderRadius={99} backgroundColor={MOOD_COLOR[mood]} /> : null}
                    </Stack>
                  </Pressable>
                );
              })}
            </Stack>
          ) : (
            <Stack gap={8}>
              <Stack flexDirection="row" justifyContent="space-between">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
                  <Text key={w} width={44} textAlign="center" fontSize={11} color="$muted" fontWeight="800">
                    {w}
                  </Text>
                ))}
              </Stack>

              {(() => {
                const start = startOfMonthGrid(anchor);
                const cells: Date[] = [];
                for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
                const rows = Array.from({ length: 6 }, (_, r) => cells.slice(r * 7, r * 7 + 7));

                return rows.map((row, idx) => (
                  <Stack key={idx} flexDirection="row" justifyContent="space-between">
                    {row.map((d) => {
                      const key = dayKey(d);
                      const mood = moods[key];
                      const isSel = sameDay(d, selected);
                      const inMonth = d.getMonth() === anchor.getMonth();
                      return (
                        <Pressable
                          key={key}
                          onPress={() => setSelected(d)}
                          style={{
                            width: 44,
                            borderRadius: 12,
                            paddingVertical: 10,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: isSel ? "#111827" : "transparent",
                            backgroundColor: inMonth ? "#fff" : "#F3F4F6",
                            opacity: inMonth ? 1 : 0.55,
                          }}
                        >
                          <Text fontSize={14} fontWeight="900" color="$text">
                            {d.getDate()}
                          </Text>
                          <Stack marginTop={6} height={8}>
                            {mood ? <Stack width={8} height={8} borderRadius={99} backgroundColor={MOOD_COLOR[mood]} /> : null}
                          </Stack>
                        </Pressable>
                      );
                    })}
                  </Stack>
                ));
              })()}
            </Stack>
          )}

          <GlassCard marginTop={14}>
            <Text color="$text" fontWeight="900">
              Selected: {selected.toLocaleDateString()} {selectedMood ? `· ${selectedMood}` : ""}
            </Text>
            <Text marginTop={6} color="$muted">
              Tap a mood to log it for this day.
            </Text>

            <Stack flexDirection="row" gap={10} marginTop={12}>
              <Stack flex={1}>
                <PillButton label="Calm" onPress={() => setMoodForSelected("calm")} />
              </Stack>
              <Stack flex={1}>
                <PillButton label="Stressed" onPress={() => setMoodForSelected("stressed")} />
              </Stack>
              <Stack flex={1}>
                <PillButton label="No time" onPress={() => setMoodForSelected("no_time")} />
              </Stack>
            </Stack>
          </GlassCard>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}
