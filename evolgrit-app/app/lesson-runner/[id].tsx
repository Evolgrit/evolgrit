import React, { useEffect, useMemo, useState, useRef } from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Text, XStack, YStack } from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageChoiceStep } from "../../components/lesson/steps/ImageChoiceStep";
import { ChoiceStep } from "../../components/lesson/steps/ChoiceStep";
import { ClozeChoiceStep } from "../../components/lesson/steps/ClozeChoiceStep";
import { ListenRepeatStep } from "../../components/lesson/steps/ListenRepeatStep";
import { ImageAudioChoiceStep } from "../../components/lesson/steps/ImageAudioChoiceStep";
import { ClozeAudioChoiceStep } from "../../components/lesson/steps/ClozeAudioChoiceStep";
import { playCorrect, playWrong, hapticCorrect, hapticWrong } from "../../lib/feedback";
import { LessonStepShell } from "../../components/lesson/LessonStepShell";
import { ConfirmModal } from "../../components/system/ConfirmModal";
import { GlassCard } from "../../components/system/GlassCard";
import { SoftButton } from "../../components/system/SoftButton";
import { lessonType } from "../../design/typography";
import { markLessonDone } from "../../lib/a1ProgressStore";
import { recordReview, type ReviewResult } from "../../lib/spacedRepetition";
import { bumpWrong, getCompletedCount, getItemProgress, markLessonCompleted, setLastSeen, setSuccessStreak, setWrongCount, type LevelId } from "../../lib/progressStore";
import { setUnlocked } from "../../lib/progress/unlocks";
import { enqueueReviewItems } from "../../lib/progress/spaced";
import { makeReviewItemsFromLesson } from "../../lib/progress/makeReviewItemsFromLesson";
import { logNextActionCompleted, setLastResumeLesson } from "../../lib/nextActionStore";
import { track } from "../../lib/tracking";

type ImageChoiceStepData = {
  type: "image_choice";
  prompt: string;
  ttsText?: string;
  choices: { id: string; label: string; imageKey?: string | null }[];
  answer: string;
};

type ImageAudioChoiceStepData = {
  type: "image_audio_choice";
  prompt: string;
  tts?: { text: string; rate?: "normal" | "slow" };
  options: { id: string; label: string; imageKey?: string | null; audioText?: string; ttsText?: string }[];
  answerId: string;
};

type ChoiceStepDef = {
  type: "choice";
  prompt: string;
  text?: string;
  choices: { id: string; label: string }[];
  answer: string;
};

type ClozeChoiceStepData = {
  type: "cloze_choice";
  prompt: string;
  text: string;
  choices: { id: string; label: string }[];
  answer: string;
};

type ClozeAudioChoiceStepData = {
  type: "cloze_audio_choice";
  prompt: string;
  tts?: { text: string; rate?: "normal" | "slow" };
  imageKey?: string | null;
  sentence: { before?: string; after?: string };
  translation?: string;
  choices: { id: string; label: string }[];
  answerId: string;
};

type WordBuildStep = {
  type: "word_build";
  prompt: string;
  text: string;
  choices: { id: string; label: string }[];
  answer: string;
};

type DialogueChoiceStep = {
  type: "dialogue_choice";
  prompt: string;
  text?: string;
  choices: { id: string; label: string }[];
  answer: string;
};

type ListenRepeatStepDef = {
  type: "listen_repeat";
  prompt: string;
  ttsText: string;
  cta?: string;
};

type SummaryStep = {
  type: "summary";
  title: string;
  text?: string;
  bullets?: string[];
  cta?: string;
};

type Step =
  | ImageChoiceStepData
  | ImageAudioChoiceStepData
  | ChoiceStepDef
  | ClozeChoiceStepData
  | ClozeAudioChoiceStepData
  | WordBuildStep
  | DialogueChoiceStep
  | ListenRepeatStepDef
  | SummaryStep;

type Lesson = { id: string; title: string; level?: string; week?: number; steps: Step[] };

