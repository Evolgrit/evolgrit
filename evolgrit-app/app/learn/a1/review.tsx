import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { SectionHeader } from "../../../components/system/SectionHeader";
import { SoftButton } from "../../../components/system/SoftButton";
import { getDueReviews, gradeReview } from "../../../lib/progress/spaced";

const TAB_BAR_HEIGHT = 80;

export default function A1ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<Awaited<ReturnType<typeof getDueReviews>>>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getDueReviews("A1", 8).then((due) => {
      if (isMounted) setItems(due);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const current = items[index];

  const handleGrade = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!current) return;
    await gradeReview(current.id, quality);
    if (quality < 4) {
      setShowAnswer(true);
      setTimeout(() => {
        setShowAnswer(false);
        setIndex((i) => i + 1);
      }, 900);
      return;
    }
    setIndex((i) => i + 1);
  };

  return (
    <ScreenShell title="A1 Review" backgroundColor="#FFFFFF">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <SectionHeader
          label="A1"
          title="Review"
          subtext="Kurze Wiederholungen, eine nach der anderen."
          marginBottom="$4"
        />

        {!current ? (
          <YStack gap="$3">
            <Text color="$muted">Review fertig.</Text>
            <SoftButton label="Zurück zu A1" onPress={() => router.push("/learn/a1")} />
          </YStack>
        ) : (
          <Stack
            paddingHorizontal="$3"
            paddingVertical="$3"
            borderRadius="$6"
            backgroundColor="rgba(0,0,0,0.02)"
            style={{
            }}
          >
            <YStack gap="$3">
              <Text fontWeight="900" color="$text">
                {current.prompt}
              </Text>
              {showAnswer ? (
                <Text color="$muted">Antwort: {current.answer}</Text>
              ) : null}
              <XStack gap="$2">
                <SoftButton label="Richtig" onPress={() => handleGrade(5)} />
                <SoftButton label="Falsch" onPress={() => handleGrade(2)} />
              </XStack>
              <Text color="$muted" fontSize={12}>
                {index + 1} / {items.length}
              </Text>
            </YStack>
          </Stack>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
