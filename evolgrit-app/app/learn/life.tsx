import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Text, YStack } from "tamagui";
import { ScreenShell } from "../../components/system/ScreenShell";
import { SectionHeader } from "../../components/system/SectionHeader";
import { TileGrid } from "../../components/system/TileGrid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PullDownToDismiss } from "../../components/navigation/PullDownToDismiss";
import { NavBackButton } from "../../components/system/NavBackButton";
import { SoftButton } from "../../components/system/SoftButton";

const tips = [
  { title: "Unpünktlich sein", hint: "Sag Bescheid, wenn du spät bist.", bullets: ["Kurz Nachricht senden", "Zeitfenster nennen"] },
  { title: "Lärm nach 22 Uhr", hint: "Ruhezeiten beachten (22–7 Uhr).", bullets: ["Leise sein", "Keine laute Musik"] },
  { title: "Spontan vorbeikommen", hint: "Kurz fragen, bevor du kommst.", bullets: ["Vorher schreiben", "Uhrzeit vorschlagen"] },
  { title: "Bei Rot gehen", hint: "Warten gilt als respektvoll.", bullets: ["Auch wenn Straße leer", "Vorbild für Kinder"] },
  { title: "Spät abends anrufen", hint: "Nachrichten sind okay.", bullets: ["Kurze Message", "Anruf tagsüber"] },
  { title: "Mülltrennung", hint: "Tonnen-Regeln ernst nehmen.", bullets: ["Gelb/Blau/Bio beachten", "Container nutzen"] },
];

export default function LifeScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);
  const TAB_BAR_HEIGHT = 80;

  const openDetail = (tip: typeof tips[0]) => {
    setSelected(tip.title);
    Alert.alert(tip.title, `${tip.hint}\n\n• ${tip.bullets.join("\n• ")}`);
  };

  return (
    <ScreenShell
      title="Leben in Deutschland"
      leftContent={<NavBackButton fallbackRoute="/(tabs)/learn" />}
    >
      <PullDownToDismiss>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
          <SectionHeader
            label="Life"
            title="Leben in Deutschland"
            subtext="Kurze Do/Don’t Hinweise für Alltag & Kultur."
            marginBottom="$4"
          />

          <TileGrid>
            {tips.map((tip) => (
              <YStack key={tip.title} gap="$2" padding="$3" borderRadius="$6" backgroundColor="$background">
                <Text fontWeight="900" color="$text">
                  {tip.title}
                </Text>
                <Text color="$muted">{tip.hint}</Text>
                <SoftButton label="Öffnen" onPress={() => openDetail(tip)} />
                {selected === tip.title ? (
                  <Text fontSize={12} color="$muted" marginTop="$1">
                    Geöffnet
                  </Text>
                ) : null}
              </YStack>
            ))}
          </TileGrid>
        </ScrollView>
      </PullDownToDismiss>
    </ScreenShell>
  );
}