const lessons: Record<string, Lesson> = {
  a1_w1_name: require("../../content/a1/week1/lesson_sich_vorstellen_name.json"),
  a1_l1_01_name: require("../../content/a1/lessons/a1_l1_01_name.json"),
  a1_l1_02_herkunft: require("../../content/a1/lessons/a1_l1_02_herkunft.json"),
  a1_l1_03_begruessen: require("../../content/a1/lessons/a1_l1_03_begruessen.json"),
  a1_l1_04_bitte_danke: require("../../content/a1/lessons/a1_l1_04_bitte_danke.json"),
  a1_l2_01_einkaufen_basics: require("../../content/a1/lessons/a1_l2_01_einkaufen_basics.json"),
  a1_l2_02_preise_mengen: require("../../content/a1/lessons/a1_l2_02_preise_mengen.json"),
  a1_l2_03_fragen_wo_ist: require("../../content/a1/lessons/a1_l2_03_fragen_wo_ist.json"),
  a1_l2_04_kasse_bitte_danke: require("../../content/a1/lessons/a1_l2_04_kasse_bitte_danke.json"),
  a1_l3_01_menschen_namen: require("../../content/a1/lessons/a1_l3_01_menschen_namen.json"),
  a1_l3_02_orte_in_der_stadt: require("../../content/a1/lessons/a1_l3_02_orte_in_der_stadt.json"),
  a1_l3_03_weg_beschreiben: require("../../content/a1/lessons/a1_l3_03_weg_beschreiben.json"),
  a1_l3_04_treffen_verabreden: require("../../content/a1/lessons/a1_l3_04_treffen_verabreden.json"),
  a1_l4_01_uhrzeit_termin: require("../../content/a1/lessons/a1_l4_01_uhrzeit_termin.json"),
  a1_l4_02_absagen_entschuldigen: require("../../content/a1/lessons/a1_l4_02_absagen_entschuldigen.json"),
  a1_l4_03_regeln_verbot_erlaubt: require("../../content/a1/lessons/a1_l4_03_regeln_verbot_erlaubt.json"),
  a1_l4_04_termin_verschieben: require("../../content/a1/lessons/a1_l4_04_termin_verschieben.json"),
  a1_l5_01_wohnung_adresse: require("../../content/a1/lessons/a1_l5_01_wohnung_adresse.json"),
  a1_l5_02_nachbarn_ruhe: require("../../content/a1/lessons/a1_l5_02_nachbarn_ruhe.json"),
  a1_l5_03_problem_in_der_wohnung: require("../../content/a1/lessons/a1_l5_03_problem_in_der_wohnung.json"),
  a1_l5_04_hausordnung_muell: require("../../content/a1/lessons/a1_l5_04_hausordnung_muell.json"),
  a1_l6_01_job_erster_tag: require("../../content/a1/lessons/a1_l6_01_job_erster_tag.json"),
  a1_l6_02_aufgaben_einfach: require("../../content/a1/lessons/a1_l6_02_aufgaben_einfach.json"),
  a1_l6_03_zeiten_pause: require("../../content/a1/lessons/a1_l6_03_zeiten_pause.json"),
  a1_l6_04_hilfe_verstehen: require("../../content/a1/lessons/a1_l6_04_hilfe_verstehen.json"),
  a1_l7_01_bitte_fragen: require("../../content/a1/lessons/a1_l7_01_bitte_fragen.json"),
  a1_l7_02_ablehnen_hoeflich: require("../../content/a1/lessons/a1_l7_02_ablehnen_hoeflich.json"),
  a1_l7_03_meinung_einfach: require("../../content/a1/lessons/a1_l7_03_meinung_einfach.json"),
  a1_l7_04_wiederholen_langsam: require("../../content/a1/lessons/a1_l7_04_wiederholen_langsam.json"),
  a1_l8_01_wiederholung: require("../../content/a1/lessons/a1_l8_01_wiederholung.json"),
  a1_l8_02_alltag_simulation: require("../../content/a1/lessons/a1_l8_02_alltag_simulation.json"),
  a1_l8_03_sprechen_kurz: require("../../content/a1/lessons/a1_l8_03_sprechen_kurz.json"),
  a1_l8_04_abschluss: require("../../content/a1/lessons/a1_l8_04_abschluss.json"),
  a2_l01_smalltalk: require("../../content/a2/lessons/a2_lesson_01_smalltalk.json"),
  a2_l02_zeiten_tagesablauf: require("../../content/a2/lessons/a2_lesson_02_zeiten_tagesablauf.json"),
  a2_l03_weg_und_richtung: require("../../content/a2/lessons/a2_lesson_03_weg_und_richtung.json"),
  a2_l04_einkaufen_a2: require("../../content/a2/lessons/a2_lesson_04_einkaufen_a2.json"),
  a2_l05_termine: require("../../content/a2/lessons/a2_lesson_05_termine.json"),
  a2_l06_arbeit_alltag: require("../../content/a2/lessons/a2_lesson_06_arbeit_alltag.json"),
  a2_l07_wohnung_probleme: require("../../content/a2/lessons/a2_lesson_07_wohnung_probleme.json"),
  a2_l08_review: require("../../content/a2/lessons/a2_lesson_08_wiederholung.json"),
  a1_review_01: require("../../content/a1/review/a1_review_01.json"),
  a1_review_02: require("../../content/a1/review/a1_review_02.json"),
  a1_review_03: require("../../content/a1/review/a1_review_03.json"),
  a1_review_04: require("../../content/a1/review/a1_review_04.json"),
  b1_01_smalltalk_opinion: require("../../content/b1/lessons/b1_lesson_01_smalltalk_opinion.json"),
  b1_02_phone_reschedule: require("../../content/b1/lessons/b1_lesson_02_phone_reschedule.json"),
  b1_03_polite_complaint: require("../../content/b1/lessons/b1_lesson_03_polite_complaint.json"),
  b1_04_work_problem: require("../../content/b1/lessons/b1_lesson_04_work_problem.json"),
  b1_05_exam_sim_1: require("../../content/b1/lessons/b1_lesson_05_exam_sim_1.json"),
  b1_06_exam_sim_2: require("../../content/b1/lessons/b1_lesson_06_exam_sim_2.json"),
  b2_01_opinion: require("../../content/b2/b2_lesson_01_opinion.json"),
  b2_02_structure: require("../../content/b2/lessons/b2_lesson_02_structure.json"),
  b2_03_conflict: require("../../content/b2/lessons/b2_lesson_03_conflict.json"),
  pflege_m1_skill_01_vocab: require("../../content/job/pflege/module_01/skills/pflege_m1_skill_01_vocab.json"),
  pflege_m1_skill_02_word_build: require("../../content/job/pflege/module_01/skills/pflege_m1_skill_02_word_build.json"),
  pflege_m1_skill_03_dialogue_cloze: require("../../content/job/pflege/module_01/skills/pflege_m1_skill_03_dialogue_cloze.json"),
  pflege_m2_skill_01_vocab: require("../../content/job/pflege/module_02/skills/pflege_m2_skill_01_vocab.json"),
  pflege_m2_skill_02_word_build: require("../../content/job/pflege/module_02/skills/pflege_m2_skill_02_word_build.json"),
  pflege_m2_skill_03_dialogue_cloze: require("../../content/job/pflege/module_02/skills/pflege_m2_skill_03_dialogue_cloze.json"),
  pflege_m3_skill_01_vocab: require("../../content/job/pflege/module_03/skills/pflege_m3_skill_01_vocab.json"),
  pflege_m3_skill_02_word_build: require("../../content/job/pflege/module_03/skills/pflege_m3_skill_02_word_build.json"),
  pflege_m3_skill_03_dialogue_cloze: require("../../content/job/pflege/module_03/skills/pflege_m3_skill_03_dialogue_cloze.json"),
  pflege_m4_skill_01_vocab: require("../../content/job/pflege/module_04/skills/pflege_m4_skill_01_vocab.json"),
  pflege_m4_skill_02_word_build: require("../../content/job/pflege/module_04/skills/pflege_m4_skill_02_word_build.json"),
  pflege_m4_skill_03_dialogue_cloze: require("../../content/job/pflege/module_04/skills/pflege_m4_skill_03_dialogue_cloze.json"),
  pflege_m5_skill_01_vocab: require("../../content/job/pflege/module_05/skills/pflege_m5_skill_01_vocab.json"),
  pflege_m5_skill_02_word_build: require("../../content/job/pflege/module_05/skills/pflege_m5_skill_02_word_build.json"),
  pflege_m5_skill_03_dialogue_cloze: require("../../content/job/pflege/module_05/skills/pflege_m5_skill_03_dialogue_cloze.json"),
  pflege_m6_skill_01_vocab: require("../../content/job/pflege/module_06/skills/pflege_m6_skill_01_vocab.json"),
  pflege_m6_skill_02_word_build: require("../../content/job/pflege/module_06/skills/pflege_m6_skill_02_word_build.json"),
  pflege_m6_skill_03_dialogue_cloze: require("../../content/job/pflege/module_06/skills/pflege_m6_skill_03_dialogue_cloze.json"),
  pflege_m7_skill_01_vocab: require("../../content/job/pflege/module_07/skills/pflege_m7_skill_01_vocab.json"),
  pflege_m7_skill_02_word_build: require("../../content/job/pflege/module_07/skills/pflege_m7_skill_02_word_build.json"),
  pflege_m7_skill_03_dialogue_cloze: require("../../content/job/pflege/module_07/skills/pflege_m7_skill_03_dialogue_cloze.json"),
  pflege_m8_skill_01_vocab: require("../../content/job/pflege/module_08/skills/pflege_m8_skill_01_vocab.json"),
  pflege_m8_skill_02_word_build: require("../../content/job/pflege/module_08/skills/pflege_m8_skill_02_word_build.json"),
  pflege_m8_skill_03_dialogue_cloze: require("../../content/job/pflege/module_08/skills/pflege_m8_skill_03_dialogue_cloze.json"),
  pflege_m9_skill_01_vocab: require("../../content/job/pflege/module_09/skills/pflege_m9_skill_01_vocab.json"),
  pflege_m9_skill_02_word_build: require("../../content/job/pflege/module_09/skills/pflege_m9_skill_02_word_build.json"),
  pflege_m9_skill_03_dialogue_cloze: require("../../content/job/pflege/module_09/skills/pflege_m9_skill_03_dialogue_cloze.json"),
  pflege_m10_skill_01_vocab: require("../../content/job/pflege/module_10/skills/pflege_m10_skill_01_vocab.json"),
  pflege_m10_skill_02_word_build: require("../../content/job/pflege/module_10/skills/pflege_m10_skill_02_word_build.json"),
  pflege_m10_skill_03_dialogue_cloze: require("../../content/job/pflege/module_10/skills/pflege_m10_skill_03_dialogue_cloze.json"),
  pflege_m11_skill_01_vocab: require("../../content/job/pflege/module_11/skills/pflege_m11_skill_01_vocab.json"),
  pflege_m11_skill_02_word_build: require("../../content/job/pflege/module_11/skills/pflege_m11_skill_02_word_build.json"),
  pflege_m11_skill_03_dialogue_cloze: require("../../content/job/pflege/module_11/skills/pflege_m11_skill_03_dialogue_cloze.json"),
  pflege_m12_skill_01_vocab: require("../../content/job/pflege/module_12/skills/pflege_m12_skill_01_vocab.json"),
  pflege_m12_skill_02_word_build: require("../../content/job/pflege/module_12/skills/pflege_m12_skill_02_word_build.json"),
  pflege_m12_skill_03_dialogue_cloze: require("../../content/job/pflege/module_12/skills/pflege_m12_skill_03_dialogue_cloze.json"),
  a1_u01_l01: require("../../content/a1/lessons/a1_u01_l01.json"),
  a1_u01_l02: require("../../content/a1/lessons/a1_u01_l02.json"),
  a1_u01_m01: require("../../content/a1/lessons/a1_u01_m01.json"),
  a1_u01_q01: require("../../content/a1/lessons/a1_u01_q01.json"),
  a1_u02_l01: require("../../content/a1/lessons/a1_u02_l01.json"),
  a1_u02_l02: require("../../content/a1/lessons/a1_u02_l02.json"),
  a1_u02_m01: require("../../content/a1/lessons/a1_u02_m01.json"),
  a1_u02_q01: require("../../content/a1/lessons/a1_u02_q01.json"),
  a1_u03_l01: require("../../content/a1/lessons/a1_u03_l01.json"),
  a1_u03_l02: require("../../content/a1/lessons/a1_u03_l02.json"),
  a1_u03_m01: require("../../content/a1/lessons/a1_u03_m01.json"),
  a1_u03_q01: require("../../content/a1/lessons/a1_u03_q01.json"),
  a1_u04_l01: require("../../content/a1/lessons/a1_u04_l01.json"),
  a1_u04_l02: require("../../content/a1/lessons/a1_u04_l02.json"),
  a1_u04_m01: require("../../content/a1/lessons/a1_u04_m01.json"),
  a1_u04_q01: require("../../content/a1/lessons/a1_u04_q01.json"),
  a1_u05_l01: require("../../content/a1/lessons/a1_u05_l01.json"),
  a1_u05_l02: require("../../content/a1/lessons/a1_u05_l02.json"),
  a1_u05_m01: require("../../content/a1/lessons/a1_u05_m01.json"),
  a1_u05_q01: require("../../content/a1/lessons/a1_u05_q01.json"),
  a1_u06_l01: require("../../content/a1/lessons/a1_u06_l01.json"),
  a1_u06_l02: require("../../content/a1/lessons/a1_u06_l02.json"),
  a1_u06_m01: require("../../content/a1/lessons/a1_u06_m01.json"),
  a1_u06_q01: require("../../content/a1/lessons/a1_u06_q01.json"),
  a1_u07_l01: require("../../content/a1/lessons/a1_u07_l01.json"),
  a1_u07_l02: require("../../content/a1/lessons/a1_u07_l02.json"),
  a1_u07_m01: require("../../content/a1/lessons/a1_u07_m01.json"),
  a1_u07_q01: require("../../content/a1/lessons/a1_u07_q01.json"),
  a1_u08_l01: require("../../content/a1/lessons/a1_u08_l01.json"),
  a1_u08_l02: require("../../content/a1/lessons/a1_u08_l02.json"),
  a1_u08_m01: require("../../content/a1/lessons/a1_u08_m01.json"),
  a1_u08_q01: require("../../content/a1/lessons/a1_u08_q01.json"),
  a1_u09_l01: require("../../content/a1/lessons/a1_u09_l01.json"),
  a1_u09_l02: require("../../content/a1/lessons/a1_u09_l02.json"),
  a1_u09_m01: require("../../content/a1/lessons/a1_u09_m01.json"),
  a1_u09_q01: require("../../content/a1/lessons/a1_u09_q01.json"),
  a1_u10_l01: require("../../content/a1/lessons/a1_u10_l01.json"),
  a1_u10_l02: require("../../content/a1/lessons/a1_u10_l02.json"),
  a1_u10_m01: require("../../content/a1/lessons/a1_u10_m01.json"),
  a1_u10_q01: require("../../content/a1/lessons/a1_u10_q01.json"),
  a1_u11_l01: require("../../content/a1/lessons/a1_u11_l01.json"),
  a1_u11_l02: require("../../content/a1/lessons/a1_u11_l02.json"),
  a1_u11_m01: require("../../content/a1/lessons/a1_u11_m01.json"),
  a1_u11_q01: require("../../content/a1/lessons/a1_u11_q01.json"),
  a1_u12_l01: require("../../content/a1/lessons/a1_u12_l01.json"),
  a1_u12_l02: require("../../content/a1/lessons/a1_u12_l02.json"),
  a1_u12_m01: require("../../content/a1/lessons/a1_u12_m01.json"),
  a1_u12_q01: require("../../content/a1/lessons/a1_u12_q01.json"),
  a1_u13_l01: require("../../content/a1/lessons/a1_u13_l01.json"),
  a1_u13_l02: require("../../content/a1/lessons/a1_u13_l02.json"),
  a1_u13_m01: require("../../content/a1/lessons/a1_u13_m01.json"),
  a1_u13_q01: require("../../content/a1/lessons/a1_u13_q01.json"),
  a1_u14_l01: require("../../content/a1/lessons/a1_u14_l01.json"),
  a1_u14_l02: require("../../content/a1/lessons/a1_u14_l02.json"),
  a1_u14_m01: require("../../content/a1/lessons/a1_u14_m01.json"),
  a1_u14_q01: require("../../content/a1/lessons/a1_u14_q01.json"),
  a1_u15_l01: require("../../content/a1/lessons/a1_u15_l01.json"),
  a1_u15_l02: require("../../content/a1/lessons/a1_u15_l02.json"),
  a1_u15_m01: require("../../content/a1/lessons/a1_u15_m01.json"),
  a1_u15_q01: require("../../content/a1/lessons/a1_u15_q01.json"),
  a1_u16_l01: require("../../content/a1/lessons/a1_u16_l01.json"),
  a1_u16_l02: require("../../content/a1/lessons/a1_u16_l02.json"),
  a1_u16_m01: require("../../content/a1/lessons/a1_u16_m01.json"),
  a1_u16_q01: require("../../content/a1/lessons/a1_u16_q01.json"),
  a1_u17_l01: require("../../content/a1/lessons/a1_u17_l01.json"),
  a1_u17_l02: require("../../content/a1/lessons/a1_u17_l02.json"),
  a1_u17_m01: require("../../content/a1/lessons/a1_u17_m01.json"),
  a1_u17_q01: require("../../content/a1/lessons/a1_u17_q01.json"),
  a1_u18_l01: require("../../content/a1/lessons/a1_u18_l01.json"),
  a1_u18_l02: require("../../content/a1/lessons/a1_u18_l02.json"),
  a1_u18_m01: require("../../content/a1/lessons/a1_u18_m01.json"),
  a1_u18_q01: require("../../content/a1/lessons/a1_u18_q01.json"),
  a1_u19_l01: require("../../content/a1/lessons/a1_u19_l01.json"),
  a1_u19_l02: require("../../content/a1/lessons/a1_u19_l02.json"),
  a1_u19_m01: require("../../content/a1/lessons/a1_u19_m01.json"),
  a1_u19_q01: require("../../content/a1/lessons/a1_u19_q01.json"),
  a1_u20_l01: require("../../content/a1/lessons/a1_u20_l01.json"),
  a1_u20_l02: require("../../content/a1/lessons/a1_u20_l02.json"),
  a1_u20_m01: require("../../content/a1/lessons/a1_u20_m01.json"),
  a1_u20_q01: require("../../content/a1/lessons/a1_u20_q01.json"),

  a2_u01_l01_wie_gehts: require("../../content/a2/lessons/a2_u01_l01_wie_gehts.json"),
  a2_u01_l02_zeiten_tagesablauf: require("../../content/a2/lessons/a2_u01_l02_zeiten_tagesablauf.json"),
  a2_u01_m01_smalltalk_mini: require("../../content/a2/lessons/a2_u01_m01_smalltalk_mini.json"),
  a2_u01_q01_smalltalk_quiz: require("../../content/a2/lessons/a2_u01_q01_smalltalk_quiz.json"),
  a2_u02_l03_weg_fragen_a2: require("../../content/a2/lessons/a2_u02_l03_weg_fragen_a2.json"),
  a2_u02_l04_probleme_unterwegs: require("../../content/a2/lessons/a2_u02_l04_probleme_unterwegs.json"),
  a2_u02_m01_wege_mini: require("../../content/a2/lessons/a2_u02_m01_wege_mini.json"),
  a2_u02_q01_wege_quiz: require("../../content/a2/lessons/a2_u02_q01_wege_quiz.json"),

  a2_u01_l01: require("../../content/a2/lessons/a2_u01_l01.json"),
  a2_u01_l02: require("../../content/a2/lessons/a2_u01_l02.json"),
  a2_u01_m01: require("../../content/a2/lessons/a2_u01_m01.json"),
  a2_u01_q01: require("../../content/a2/lessons/a2_u01_q01.json"),
  a2_u02_l01: require("../../content/a2/lessons/a2_u02_l01.json"),
  a2_u02_l02: require("../../content/a2/lessons/a2_u02_l02.json"),
  a2_u02_m01: require("../../content/a2/lessons/a2_u02_m01.json"),
  a2_u02_q01: require("../../content/a2/lessons/a2_u02_q01.json"),
  a2_u03_l01: require("../../content/a2/lessons/a2_u03_l01.json"),
  a2_u03_l02: require("../../content/a2/lessons/a2_u03_l02.json"),
  a2_u03_m01: require("../../content/a2/lessons/a2_u03_m01.json"),
  a2_u03_q01: require("../../content/a2/lessons/a2_u03_q01.json"),
  a2_u04_l01: require("../../content/a2/lessons/a2_u04_l01.json"),
  a2_u04_l02: require("../../content/a2/lessons/a2_u04_l02.json"),
  a2_u04_m01: require("../../content/a2/lessons/a2_u04_m01.json"),
  a2_u04_q01: require("../../content/a2/lessons/a2_u04_q01.json"),
  a2_u05_l01: require("../../content/a2/lessons/a2_u05_l01.json"),
  a2_u05_l02: require("../../content/a2/lessons/a2_u05_l02.json"),
  a2_u05_m01: require("../../content/a2/lessons/a2_u05_m01.json"),
  a2_u05_q01: require("../../content/a2/lessons/a2_u05_q01.json"),
  a2_u06_l01: require("../../content/a2/lessons/a2_u06_l01.json"),
  a2_u06_l02: require("../../content/a2/lessons/a2_u06_l02.json"),
  a2_u06_m01: require("../../content/a2/lessons/a2_u06_m01.json"),
  a2_u06_q01: require("../../content/a2/lessons/a2_u06_q01.json"),
  a2_u07_l01: require("../../content/a2/lessons/a2_u07_l01.json"),
  a2_u07_l02: require("../../content/a2/lessons/a2_u07_l02.json"),
  a2_u07_m01: require("../../content/a2/lessons/a2_u07_m01.json"),
  a2_u07_q01: require("../../content/a2/lessons/a2_u07_q01.json"),
  a2_u08_l01: require("../../content/a2/lessons/a2_u08_l01.json"),
  a2_u08_l02: require("../../content/a2/lessons/a2_u08_l02.json"),
  a2_u08_m01: require("../../content/a2/lessons/a2_u08_m01.json"),
  a2_u08_q01: require("../../content/a2/lessons/a2_u08_q01.json"),
  a2_u09_l01: require("../../content/a2/lessons/a2_u09_l01.json"),
  a2_u09_l02: require("../../content/a2/lessons/a2_u09_l02.json"),
  a2_u09_m01: require("../../content/a2/lessons/a2_u09_m01.json"),
  a2_u09_q01: require("../../content/a2/lessons/a2_u09_q01.json"),
  a2_u10_l01: require("../../content/a2/lessons/a2_u10_l01.json"),
  a2_u10_l02: require("../../content/a2/lessons/a2_u10_l02.json"),
  a2_u10_m01: require("../../content/a2/lessons/a2_u10_m01.json"),
  a2_u10_q01: require("../../content/a2/lessons/a2_u10_q01.json"),
  a2_u11_l01: require("../../content/a2/lessons/a2_u11_l01.json"),
  a2_u11_l02: require("../../content/a2/lessons/a2_u11_l02.json"),
  a2_u11_m01: require("../../content/a2/lessons/a2_u11_m01.json"),
  a2_u11_q01: require("../../content/a2/lessons/a2_u11_q01.json"),
  a2_u12_l01: require("../../content/a2/lessons/a2_u12_l01.json"),
  a2_u12_l02: require("../../content/a2/lessons/a2_u12_l02.json"),
  a2_u12_m01: require("../../content/a2/lessons/a2_u12_m01.json"),
  a2_u12_q01: require("../../content/a2/lessons/a2_u12_q01.json"),
  a2_u13_l01: require("../../content/a2/lessons/a2_u13_l01.json"),
  a2_u13_l02: require("../../content/a2/lessons/a2_u13_l02.json"),
  a2_u13_m01: require("../../content/a2/lessons/a2_u13_m01.json"),
  a2_u13_q01: require("../../content/a2/lessons/a2_u13_q01.json"),
  a2_u14_l01: require("../../content/a2/lessons/a2_u14_l01.json"),
  a2_u14_l02: require("../../content/a2/lessons/a2_u14_l02.json"),
  a2_u14_m01: require("../../content/a2/lessons/a2_u14_m01.json"),
  a2_u14_q01: require("../../content/a2/lessons/a2_u14_q01.json"),
  a2_u15_l01: require("../../content/a2/lessons/a2_u15_l01.json"),
  a2_u15_l02: require("../../content/a2/lessons/a2_u15_l02.json"),
  a2_u15_m01: require("../../content/a2/lessons/a2_u15_m01.json"),
  a2_u15_q01: require("../../content/a2/lessons/a2_u15_q01.json"),

};

