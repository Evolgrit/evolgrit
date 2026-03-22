import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { ScreenShell } from "../../components/system/ScreenShell";
import { GlassCard } from "../../components/system/GlassCard";
import { SoftButton } from "../../components/system/SoftButton";
import { ListenRepeatStep } from "../../components/lesson/steps/ListenRepeatStep";
import { playTtsText } from "../../lib/tts/playText";
import { getLocaleForLanguage } from "../../lib/locale";
import { useUserSettings } from "../../lib/userSettings";
import { useI18n } from "../../lib/i18n";
import { getCards, getDailyQueue, removeFromDailyQueue, type SnapCard } from "../../lib/storage/cards";

export default function DailyPracticeScreen() {
  const { t } = useI18n();
  const { targetLanguageCode } = useUserSettings();
  const targetLocale = getLocaleForLanguage(targetLanguageCode);
  const [queueIds, setQueueIds] = useState<string[]>([]);
  const [cards, setCards] = useState<SnapCard[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [canAdvance, setCanAdvance] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const [queue, allCards] = await Promise.all([getDailyQueue(), getCards()]);
      if (!active) return;
      setQueueIds(queue);
      setCards(allCards);
    })();
    return () => {
      active = false;
    };
  }, []);

  const activeCard = useMemo(() => cards.find((c) => c.id === activeId) ?? null, [cards, activeId]);
  const queueCards = useMemo(
    () => queueIds.map((id) => cards.find((c) => c.id === id)).filter(Boolean) as SnapCard[],
    [queueIds, cards]
  );

  async function handlePlay(sentence: string) {
    await playTtsText(sentence, "normal", targetLocale);
  }

  async function markDone(cardId: string) {
    await removeFromDailyQueue(cardId);
    const nextQueue = queueIds.filter((id) => id !== cardId);
    setQueueIds(nextQueue);
    setActiveId(null);
    setCanAdvance(false);
  }

  return (
    <ScreenShell title={t("practice.daily_title")} showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <YStack padding="$4" gap="$4">
          <Text color="$muted">{t("practice.daily_sub")}</Text>

          {activeCard ? (
            <GlassCard>
              <Text fontSize={16} fontWeight="800" color="$text" marginBottom={6}>
                {t("practice.practice_now")}
              </Text>
              <Text color="$text" fontWeight="800" marginBottom={4}>
                {activeCard.targetWord}
              </Text>
              <Text color="$muted" marginBottom={12}>
                {activeCard.targetSentence}
              </Text>

              <ListenRepeatStep
                prompt={t("practice.practice_now")}
                text={activeCard.targetSentence}
                onSolved={() => {}}
                onCorrectChange={(ok) => setCanAdvance(ok)}
              />

              <XStack justifyContent="flex-end" marginTop={12}>
                <SoftButton
                  label={t("common.next")}
                  onPress={() => markDone(activeCard.id)}
                  disabled={!canAdvance}
                  backgroundColor={canAdvance ? "$green9" : "$gray4"}
                  textColor={canAdvance ? "$color11" : "$gray9"}
                />
              </XStack>
            </GlassCard>
          ) : queueCards.length ? (
            <GlassCard>
              <YStack gap="$3">
                {queueCards.map((card) => (
                  <Pressable key={card.id} accessibilityRole="button" onPress={() => setActiveId(card.id)}>
                    <XStack gap="$3" alignItems="center">
                      <Image source={{ uri: card.imageUri }} style={{ width: 56, height: 56, borderRadius: 12 }} />
                      <YStack flex={1} minWidth={0}>
                        <Text fontWeight="800" color="$text">
                          {card.targetWord}
                        </Text>
                        <Text color="$muted" numberOfLines={1} ellipsizeMode="tail">
                          {card.targetSentence}
                        </Text>
                      </YStack>
                      <Pressable
                        accessibilityRole="button"
                        onPress={(e) => {
                          e.stopPropagation?.();
                          handlePlay(card.targetSentence).catch(() => {});
                        }}
                      >
                        <Text color="$text" fontSize={18}>
                          ▶
                        </Text>
                      </Pressable>
                    </XStack>
                  </Pressable>
                ))}
              </YStack>
            </GlassCard>
          ) : (
            <GlassCard>
              <Text color="$muted">{t("practice.no_cards")}</Text>
            </GlassCard>
          )}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
