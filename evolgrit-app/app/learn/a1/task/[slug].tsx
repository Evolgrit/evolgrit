import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { Text, YStack } from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../../components/system/ScreenShell";
import { SectionHeader } from "../../../../components/system/SectionHeader";
import { GlassCard } from "../../../../components/system/GlassCard";
import { PrimaryButton } from "../../../../components/system/PrimaryButton";
import { SecondaryButton } from "../../../../components/system/SecondaryButton";
import { NavBackButton } from "../../../../components/system/NavBackButton";
import { loadA1Week } from "../../../../lib/content/loadA1";

const TAB_BAR_HEIGHT = 80;

export default function A1TaskScreen() {
  const { slug, week } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const weekNum = Number(week ?? 1);

  const { task, tasks, taskIndex } = useMemo(() => {
    try {
      const data = loadA1Week(weekNum);
      const ordered = [...data.tasks].sort((a, b) => a.order - b.order);
      const idx = ordered.findIndex((t) => t.slug === slug);
      return { task: idx >= 0 ? ordered[idx] : null, tasks: ordered, taskIndex: idx };
    } catch {
      return { task: null, tasks: [], taskIndex: -1 };
    }
  }, [slug, weekNum]);

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  if (!task) {
    return (
      <ScreenShell title="A1" showBack>
        <Text color="$muted">Aufgabe nicht gefunden.</Text>
      </ScreenShell>
    );
  }

  const goNext = () => {
    if (!tasks.length) return;
    const next = tasks[taskIndex + 1];
    if (next) {
      router.replace({ pathname: "/learn/a1/task/[slug]", params: { slug: next.slug, week: String(weekNum) } });
    } else {
      router.replace({ pathname: "/learn/a1/week/[week]", params: { week: String(weekNum) } });
    }
  };

  const handleChoice = (choiceId: string) => {
    if (revealed) return;
    setSelectedChoice(choiceId);
    setRevealed(true);
  };

  return (
    <ScreenShell
      title={task.title}
      leftContent={<NavBackButton fallbackRoute={`/learn/a1/week/${weekNum}`} />}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <SectionHeader
          label={`Lektion ${weekNum}`}
          title={task.situation.title}
          subtext={task.situation.de}
          marginBottom="$4"
        />

        <GlassCard padding="$3" gap="$2" marginBottom="$3">
          <Text color="$text" fontWeight="900">
            Situation
          </Text>
          <Text color="$muted">{task.situation.de}</Text>
          {task.situation.en ? <Text color="$muted" opacity={0.7}>{task.situation.en}</Text> : null}
        </GlassCard>

        {task.observe ? (
          <GlassCard padding="$3" gap="$3" marginBottom="$3">
            <Text color="$text" fontWeight="900">
              Beobachten
            </Text>
            <YStack gap="$2">
              {task.observe.lines.map((line) => (
                <YStack key={line.id} gap="$1">
                  <Text color="$muted" fontSize={12} fontWeight="700">
                    {line.speaker === "mentor" ? "Mentor" : line.speaker === "learner" ? "Lerner" : "Person"}
                  </Text>
                  <Text color="$text">{line.de}</Text>
                  {line.en ? (
                    <Text color="$muted" opacity={0.7}>
                      {line.en}
                    </Text>
                  ) : null}
                </YStack>
              ))}
            </YStack>
          </GlassCard>
        ) : null}

        <GlassCard padding="$3" gap="$3" marginBottom="$3">
          <Text color="$text" fontWeight="900">
            Deine Aktion
          </Text>
          <Text color="$muted">{task.do.prompt_de}</Text>
          {task.do.prompt_en ? (
            <Text color="$muted" opacity={0.7}>
              {task.do.prompt_en}
            </Text>
          ) : null}

          {task.do.type === "choice_select" && task.do.choices ? (
            <YStack gap="$2" marginTop="$2">
              {task.do.choices.map((choice) => {
                const isSelected = selectedChoice === choice.id;
                const isCorrect = choice.correct === true;
                const showState = revealed && isSelected;
                if (showState && isCorrect) {
                  return (
                    <PrimaryButton key={choice.id} label={choice.label} onPress={() => handleChoice(choice.id)} />
                  );
                }
                return (
                  <SecondaryButton
                    key={choice.id}
                    label={choice.label}
                    onPress={() => handleChoice(choice.id)}
                    backgroundColor={showState && !isCorrect ? "$color2" : undefined}
                  />
                );
              })}
            </YStack>
          ) : (
            <GlassCard padding="$2" backgroundColor="$color2" borderWidth={0} gap="$1">
              {task.do.speak_target ? <Text color="$text">{task.do.speak_target}</Text> : null}
              {task.do.gap?.de_template ? (
                <Text color="$muted">{task.do.gap.de_template}</Text>
              ) : null}
              <PrimaryButton label="Weiter" onPress={() => setRevealed(true)} />
            </GlassCard>
          )}
        </GlassCard>

        {task.hint ? (
          <GlassCard padding="$3" gap="$2" marginBottom="$3">
            <Text color="$text" fontWeight="900">
              {task.hint.title}
            </Text>
            <Text color="$muted">{task.hint.body}</Text>
          </GlassCard>
        ) : null}

        {revealed ? (
          <GlassCard padding="$3" gap="$2" marginBottom="$3">
            <Text color="$text" fontWeight="900">
              {task.success.title}
            </Text>
            <Text color="$muted">{task.success.de}</Text>
            <PrimaryButton label="Nächste Aufgabe" onPress={goNext} />
          </GlassCard>
        ) : null}
      </ScrollView>
    </ScreenShell>
  );
}