type ConfirmMode = "none" | "exit" | "resume";

export default function LessonRunnerScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>("none");
  const [resumeStep, setResumeStep] = useState<number | null>(null);
  const [canAdvance, setCanAdvance] = useState(false);
  const lessonStartRef = useRef(Date.now());
  const trackedMinutesRef = useRef(false);

  const lesson = useMemo(() => {
    if (!id) return null;
    return lessons[String(id)];
  }, [id]);

  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [listenRepeatFails, setListenRepeatFails] = useState(0);

  const resolveLevel = (lessonId: string, level?: string): LevelId | null => {
    if (level === "A1" || level === "A2" || level === "B1" || level === "B2") return level;
    if (lessonId.startsWith("a1_")) return "A1";
    if (lessonId.startsWith("a2_")) return "A2";
    if (lessonId.startsWith("b1_")) return "B1";
    if (lessonId.startsWith("b2_")) return "B2";
    return null;
  };

  const getA1CompletionKey = (lessonId: string) => {
    const match = lessonId.match(/^a1_l(\d+)_/);
    if (!match) return null;
    return `a1_l${match[1]}`;
  };

  const storageKey = lesson ? `lesson_progress:${lesson.id}` : "";

  useEffect(() => {
    const loadProgress = async () => {
      if (!storageKey) return;
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (typeof parsed?.stepIndex === "number" && parsed.stepIndex > 0) {
          setResumeStep(parsed.stepIndex);
          setConfirmMode("resume");
        }
      } catch {
        // ignore
      }
    };
    loadProgress();
  }, [storageKey]);

  useEffect(() => {
    const persist = async () => {
      if (!storageKey || !lesson) return;
      try {
        const level = resolveLevel(lesson.id, lesson.level);
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify({
            stepIndex,
            totalSteps: lesson.steps.length,
            title: lesson.title,
            level: level ?? undefined,
            updatedAt: Date.now(),
          })
        );
        if (stepIndex > 0 && stepIndex < lesson.steps.length - 1) {
          await setLastResumeLesson(`/lesson-runner/${lesson.id}?resume=1`);
        }
      } catch {
        // ignore
      }
    };
    persist();
  }, [storageKey, stepIndex, lesson]);

  useEffect(() => {
    lessonStartRef.current = Date.now();
    trackedMinutesRef.current = false;
    return () => {
      if (!lesson || trackedMinutesRef.current) return;
      const durationSec = Math.round((Date.now() - lessonStartRef.current) / 1000);
      if (durationSec <= 0) return;
      track({
        ts: Date.now(),
        category: "language",
        action: "lesson_minutes",
        durationSec,
        level: (lesson.level as any) ?? "A1",
        id: lesson.id,
      }).catch(() => {});
      trackedMinutesRef.current = true;
    };
  }, [lesson?.id]);

  useEffect(() => {
    setSelected(null);
    setReveal(false);
    setCanAdvance(false);
  }, [stepIndex]);

  useEffect(() => {
    if (!lesson) return;
    const currentStep = lesson.steps[stepIndex];
    if (currentStep?.type === "summary") {
      setCanAdvance(true);
    }
  }, [lesson, stepIndex]);

  useEffect(() => {
    if (!lesson?.steps) return;
    lesson.steps.forEach((s: any, idx: number) => {
      if (s?.type === "choice" && !Array.isArray(s?.choices)) {
        console.warn("[lesson-runner] invalid choice step", { lessonId: id, idx, s });
      }
      if (s?.type === "cloze_choice" && typeof s?.text !== "string") {
        console.warn("[lesson-runner] invalid cloze_choice step", { lessonId: id, idx, s });
      }
    });
  }, [lesson, id]);

  if (!lesson) {
    return (
      <YStack flex={1} backgroundColor="#FFFFFF" padding="$4" justifyContent="center">
        <Text color="$muted" {...lessonType.body}>
          Lektion nicht gefunden.
        </Text>
      </YStack>
    );
  }

  const step = lesson.steps[stepIndex];
  const footerHeight = 64;
  const canGoNext = step.type === "summary" ? true : canAdvance;

  const onChoice = async (optionId: string, correct: boolean) => {
    setSelected(optionId);
    setReveal(true);
    if (correct) {
      await hapticCorrect();
      await playCorrect();
      setCanAdvance(true);
    } else {
      const level = lesson ? resolveLevel(lesson.id, lesson.level) : null;
      if (level) {
        bumpWrong(level, lesson.id);
      }
      setWrongAttempts((count) => count + 1);
      await hapticWrong();
      await playWrong();
      setCanAdvance(false);
    }
  };

  const advance = async () => {
    if (stepIndex < lesson.steps.length - 1) {
      setStepIndex((i) => i + 1);
      setCanAdvance(false);
    } else {
      if (storageKey) AsyncStorage.removeItem(storageKey).catch(() => {});
      await setLastResumeLesson(null);
      await logNextActionCompleted("resume_lesson", 3);
      const durationSec = Math.round((Date.now() - lessonStartRef.current) / 1000);
      if (!trackedMinutesRef.current && durationSec > 0) {
        track({
          ts: Date.now(),
          category: "language",
          action: "lesson_minutes",
          durationSec,
          level: (lesson.level as any) ?? "A1",
          id: lesson.id,
        }).catch(() => {});
        trackedMinutesRef.current = true;
      }
      track({
        ts: Date.now(),
        category: "language",
        action: "lesson_complete",
        level: (lesson.level as any) ?? "A1",
        id: lesson.id,
      }).catch(() => {});
      const reviewResult: ReviewResult =
        wrongAttempts > 2 || listenRepeatFails > 0
          ? "hard"
          : wrongAttempts === 0 && listenRepeatFails === 0
          ? "easy"
          : "ok";
      markLessonDone(lesson.id);
      recordReview(lesson.id, reviewResult);
      const level = resolveLevel(lesson.id, lesson.level);
      if (level) {
        const completionKey =
          level === "A1" ? getA1CompletionKey(lesson.id) : lesson.id;
        if (completionKey) {
          await markLessonCompleted(level, completionKey);
        }
        await setLastSeen(level, lesson.id);
        if (level === "A1") {
          if (lesson.id.startsWith("a1_review_")) {
            const progress = await getItemProgress("A1", lesson.id);
            const nextStreak = reviewResult === "hard" ? 0 : progress.successStreak + 1;
            await setSuccessStreak("A1", lesson.id, nextStreak);
            if (reviewResult !== "hard") {
              await setWrongCount("A1", lesson.id, 0);
            }
          }
          const completedCount = await getCompletedCount("A1");
          if (completedCount >= 8) {
            await setUnlocked("A2", true);
            await enqueueReviewItems(makeReviewItemsFromLesson(lesson));
            router.replace("/learn/a1/completed");
            return;
          }
        }
      }
      router.back();
    }
  };

  const resetLessonProgress = () => {
    setStepIndex(0);
    setSelected(null);
    setReveal(false);
    setCanAdvance(false);
    setResumeStep(null);
    if (storageKey) AsyncStorage.removeItem(storageKey).catch(() => {});
    setLastResumeLesson(null).catch(() => {});
    trackedMinutesRef.current = false;
  };

  const handleBack = () => {
    if (confirmMode !== "none") return;
    setConfirmMode("exit");
  };

  const remindLater = async () => {
    try {
      const perm = await Notifications.requestPermissionsAsync();
      if (!perm.granted) {
        return;
      }
      await Notifications.scheduleNotificationAsync({
        content: { title: "Evolgrit", body: "Weiter mit deiner Mini-Lektion?" },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60 * 60 },
      });
      setConfirmMode("none");
      router.back();
    } catch {
      // ignore
    }
  };

  return (
    <YStack flex={1} backgroundColor="#FFFFFF">
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        contentContainerStyle={{
          paddingBottom: footerHeight + insets.bottom + 16,
          alignItems: "center",
          gap: 16,
        }}
      >
        <LessonStepShell
          title={lesson.title}
          subtitle={`Schritt ${stepIndex + 1} von ${lesson.steps.length}`}
          progress={(stepIndex + 1) / lesson.steps.length}
          onBack={handleBack}
          onNext={advance}
          canNext={canAdvance}
          wrapCard={step.type !== "listen_repeat"}
        >
          {step.type === "image_audio_choice" ? (
            <ImageAudioChoiceStep
              prompt={step.prompt}
              ttsText={step.tts?.text}
              options={step.options.map((opt) => ({ ...opt, correct: opt.id === step.answerId }))}
              selectedId={selected}
              reveal={reveal}
              onSelect={onChoice}
            />
          ) : null}

          {step.type === "image_choice" ? (
            (() => {
              const rawChoices = Array.isArray((step as any).choices)
                ? (step as any).choices
                : null;
              if (!rawChoices) {
                console.warn("[lesson-runner] choice step missing choices", { id, stepIndex, step });
                return (
                  <YStack gap="$3">
                    <GlassCard>
                      <Text fontSize="$6" fontWeight="600">
                        Schritt-Fehler im Inhalt
                      </Text>
                      <Text opacity={0.7} marginTop="$2">
                        Diese Aufgabe ist gerade nicht korrekt konfiguriert. Du kannst trotzdem weitergehen.
                      </Text>
                    </GlassCard>
                    <SoftButton label="Weiter" onPress={() => advance()} />
                  </YStack>
                );
              }
              return (
                <ImageChoiceStep
                  prompt={step.prompt}
                  options={(rawChoices ?? []).map((opt: any) => ({
                    ...opt,
                    correct: opt.id === (step as any).answer,
                  }))}
                  selectedId={selected}
                  reveal={reveal}
                  onSelect={onChoice}
                />
              );
            })()
          ) : null}

          {step.type === "choice" ? (
            (() => {
              const rawChoices = Array.isArray((step as any).choices)
                ? (step as any).choices
                : null;
              if (!rawChoices) {
                console.warn("[lesson-runner] choice step missing choices", { id, stepIndex, step });
                return (
                  <YStack gap="$3">
                    <GlassCard>
                      <Text fontSize="$6" fontWeight="600">
                        Schritt-Fehler im Inhalt
                      </Text>
                      <Text opacity={0.7} marginTop="$2">
                        Diese Aufgabe ist gerade nicht korrekt konfiguriert. Du kannst trotzdem weitergehen.
                      </Text>
                    </GlassCard>
                    <SoftButton label="Weiter" onPress={() => advance()} />
                  </YStack>
                );
              }
              return (
                <ChoiceStep
                  prompt={step.prompt}
                  text={step.text}
                  options={(rawChoices ?? []).map((opt: any) => ({
                    ...opt,
                    correct: opt.id === (step as any).answer,
                  }))}
                  selectedId={selected}
                  reveal={reveal}
                  onSelect={onChoice}
                />
              );
            })()
          ) : null}

          {step.type === "cloze_choice" ? (
            (() => {
              const rawChoices = Array.isArray((step as any).choices)
                ? (step as any).choices
                : null;
              const rawText = typeof (step as any).text === "string" ? (step as any).text : "";
              if (!rawChoices || !rawText) {
                console.warn("[lesson-runner] choice step missing choices", { id, stepIndex, step });
                return (
                  <YStack gap="$3">
                    <GlassCard>
                      <Text fontSize="$6" fontWeight="600">
                        Schritt-Fehler im Inhalt
                      </Text>
                      <Text opacity={0.7} marginTop="$2">
                        Diese Aufgabe ist gerade nicht korrekt konfiguriert. Du kannst trotzdem weitergehen.
                      </Text>
                    </GlassCard>
                    <SoftButton label="Weiter" onPress={() => advance()} />
                  </YStack>
                );
              }
              return (
                <ClozeChoiceStep
                  prompt={step.prompt}
                  text={step.text}
                  options={(rawChoices ?? []).map((opt: any) => ({
                    ...opt,
                    correct: opt.id === (step as any).answer,
                  }))}
                  selectedId={selected}
                  reveal={reveal}
                  onSelect={onChoice}
                />
              );
            })()
          ) : null}

          {step.type === "listen_repeat" ? (
            <ListenRepeatStep
              prompt={step.prompt}
              text={step.ttsText}
              onSolved={(ok) => {
                if (!ok) {
                  const level = lesson ? resolveLevel(lesson.id, lesson.level) : null;
                  if (level) {
                    bumpWrong(level, lesson.id);
                  }
                  setListenRepeatFails((count) => count + 1);
                }
                setCanAdvance(ok);
              }}
            />
          ) : null}

          {step.type === "word_build" ? (
            (() => {
              const rawChoices = Array.isArray((step as any).choices)
                ? (step as any).choices
                : null;
              if (!rawChoices) {
                console.warn("[lesson-runner] choice step missing choices", { id, stepIndex, step });
                return (
                  <YStack gap="$3">
                    <GlassCard>
                      <Text fontSize="$6" fontWeight="600">
                        Schritt-Fehler im Inhalt
                      </Text>
                      <Text opacity={0.7} marginTop="$2">
                        Diese Aufgabe ist gerade nicht korrekt konfiguriert. Du kannst trotzdem weitergehen.
                      </Text>
                    </GlassCard>
                    <SoftButton label="Weiter" onPress={() => advance()} />
                  </YStack>
                );
              }
              return (
                <ChoiceStep
                  prompt={step.prompt}
                  text={step.text}
                  options={(rawChoices ?? []).map((opt: any) => ({
                    ...opt,
                    correct: opt.id === (step as any).answer,
                  }))}
                  selectedId={selected}
                  reveal={reveal}
                  onSelect={onChoice}
                />
              );
            })()
          ) : null}

          {step.type === "dialogue_choice" ? (
            (() => {
              const rawChoices = Array.isArray((step as any).choices)
                ? (step as any).choices
                : null;
              if (!rawChoices) {
                console.warn("[lesson-runner] choice step missing choices", { id, stepIndex, step });
                return (
                  <YStack gap="$3">
                    <GlassCard>
                      <Text fontSize="$6" fontWeight="600">
                        Schritt-Fehler im Inhalt
                      </Text>
                      <Text opacity={0.7} marginTop="$2">
                        Diese Aufgabe ist gerade nicht korrekt konfiguriert. Du kannst trotzdem weitergehen.
                      </Text>
                    </GlassCard>
                    <SoftButton label="Weiter" onPress={() => advance()} />
                  </YStack>
                );
              }
              return (
                <ChoiceStep
                  prompt={step.prompt}
                  text={step.text}
                  options={(rawChoices ?? []).map((opt: any) => ({
                    ...opt,
                    correct: opt.id === (step as any).answer,
                  }))}
                  selectedId={selected}
                  reveal={reveal}
                  onSelect={onChoice}
                />
              );
            })()
          ) : null}

          {step.type === "cloze_audio_choice" ? (
            (() => {
              const rawChoices = Array.isArray((step as any).choices)
                ? (step as any).choices
                : null;
              if (!rawChoices) {
                console.warn("[lesson-runner] choice step missing choices", { id, stepIndex, step });
                return (
                  <YStack gap="$3">
                    <GlassCard>
                      <Text fontSize="$6" fontWeight="600">
                        Schritt-Fehler im Inhalt
                      </Text>
                      <Text opacity={0.7} marginTop="$2">
                        Diese Aufgabe ist gerade nicht korrekt konfiguriert. Du kannst trotzdem weitergehen.
                      </Text>
                    </GlassCard>
                    <SoftButton label="Weiter" onPress={() => advance()} />
                  </YStack>
                );
              }
              return (
                <ClozeAudioChoiceStep
                  prompt={step.prompt}
                  ttsText={step.tts?.text}
                  imageKey={step.imageKey}
                  sentence={step.sentence}
                  translation={step.translation}
                  choices={(rawChoices ?? []).map((c: any) => ({
                    ...c,
                    correct: c.id === (step as any).answerId,
                  }))}
                  selectedId={selected}
                  reveal={reveal}
                  onSelect={onChoice}
                />
              );
            })()
          ) : null}

          {step.type === "summary" ? (
            <YStack gap="$3" alignItems="center">
              <Text fontWeight="900" color="$text" fontSize={20} textAlign="center">
                {step.title}
              </Text>
              {step.text ? (
                <Text color="$muted" textAlign="center">
                  {step.text}
                </Text>
              ) : null}
              {step.bullets ? (
                <YStack gap="$2" width="100%">
                  {step.bullets.map((item, idx) => (
                    <XStack key={`${item}-${idx}`} gap="$2" alignItems="flex-start">
                      <Text color="$text" fontWeight="900">
                        •
                      </Text>
                      <Text color="$text" flex={1}>
                        {item}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              ) : null}
              {step.cta ? (
                <Text color="$muted" fontSize={12}>
                  {step.cta}
                </Text>
              ) : null}
            </YStack>
          ) : null}
        </LessonStepShell>
      </ScrollView>
      <YStack padding="$3" paddingBottom={insets.bottom + 12} backgroundColor="#FFFFFF">
        <SoftButton
          label={step.type === "summary" ? "Fertig" : "Weiter"}
          disabled={!canGoNext}
          onPress={advance}
        />
      </YStack>
      <ConfirmModal
        open={confirmMode !== "none"}
        onClose={() => setConfirmMode("none")}
        title={confirmMode === "exit" ? "Lektion abbrechen?" : "Fortsetzen?"}
        description={
          confirmMode === "exit"
            ? "Dein Fortschritt bleibt gespeichert. Du kannst später weitermachen."
            : resumeStep !== null
            ? `Du warst bei Schritt ${resumeStep + 1} von ${lesson.steps.length}.`
            : "Du kannst fortsetzen oder neu starten."
        }
        primaryLabel={confirmMode === "exit" ? "Erinnern (1h)" : "Fortsetzen"}
        secondaryLabel="Neu starten"
        onPrimary={() => {
          if (confirmMode === "exit") {
            remindLater();
            return;
          }
          if (resumeStep !== null) {
            setStepIndex(resumeStep);
            setResumeStep(null);
          }
          setConfirmMode("none");
        }}
        onSecondary={() => {
          resetLessonProgress();
          setConfirmMode("none");
        }}
      />
    </YStack>
  );
}
