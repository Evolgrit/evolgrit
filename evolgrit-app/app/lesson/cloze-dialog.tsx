import React, { useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import seed from "../../content/a1_cloze_seed.json";
import { ScreenShell } from "../../components/system/ScreenShell";
import { TipBanner } from "../../components/lesson/TipBanner";
import { DialogueBubble } from "../../components/lesson/DialogueBubble";
import { InlineGap } from "../../components/lesson/InlineGap";
import { ChoiceBar } from "../../components/lesson/ChoiceBar";
import { useClozeDialog } from "../../hooks/useClozeDialog";
import type { ClozeDialogExercise } from "../../types/cloze";
import { PillButton } from "../../components/system/PillButton";
import { parseClozeText } from "../../types/cloze";

const exercise = seed as unknown as ClozeDialogExercise;

export default function ClozeDialogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [showTip, setShowTip] = useState(true);

  const { parsedTurns, activeGap, answersByGapId, onPick, isComplete } = useClozeDialog(exercise);

  const gapOrder = useMemo(() => {
    const order: number[] = [];
    parsedTurns.forEach((t) => {
      parseClozeText(t.text).forEach((seg) => {
        if (seg.kind === "gap" && !order.includes(seg.gapId)) order.push(seg.gapId);
      });
    });
    return order;
  }, [parsedTurns]);

  const activeGapPosition = gapOrder.indexOf(activeGap?.id ?? -1);

  const handlePick = (opt: string) => {
    onPick(opt);
    // scroll to next gap after short delay if correct
    const nextIdx = activeGapPosition + 1;
    if (opt === activeGap?.answer && nextIdx < gapOrder.length) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      }, 300);
    }
  };

  const currentOptions = activeGap?.options ?? [];

  return (
    <ScreenShell title="Lückentext" showBack>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32,
          paddingTop: 8,
          gap: 16,
        }}
      >
        {showTip && exercise.tip ? <TipBanner text={exercise.tip} onClose={() => setShowTip(false)} /> : null}

        <YStack gap="$2" padding="$3" borderRadius="$5" backgroundColor="$card" borderColor="$borderColor" borderWidth={1}>
          <Text fontWeight="900" fontSize="$6" color="$text">
            {exercise.title}
          </Text>
          <Text color="$muted">{exercise.prompt}</Text>
        </YStack>

        <YStack gap="$3">
          {parsedTurns.map((turn) => (
            <DialogueBubble key={turn.text} align={turn.align}>
              <Text>
                {turn.segments.map((seg, idx) => {
                  if (seg.kind === "text") {
                    return <Text key={idx}>{seg.value}</Text>;
                  }
                  const state = answersByGapId[seg.gapId]?.state ?? "idle";
                  const label = answersByGapId[seg.gapId]?.selected ?? "___";
                  return <InlineGap key={idx} state={state} label={label} />;
                })}
              </Text>
              {turn.translation ? (
                <Text color="$muted" fontSize="$3" marginTop="$1">
                  {turn.translation}
                </Text>
              ) : null}
            </DialogueBubble>
          ))}
        </YStack>

        {!isComplete && currentOptions.length > 0 ? (
          <YStack gap="$3">
            <Text color="$text" fontWeight="800">
              Wähle das passende Wort:
            </Text>
            <ChoiceBar
              options={currentOptions}
              selected={answersByGapId[activeGap?.id ?? -1]?.selected}
              correctAnswer={activeGap?.answer}
              reveal={answersByGapId[activeGap?.id ?? -1]?.state === "correct"}
              onPick={handlePick}
            />
          </YStack>
        ) : null}

        {isComplete ? (
          <PillButton
            label="Weiter"
            size="$4"
            minWidth={120}
            onPress={() => router.back()}
            alignSelf="center"
            marginTop="$3"
          />
        ) : null}
      </ScrollView>
    </ScreenShell>
  );
}
