import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { AppButton } from "../components/AppButton";
import { loadMoods, saveMood, type Mood, dayKey } from "../lib/moodStore";

const C = {
  bg: "#F6F7FB",
  card: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  sub: "#6B7280",
};

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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 12 }}>
      {children}
    </View>
  );
}

export default function ProfileMood() {
  const router = useRouter();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </Pressable>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "900", color: C.text }}>Mood & check-ins</Text>
          <Text style={{ color: C.sub, marginTop: 2 }}>Log one mood per day</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Card>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <AppButton label="Week" variant={viewMode === "week" ? "primary" : "secondary"} onPress={() => setViewMode("week")} />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton label="Month" variant={viewMode === "month" ? "primary" : "secondary"} onPress={() => setViewMode("month")} />
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Pressable onPress={() => setAnchor(addDays(anchor, viewMode === "week" ? -7 : -30))} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={18} color={C.text} />
            </Pressable>
            <Text style={{ fontWeight: "800", color: C.text }}>{monthLabel(anchor)}</Text>
            <Pressable onPress={() => setAnchor(addDays(anchor, viewMode === "week" ? +7 : +30))} style={{ padding: 6 }}>
              <Ionicons name="chevron-forward" size={18} color={C.text} />
            </Pressable>
          </View>

          {viewMode === "week" ? (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                      borderColor: isSel ? C.text : C.border,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Text style={{ fontSize: 11, color: C.sub, fontWeight: "800" }}>{d.toLocaleString(undefined, { weekday: "short" })}</Text>
                    <Text style={{ marginTop: 4, fontSize: 16, fontWeight: "900", color: C.text }}>{d.getDate()}</Text>
                    <View style={{ marginTop: 6, height: 8 }}>
                      {mood ? <View style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: MOOD_COLOR[mood] }} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
                  <Text key={w} style={{ width: 44, textAlign: "center", fontSize: 11, color: C.sub, fontWeight: "800" }}>
                    {w}
                  </Text>
                ))}
              </View>

              {(() => {
                const start = startOfMonthGrid(anchor);
                const cells: Date[] = [];
                for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
                const rows = Array.from({ length: 6 }, (_, r) => cells.slice(r * 7, r * 7 + 7));

                return rows.map((row, idx) => (
                  <View key={idx} style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                            borderColor: isSel ? C.text : "transparent",
                            backgroundColor: inMonth ? "#fff" : "#F3F4F6",
                            opacity: inMonth ? 1 : 0.55,
                          }}
                        >
                          <Text style={{ fontSize: 14, fontWeight: "900", color: C.text }}>{d.getDate()}</Text>
                          <View style={{ marginTop: 6, height: 8 }}>
                            {mood ? <View style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: MOOD_COLOR[mood] }} /> : null}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ));
              })()}
            </View>
          )}

          <View style={{ marginTop: 14, padding: 12, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: C.border }}>
            <Text style={{ color: C.text, fontWeight: "900" }}>
              Selected: {selected.toLocaleDateString()} {selectedMood ? `· ${selectedMood}` : ""}
            </Text>
            <Text style={{ marginTop: 6, color: C.sub }}>Tap a mood to log it for this day.</Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <AppButton label="Calm" variant="secondary" onPress={() => setMoodForSelected("calm")} />
              </View>
              <View style={{ flex: 1 }}>
                <AppButton label="Stressed" variant="secondary" onPress={() => setMoodForSelected("stressed")} />
              </View>
              <View style={{ flex: 1 }}>
                <AppButton label="No time" variant="secondary" onPress={() => setMoodForSelected("no_time")} />
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
