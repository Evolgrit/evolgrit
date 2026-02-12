import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { ScreenShell } from "../../../../components/system/ScreenShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setLastJobFocus } from "../../../../lib/nextActionStore";
import { getLessonResume, type ResumeInfo } from "../../../../lib/progress/lessonProgress";
import { aggregateStatus, getCardStatusStyle, getLessonStatus } from "../../../../components/system/lessonCardStatus";

const moduleData = require("../../../../content/job/pflege/module_01.json");
const moduleData2 = require("../../../../content/job/pflege/module_02.json");
const moduleData3 = require("../../../../content/job/pflege/module_03.json");
const moduleData4 = require("../../../../content/job/pflege/module_04.json");
const moduleData5 = require("../../../../content/job/pflege/module_05.json");
const moduleData6 = require("../../../../content/job/pflege/module_06.json");
const moduleData7 = require("../../../../content/job/pflege/modules/module_07_responsibility.json");
const moduleData8 = require("../../../../content/job/pflege/modules/module_08_observation_reasoning.json");
const moduleData9 = require("../../../../content/job/pflege/modules/module_09_difficult_communication.json");
const moduleData10 = require("../../../../content/job/pflege/modules/module_10_rights_boundaries.json");
const moduleData11 = require("../../../../content/job/pflege/modules/module_11_exam_preparation.json");
const moduleData12 = require("../../../../content/job/pflege/modules/module_12_self_management.json");

export default function PflegeHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [resumeMap, setResumeMap] = useState<Record<string, ResumeInfo | null>>({});

  const moduleSkillMap = useMemo(
    () => ({
      module01: [
        "pflege_m1_skill_01_vocab",
        "pflege_m1_skill_02_word_build",
        "pflege_m1_skill_03_dialogue_cloze",
      ],
      module02: [
        "pflege_m2_skill_01_vocab",
        "pflege_m2_skill_02_word_build",
        "pflege_m2_skill_03_dialogue_cloze",
      ],
      module03: [
        "pflege_m3_skill_01_vocab",
        "pflege_m3_skill_02_word_build",
        "pflege_m3_skill_03_dialogue_cloze",
      ],
      module04: [
        "pflege_m4_skill_01_vocab",
        "pflege_m4_skill_02_word_build",
        "pflege_m4_skill_03_dialogue_cloze",
      ],
      module05: [
        "pflege_m5_skill_01_vocab",
        "pflege_m5_skill_02_word_build",
        "pflege_m5_skill_03_dialogue_cloze",
      ],
      module06: [
        "pflege_m6_skill_01_vocab",
        "pflege_m6_skill_02_word_build",
        "pflege_m6_skill_03_dialogue_cloze",
      ],
      module07: [
        "pflege_m7_skill_01_vocab",
        "pflege_m7_skill_02_word_build",
        "pflege_m7_skill_03_dialogue_cloze",
      ],
      module08: [
        "pflege_m8_skill_01_vocab",
        "pflege_m8_skill_02_word_build",
        "pflege_m8_skill_03_dialogue_cloze",
      ],
      module09: [
        "pflege_m9_skill_01_vocab",
        "pflege_m9_skill_02_word_build",
        "pflege_m9_skill_03_dialogue_cloze",
      ],
      module10: [
        "pflege_m10_skill_01_vocab",
        "pflege_m10_skill_02_word_build",
        "pflege_m10_skill_03_dialogue_cloze",
      ],
      module11: [
        "pflege_m11_skill_01_vocab",
        "pflege_m11_skill_02_word_build",
        "pflege_m11_skill_03_dialogue_cloze",
      ],
      module12: [
        "pflege_m12_skill_01_vocab",
        "pflege_m12_skill_02_word_build",
        "pflege_m12_skill_03_dialogue_cloze",
      ],
    }),
    []
  );

  useEffect(() => {
    let active = true;
    (async () => {
      const allIds = Object.values(moduleSkillMap).flat();
      const resumes = await Promise.all(allIds.map((id) => getLessonResume(id)));
      const nextResume: Record<string, ResumeInfo | null> = {};
      allIds.forEach((id, idx) => {
        nextResume[id] = resumes[idx] ?? null;
      });
      if (!active) return;
      setResumeMap(nextResume);
    })();
    return () => {
      active = false;
    };
  }, [moduleSkillMap]);

  const getModuleStyle = (lessonIds: string[]) => {
    const statuses = lessonIds.map((id) =>
      getLessonStatus({
        completed: false,
        resumeStep: resumeMap[id]?.stepIndex,
        totalSteps: resumeMap[id]?.totalSteps,
      })
    );
    const status = aggregateStatus(statuses);
    return getCardStatusStyle(status);
  };

  return (
    <ScreenShell title="Pflege" showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <YStack padding="$4" gap="$4">
          <XStack alignItems="center" justifyContent="space-between">
            <YStack>
              <Text fontSize={20} fontWeight="900" color="$text">
                Pflege
              </Text>
              <Text color="$muted">Modulübersicht</Text>
            </YStack>
          </XStack>

          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/01");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module01);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData.title}
                  </Text>
                  <Text color="$muted">{moduleData.subtitle}</Text>
                  <Text color="$muted">~{moduleData.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/07");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module07);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData7.title}
                  </Text>
                  <Text color="$muted">{moduleData7.subtitle}</Text>
                  <Text color="$muted">~{moduleData7.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/08");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module08);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData8.title}
                  </Text>
                  <Text color="$muted">{moduleData8.subtitle}</Text>
                  <Text color="$muted">~{moduleData8.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/09");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module09);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData9.title}
                  </Text>
                  <Text color="$muted">{moduleData9.subtitle}</Text>
                  <Text color="$muted">~{moduleData9.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/10");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module10);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData10.title}
                  </Text>
                  <Text color="$muted">{moduleData10.subtitle}</Text>
                  <Text color="$muted">~{moduleData10.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/11");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module11);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData11.title}
                  </Text>
                  <Text color="$muted">{moduleData11.subtitle}</Text>
                  <Text color="$muted">~{moduleData11.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/12");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module12);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData12.title}
                  </Text>
                  <Text color="$muted">{moduleData12.subtitle}</Text>
                  <Text color="$muted">~{moduleData12.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/02");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module02);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData2.title}
                  </Text>
                  <Text color="$muted">{moduleData2.subtitle}</Text>
                  <Text color="$muted">~{moduleData2.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/03");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module03);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData3.title}
                  </Text>
                  <Text color="$muted">{moduleData3.subtitle}</Text>
                  <Text color="$muted">~{moduleData3.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/04");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module04);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData4.title}
                  </Text>
                  <Text color="$muted">{moduleData4.subtitle}</Text>
                  <Text color="$muted">~{moduleData4.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/05");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module05);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData5.title}
                  </Text>
                  <Text color="$muted">{moduleData5.subtitle}</Text>
                  <Text color="$muted">~{moduleData5.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await setLastJobFocus("pflege");
              router.push("/learn/job/pflege/06");
            }}
          >
            {(() => {
              const style = getModuleStyle(moduleSkillMap.module06);
              return (
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor={style.bg}
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {moduleData6.title}
                  </Text>
                  <Text color="$muted">{moduleData6.subtitle}</Text>
                  <Text color="$muted">~{moduleData6.durationMin} Min</Text>
                </YStack>
              );
            })()}
          </Pressable>
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
