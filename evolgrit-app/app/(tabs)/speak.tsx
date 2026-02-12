import React, { useMemo } from "react";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Stack, Text } from "tamagui";

import { GlassCard } from "../../components/system/GlassCard";
import { ScreenShell } from "../../components/system/ScreenShell";
import { loadAvatars } from "../../lib/avatars/loadAvatars";
import { useSelectedAvatarId } from "../../lib/avatars/avatarStore";
import { useSelectedJobTrack } from "../../lib/jobStore";
import { setLastJobFocus } from "../../lib/nextActionStore";

const liveIndex = require("../../content/b1/live/index.json");

type LiveIndexItem = {
  id: string;
  title: string;
  subtitle: string;
  durationMin: number;
  coachName?: string;
};

export default function SpeakTab() {
  const router = useRouter();
  const selectedAvatarId = useSelectedAvatarId();
  const selectedJobTrack = useSelectedJobTrack();
  const coachName = useMemo(() => {
    const avatars = loadAvatars();
    return avatars.find((avatar) => avatar.id === selectedAvatarId)?.name ?? "Coach";
  }, [selectedAvatarId]);

  const liveItems: LiveIndexItem[] = Array.isArray(liveIndex?.items) ? liveIndex.items : [];
  const filteredItems = useMemo(() => {
    const pflegeItems = liveItems.filter((item) => item.id.startsWith("pflege_"));
    const generalItems = liveItems.filter((item) => !item.id.startsWith("pflege_"));
    if (selectedJobTrack === "pflege") {
      return [...pflegeItems, ...generalItems];
    }
    return generalItems;
  }, [liveItems, selectedJobTrack]);

  return (
    <ScreenShell title="Speak">
      <Stack flex={1} gap={12}>
        <Stack gap={4}>
          <Text fontSize={22} fontWeight="900" color="$text">
            Sprechen
          </Text>
          <Text color="$muted">Kurze Übungen, ruhig und ohne Druck.</Text>
        </Stack>

        <GlassCard>
          <Text fontWeight="800" color="$text" marginBottom={8}>
            Nächste Übung
          </Text>
          <Text color="$muted" marginBottom={12}>
            Kurze Sprechübung zum Warmwerden.
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            Tippen zum Starten
          </Text>
        </GlassCard>

        <Stack gap={4} marginTop={8}>
          <Text fontSize={18} fontWeight="800" color="$text">
            Live Gespräche
          </Text>
          <Text color="$muted">Übe frei – der Coach korrigiert dich sanft.</Text>
        </Stack>

        {filteredItems.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => router.push(`/speak/live/${item.id}`)}
          >
            <GlassCard>
              <Text fontWeight="800" color="$text" marginBottom={6}>
                {item.title}
              </Text>
              <Text color="$muted" marginBottom={12}>
                {item.subtitle}
              </Text>
              <Text color="$muted" marginBottom={12}>
                Coach: {item.coachName ?? coachName}
              </Text>
              <Text color="$muted" marginBottom={12}>
                ~{item.durationMin} Min
              </Text>
              <Text color="$textHint" fontSize={12} textAlign="right">
                Tippen zum Starten
              </Text>
            </GlassCard>
          </Pressable>
        ))}

        <Stack gap={4} marginTop={12}>
          <Text fontSize={18} fontWeight="800" color="$text">
            Job
          </Text>
          <Text color="$muted">Berufsalltag üben – ruhig und praxisnah.</Text>
        </Stack>

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await setLastJobFocus("pflege");
            router.push("/learn/job/pflege");
          }}
        >
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={6}>
              Pflege · Modul 1
            </Text>
          <Text color="$muted" marginBottom={12}>
            Aufnahme, Schmerzen, Übergabe
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            Tippen zum Starten
          </Text>
        </GlassCard>
      </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await setLastJobFocus("pflege");
            router.push("/learn/job/pflege/module/02");
          }}
        >
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={6}>
              Pflege · Modul 2
            </Text>
          <Text color="$muted" marginBottom={12}>
            Schmerzverlauf, Maßnahmen, Alarmzeichen
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            Tippen zum Starten
          </Text>
        </GlassCard>
      </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await setLastJobFocus("pflege");
            router.push("/learn/job/pflege/module/03");
          }}
        >
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={6}>
              Pflege · Modul 3
            </Text>
          <Text color="$muted" marginBottom={12}>
            Medikamente, Zeiten, Rückfragen
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            Tippen zum Starten
          </Text>
        </GlassCard>
      </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await setLastJobFocus("pflege");
            router.push("/learn/job/pflege/module/04");
          }}
        >
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={6}>
              Pflege · Modul 4
            </Text>
          <Text color="$muted" marginBottom={12}>
            Übergabe, Dokumentation, Rückfragen
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            Tippen zum Starten
          </Text>
        </GlassCard>
      </Pressable>
      </Stack>
    </ScreenShell>
  );
}
