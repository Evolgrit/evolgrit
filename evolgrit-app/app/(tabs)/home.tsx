import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Button, ScrollView, Stack, Text, XStack, YStack, useTheme } from "tamagui";
import { Feather } from "@expo/vector-icons";

import { ScreenShell } from "../../components/system/ScreenShell";
import { GlassCard } from "../../components/system/GlassCard";
import { getAvatarUri } from "../../lib/avatarStore";
import { loadLangPrefs } from "../../lib/languagePrefs";
import { openMentorChat } from "../../lib/navigation/openMentorChat";
import { buildHomeCards, type HomeCard } from "../../lib/homeCards";
import { logNextActionShown } from "../../lib/nextActionStore";
import { getLatestResumeInfo, type ResumeInfo } from "../../lib/progress/lessonProgress";
import { getEvents, track } from "../../lib/tracking";
import { useI18n } from "../../lib/i18n";

const TAB_BAR_HEIGHT = 80;

type DomainKey = "language" | "job" | "life" | "focus";

type DomainStat = {
  minutes: number;
  sessions: number;
};

type DomainStats = Record<DomainKey, DomainStat>;

export default function HomeHub() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useI18n();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [cards, setCards] = useState<HomeCard[]>([]);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo>(null);
  const [domainStats, setDomainStats] = useState<DomainStats>({
    language: { minutes: 0, sessions: 0 },
    job: { minutes: 0, sessions: 0 },
    life: { minutes: 0, sessions: 0 },
    focus: { minutes: 0, sessions: 0 },
  });
  const loggedRef = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      const prefs = await loadLangPrefs();
      if (!prefs) router.replace("/language");
    })();
  }, [router]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const uri = await getAvatarUri();
      if (mounted) setAvatarUri(uri);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      (async () => {
        const { cards: nextCards, todayMinutes: minutes } = await buildHomeCards();
        if (!active) return;
        setCards(nextCards);
        setTodayMinutes(minutes);
        const resume = await getLatestResumeInfo();
        if (!active) return;
        setResumeInfo(resume);
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const events = await getEvents(startOfDay.getTime());
        if (!active) return;
        const nextStats: DomainStats = {
          language: { minutes: 0, sessions: 0 },
          job: { minutes: 0, sessions: 0 },
          life: { minutes: 0, sessions: 0 },
          focus: { minutes: 0, sessions: 0 },
        };
        events.forEach((event) => {
          const key = event.category as DomainKey;
          if (!nextStats[key]) return;
          const mins = event.durationSec ? Math.round(event.durationSec / 60) : 0;
          if (mins) {
            nextStats[key].minutes += mins;
            nextStats[key].sessions += 1;
          }
          if (event.action.endsWith("_complete")) {
            nextStats[key].sessions += 1;
          }
        });
        setDomainStats(nextStats);
        const first = nextCards[0];
        if (first?.kind === "next_action" && loggedRef.current !== first.route) {
          loggedRef.current = first.route;
          await logNextActionShown(first.actionType);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const avatarButton = (
    <Button
      unstyled
      onPress={() => router.push("/profile")}
      width={36}
      height={36}
      borderRadius={18}
      overflow="hidden"
      backgroundColor="$cardSubtle"
      alignItems="center"
      justifyContent="center"
    >
      {avatarUri ? <Image source={{ uri: avatarUri }} style={{ width: "100%", height: "100%" }} /> : null}
    </Button>
  );

  const chatButton = (
    <Button unstyled onPress={() => openMentorChat(router)} padding={6} alignItems="center" justifyContent="center">
      <Feather name="message-square" size={22} color={theme.text?.val ?? theme.color?.val ?? "black"} />
    </Button>
  );

  const renderCard = (card: HomeCard) => {
    const isNext = card.kind === "next_action";
    const cardVariant = isNext ? "job" : "default";
    return (
      <Pressable
        key={card.kind}
        accessibilityRole="button"
        onPress={() => router.push(card.route)}
      >
        <GlassCard position="relative" variant={cardVariant}>
          <XStack alignItems="center" justifyContent="space-between" marginBottom={6}>
            <Text fontSize={12} fontWeight="700" color="$textSecondary">
              {card.kind === "next_action"
                ? t("home.next_action")
                : card.kind === "daily_training"
                ? t("practice.daily_title")
                : card.kind === "migration_plan"
                ? t("journey.card_title")
                : card.kind === "resume"
                ? t("home.resume")
                : card.kind === "job"
                ? t("home.job")
                : t("home.focus")}
            </Text>
            {isNext ? (
              <Text fontSize={12} fontWeight="700" color="$textSecondary">
                {t("home.minutes", { count: 3 })}
              </Text>
            ) : null}
          </XStack>
          {card.kind === "daily_training" ? (
            <>
              <Text fontSize={18} fontWeight="800" color="$text">
                {t("practice.daily_title")}
              </Text>
              <Text color="$textSecondary" marginTop={4}>
                {t("practice.daily_sub")} · {t("practice.due_count", { count: card.count })}
              </Text>
            </>
          ) : card.kind === "migration_plan" ? (
            <>
              <Text fontSize={18} fontWeight="800" color="$text">
                {t("journey.card_title")}
              </Text>
              <Text color="$textSecondary" marginTop={4}>
                {t("journey.card_sub")} · {t("journey.card_progress", { count: card.progress })} · {t("journey.card_missing", { count: card.missing })}
              </Text>
            </>
          ) : (
            <>
              <Text fontSize={18} fontWeight="800" color="$text">
                {card.title}
              </Text>
              <Text color="$textSecondary" marginTop={4}>
                {card.subtitle}
              </Text>
            </>
          )}
          {card.kind === "next_action" && todayMinutes > 0 ? (
            <Text color="$textSecondary" marginTop={8} fontSize={12}>
              {t("home.today_focus", { count: todayMinutes })}
            </Text>
          ) : null}
        </GlassCard>
      </Pressable>
    );
  };

  const resumeTitle = resumeInfo?.title ?? resumeInfo?.lessonId ?? "";
  const resumeStepLine =
    resumeInfo && resumeInfo.totalSteps
      ? t("home.step_of", { current: resumeInfo.stepIndex + 1, total: resumeInfo.totalSteps })
      : resumeInfo
      ? t("home.step", { current: resumeInfo.stepIndex + 1 })
      : "";
  const resumeVariant =
    resumeInfo?.level?.startsWith("JOB") || resumeInfo?.lessonId?.startsWith("pflege_") || resumeInfo?.lessonId?.startsWith("job_")
      ? "job"
      : "language";

  return (
    <ScreenShell title={t("app.home")} leftContent={avatarButton} rightActions={chatButton}>
      <ScrollView contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 24 }}>
        <YStack gap="$3" padding="$4" paddingTop="$2">
          {cards.filter((c) => c.kind === "next_action").map(renderCard)}
          {cards.filter((c) => c.kind === "daily_training").map(renderCard)}
          {cards.filter((c) => c.kind === "migration_plan").map(renderCard)}

          {resumeInfo ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (!resumeInfo.lessonId) return;
                track({
                  ts: Date.now(),
                  category: "language",
                  action: "lesson_minutes",
                  durationSec: 0,
                  id: resumeInfo.lessonId,
                }).catch(() => {});
                router.push(`/lesson-runner/${resumeInfo.lessonId}?resume=1`);
              }}
            >
              <GlassCard position="relative" variant={resumeVariant}>
                <Text fontFamily="$body" fontSize="$meta" fontWeight="600" color="$textSecondary" marginBottom={6}>
                  {t("home.resume")}
                </Text>
                <Text fontFamily="$body" fontSize="$sectionTitle" fontWeight="700" color="$text">
                  {resumeTitle}
                </Text>
                <Text color="$textSecondary" marginTop={4}>
                  {resumeStepLine}
                </Text>
              </GlassCard>
            </Pressable>
          ) : null}

          <YStack gap="$2" marginTop="$2">
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontFamily="$body" fontSize="$sectionTitle" fontWeight="700" color="$text">
                {t("home.sections")}
              </Text>
              <Button
                unstyled
                onPress={() => router.push("/snap")}
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$4"
                backgroundColor="$cardSubtle"
              >
                <Text fontFamily="$body" fontSize="$meta" fontWeight="700" color="$text">
                  {t("snap.open")}
                </Text>
              </Button>
            </XStack>
            <XStack flexWrap="wrap" gap="$3">
              <DomainTile
                title={t("home.language")}
                subtitle={
                  domainStats.language.sessions > 0
                    ? t("home.sessions", { count: domainStats.language.sessions })
                    : t("home.start_today")
                }
                value={domainStats.language.minutes > 0 ? t("home.minutes", { count: domainStats.language.minutes }) : "—"}
                bg="language"
                onPress={() => router.push("/learn/language")}
              />
              <DomainTile
                title={t("home.job_future")}
                subtitle={
                  domainStats.job.sessions > 0
                    ? t("home.sessions", { count: domainStats.job.sessions })
                    : t("home.start_today")
                }
                value={domainStats.job.minutes > 0 ? t("home.minutes", { count: domainStats.job.minutes }) : "—"}
                bg="job"
                onPress={() => router.push("/learn/job")}
              />
              <DomainTile
                title={t("home.life")}
                subtitle={
                  domainStats.life.sessions > 0
                    ? t("home.sessions", { count: domainStats.life.sessions })
                    : t("home.start_today")
                }
                value={domainStats.life.minutes > 0 ? t("home.minutes", { count: domainStats.life.minutes }) : "—"}
                bg="life"
                onPress={() => router.push("/learn/life")}
              />
              <DomainTile
                title={t("home.focus")}
                subtitle={
                  domainStats.focus.sessions > 0
                    ? t("home.sessions", { count: domainStats.focus.sessions })
                    : t("home.start_today")
                }
                value={domainStats.focus.minutes > 0 ? t("home.minutes", { count: domainStats.focus.minutes }) : "—"}
                bg="focus"
                onPress={() => router.push("/focus")}
              />
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}

function DomainTile({
  title,
  subtitle,
  value,
  bg,
  onPress,
}: {
  title: string;
  subtitle: string;
  value: string;
  bg: "language" | "life" | "job" | "focus";
  onPress: () => void;
}) {
  const theme = useTheme();
  const iconColor = theme.text?.val ?? theme.color?.val ?? "#111111";
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ width: "48%" }}>
      <GlassCard variant={bg}>
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={12} fontWeight="700" color="$textSecondary">
            {title}
          </Text>
          <Stack
            width={28}
            height={28}
            borderRadius={14}
            backgroundColor="$card"
            alignItems="center"
            justifyContent="center"
          >
            <Feather name="arrow-up-right" size={14} color={iconColor} />
          </Stack>
        </XStack>
        <Text fontSize={24} fontWeight="800" color="$text" marginTop="$2">
          {value}
        </Text>
        <Text color="$textSecondary" marginTop="$1" fontSize={12}>
          {subtitle}
        </Text>
      </GlassCard>
    </Pressable>
  );
}
