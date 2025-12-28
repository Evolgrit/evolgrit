import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReadinessRing } from "../../components/ReadinessRing";
import { loadPhaseState } from "../../lib/phaseStateStore";
import {
  addWeeklySnapshot,
  clearSnapshots,
  ersMin,
  loadSnapshots,
  readinessState,
  limiterOf,
  type ERS,
  type ERSSnapshot,
} from "../../lib/ersStore";
import { READINESS_COPY } from "../../lib/readinessCopy";
import { loadCurrentERS } from "../../lib/readinessService";
import { GlassCard } from "../../components/system/GlassCard";
import { Stack, Text } from "tamagui";
import { PrimaryButton } from "../../components/system/PrimaryButton";
import { SecondaryButton } from "../../components/system/SecondaryButton";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard marginBottom={12}>
      <Text fontSize={12} fontWeight="800" color="$muted" marginBottom={10}>
        {title.toUpperCase()}
      </Text>
      {children}
    </GlassCard>
  );
}

function MiniBar({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <Stack marginBottom={10}>
      <Text fontSize={12} color="$muted" marginBottom={6}>
        {label}
      </Text>
      <Stack height={10} backgroundColor="#E5E7EB" borderRadius={999} overflow="hidden">
        <Stack width={`${v}%`} height={10} backgroundColor="$text" />
      </Stack>
    </Stack>
  );
}

function limiterLabel(k: keyof ERS) {
  if (k === "A") return "Application";
  if (k === "C") return "Consistency";
  if (k === "L") return "Language";
  return "Stability";
}

export default function ProgressTab() {
  const [items, setItems] = useState<ERSSnapshot[]>([]);
  const [busy, setBusy] = useState(false);
  const [currentERS, setCurrentERS] = useState<ERS | null>(null);

  useEffect(() => {
    (async () => {
      setItems(await loadSnapshots());
      setCurrentERS(await loadCurrentERS());
    })();
  }, []);

  if (!currentERS) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB", alignItems: "center", justifyContent: "center" }}>
        <Text color="$muted">Loading…</Text>
      </SafeAreaView>
    );
  }

  const score = ersMin(currentERS);
  const state = readinessState(score);
  const copy = READINESS_COPY[state];
  const limiter = limiterOf(currentERS);

  async function createSnapshot() {
    if (!currentERS) return;
    setBusy(true);
    try {
      const ps = await loadPhaseState();
      const next = await addWeeklySnapshot({ phase: ps.phase, week: ps.week, ers: currentERS });
      setItems(next);
    } finally {
      setBusy(false);
    }
  }

  async function resetHistory() {
    setBusy(true);
    try {
      await clearSnapshots();
      setItems([]);
    } finally {
      setBusy(false);
    }
  }

  const last7 = items.slice(0, 7).map((s) => ersMin(s.ers));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <Stack paddingHorizontal={16} paddingTop={10} paddingBottom={10}>
        <Text fontSize={22} fontWeight="900" color="$text">
          Progress
        </Text>
        <Text marginTop={4} color="$muted">
          Proof only. Read-only. No comparisons.
        </Text>
      </Stack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* 1) Readiness Ring */}
        <Stack alignItems="center" marginBottom={12}>
          <ReadinessRing value={score} size={210} strokeWidth={14} />
          <Text marginTop={10} fontSize={18} fontWeight="900" color="$text">
            {copy.title}
          </Text>
          <Text marginTop={4} color="$muted" textAlign="center">
            {copy.status}
          </Text>
        </Stack>

        {/* 2) Today's focus */}
        <Card title="Today's focus">
          <Text color="$text" fontWeight="900" marginBottom={6}>
            Readiness is limited by {limiterLabel(limiter)}.
          </Text>
          <Text color="$muted">{copy.action}</Text>
        </Card>

        {/* 3) Breakdown */}
        <Card title="Breakdown">
          <MiniBar label="Language (L)" value={currentERS.L} />
          <MiniBar label="Application (A)" value={currentERS.A} />
          <MiniBar label="Stability (S)" value={currentERS.S} />
          <MiniBar label="Consistency (C)" value={currentERS.C} />
        </Card>

        {/* 4) Trend (simple) */}
        <Card title="Trend (last 7)">
          {last7.length === 0 ? (
            <Text color="$muted">No snapshots yet.</Text>
          ) : (
            <Text color="$text" fontWeight="900">
              {last7.join("  ·  ")}
            </Text>
          )}
          <Text marginTop={6} color="$muted">
            Short trend only. No drill-down.
          </Text>
        </Card>

        {/* 5) Explanation */}
        <Card title="What this means">
          <Text color="$text" fontWeight="900" marginBottom={6}>
            {copy.limiter}
          </Text>
          <Text color="$muted">{copy.action}</Text>
        </Card>

        {/* Secondary controls */}
        <Stack flexDirection="row" gap={10}>
          <PrimaryButton onPress={createSnapshot} disabled={busy} label={busy ? "Saving…" : "Save snapshot"} />
          <SecondaryButton onPress={resetHistory} disabled={busy} label="Clear history" />
        </Stack>

        <Text marginTop={12} color="$muted" fontSize={12}>
          Snapshots are local. Later: server snapshots + auto-save on weekly review.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
