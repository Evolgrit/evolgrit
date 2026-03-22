import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Stack, Text, XStack, YStack } from "tamagui";
import { Camera, Star, Trash2 } from "lucide-react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ScreenShell } from "../../components/system/ScreenShell";
import { GlassCard } from "../../components/system/GlassCard";
import { PillButton } from "../../components/system/PillButton";
import { SoftButton } from "../../components/system/SoftButton";
import { ListenRepeatStep } from "../../components/lesson/steps/ListenRepeatStep";
import { useUserSettings } from "../../lib/userSettings";
import { useI18n } from "../../lib/i18n";
import { generateCard, SNAP_OBJECTS } from "../../lib/snap/generateCard";
import { removeBackground as removeBackgroundApi } from "../../lib/snap/removeBackground";
import { resolveConceptKey } from "../../lib/snap/conceptResolver";
import { getConceptEntry, keyForLabel, labelFor } from "../../lib/snap/conceptLexicon";
import {
  addToDailyQueue,
  deleteCard,
  getCards,
  saveCard,
  toggleFavorite,
  type SnapCard,
} from "../../lib/storage/cards";
import { supabase } from "../../lib/supabaseClient";
import { uuid } from "../../lib/uuid";

export default function SnapScreen() {
  const { t } = useI18n();
  const { nativeLanguageCode, targetLanguageCode } = useUserSettings();
  type SnapCardData = ReturnType<typeof generateCard> & { stickerUri?: string };
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [manualLabel, setManualLabel] = useState("");
  const [cardData, setCardData] = useState<SnapCardData | null>(null);
  const [canSave, setCanSave] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [cards, setCards] = useState<SnapCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recognizedObject, setRecognizedObject] = useState<string | null>(null);
  const [stickerReady, setStickerReady] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<"b1" | "c1">("b1");
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const chipsOpacity = useSharedValue(0);
  const chipsScale = useSharedValue(0.98);

  function humanizeLabel(raw: string) {
    return raw
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  React.useEffect(() => {
    if (!suggestions.length) return;
    chipsOpacity.value = 0;
    chipsScale.value = 0.98;
    chipsOpacity.value = withTiming(1, { duration: 220 });
    chipsScale.value = withTiming(1, { duration: 220 });
  }, [suggestions, chipsOpacity, chipsScale]);

  const stickerScale = useSharedValue(0.6);
  const stickerY = useSharedValue(18);
  const stickerGlow = useSharedValue(0);
  const stickerOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (!imageUri) return;
    stickerScale.value = 0.6;
    stickerY.value = 18;
    stickerGlow.value = 0;
    stickerOpacity.value = 0;
    stickerScale.value = withSpring(1, { damping: 14, stiffness: 160 });
    stickerY.value = withSpring(0, { damping: 16, stiffness: 160 });
    stickerOpacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.ease) });
    stickerGlow.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [imageUri, stickerScale, stickerY, stickerGlow, stickerOpacity]);

  const stickerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: stickerY.value }, { scale: stickerScale.value }],
    opacity: stickerOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: stickerGlow.value * 0.45,
  }));

  const chipsStyle = useAnimatedStyle(() => ({
    opacity: chipsOpacity.value,
    transform: [{ scale: chipsScale.value }],
  }));

  React.useEffect(() => {
    let active = true;
    (async () => {
      const list = await getCards();
      if (active) setCards(list);
    })();
    return () => {
      active = false;
    };
  }, [saved]);

  React.useEffect(() => {
    if (!cardData) return;
    setSelectedExampleIndex(0);
  }, [cardData, selectedLevel]);

  async function pickImageFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      const uri = res.assets[0].uri;
      setImageUri(uri);
      setCardData(null);
      setCanSave(false);
      setSaved(false);
      setSuggestions([]);
      setError(null);
      setRecognizedObject(null);
      setShowPractice(false);
      setStickerReady(false);
      setCardId(null);
      setSelectedLevel("b1");
      setSelectedExampleIndex(0);
      setIsProcessing(true);
      handlePhoto(uri);
    }
  }

  async function takePhoto() {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;
      const res = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });
      if (!res.canceled && res.assets?.[0]?.uri) {
        const uri = res.assets[0].uri;
        setImageUri(uri);
        setCardData(null);
        setCanSave(false);
        setSaved(false);
        setSuggestions([]);
        setError(null);
        setRecognizedObject(null);
        setShowPractice(false);
        setStickerReady(false);
        setCardId(null);
        setSelectedLevel("b1");
        setSelectedExampleIndex(0);
        setIsProcessing(true);
        handlePhoto(uri);
      }
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      if (msg.includes("Camera not available on simulator")) {
        setError("Simulator: please select an image from Photos.");
        await pickImageFromLibrary();
      } else {
        throw err;
      }
    }
  }

  function getLabel() {
    const raw = manualLabel.trim();
    return raw.length > 0 ? raw : selectedLabel ?? recognizedObject ?? "";
  }

  async function convertToBase64(uri: string) {
    return FileSystem.readAsStringAsync(uri, { encoding: "base64" });
  }

  async function recognizeImage(imageBase64: string) {
    if (!supabase) return { suggestions: [] as { key?: string; label?: string }[] };
    const { data, error } = await supabase.functions.invoke("snap-recognize", {
      body: { imageBase64, targetLanguageCode, nativeLanguageCode },
    });
    if (error) throw new Error(error.message ?? "snap-recognize failed");
    return data ?? { suggestions: [] };
  }

  async function removeBackground(imageBase64: string) {
    try {
      const b64 = await removeBackgroundApi(imageBase64);
      if (b64 && typeof b64 === "string") {
        setStickerReady(true);
        return `data:image/png;base64,${b64}`;
      }
      setStickerReady(false);
    } catch {
      setStickerReady(false);
    }
    return null;
  }

  function autoStartSpeakMode() {
    setShowPractice(true);
  }

  async function generateFromLabel(label: string, uri: string) {
    if (!label) return;
    setRecognizedObject(label);
    setSelectedLabel(label);
    setManualLabel(label);
    const card = generateCard({
      objectLabel: label,
      nativeLanguageCode,
      targetLanguageCode,
    });
    const base64 = await convertToBase64(uri);
    const cutout = await removeBackground(base64);
    if (cutout) setImageUri(cutout);
    setCardData(card);
    setCanSave(false);
    setSaved(false);
    autoStartSpeakMode();
  }

  async function handlePhoto(uri: string) {
    setIsProcessing(true);
    setError(null);
    setSuggestions(SNAP_OBJECTS);
    try {
      const base64 = await convertToBase64(uri);
      const recognition = await recognizeImage(base64);
      const rawList = Array.isArray(recognition?.suggestions) ? recognition.suggestions : [];
      const conceptKey = resolveConceptKey(
        rawList.map((s: any) => ({
          name: typeof s?.label === "string" ? s.label : String(s?.key ?? ""),
          confidence: Number(s?.confidence ?? 0),
        }))
      );
      const mapped = rawList
        .map((s: any) => (typeof s?.key === "string" ? s.key : s?.label))
        .filter(Boolean) as string[];
      const nextSuggestions = mapped.length ? mapped : SNAP_OBJECTS;
      const conceptSuggestions = nextSuggestions
        .map((k) => {
          const resolved = resolveConceptKey([{ name: k, confidence: 1 }]);
          const entry = getConceptEntry(resolved);
          return entry ? labelFor(entry) : humanizeLabel(k);
        })
        .filter(Boolean);
      const uniqueSuggestions = Array.from(new Set(conceptSuggestions.length ? conceptSuggestions : nextSuggestions.map(humanizeLabel)));
      setSuggestions(uniqueSuggestions);
      const bestLabel =
        typeof recognition?.bestKey === "string" && recognition.bestKey
          ? recognition.bestKey
          : conceptKey !== "unknown"
          ? conceptKey
          : mapped[0] ?? "";
      if (!bestLabel) {
        setIsProcessing(false);
        return;
      }
      setRecognizedObject(bestLabel);
      const entry = getConceptEntry(bestLabel);
      const examplesB1 = Array.isArray(recognition?.examples?.b1) ? recognition.examples.b1 : [];
      const examplesC1 = Array.isArray(recognition?.examples?.c1) ? recognition.examples.c1 : [];
      const targetWordDef = entry?.wordDef ?? recognition?.target?.wordDef ?? bestLabel;
      const targetWordIndef = entry?.wordIndef ?? recognition?.target?.wordIndef ?? bestLabel;
      const targetWordBare = targetWordDef.replace(/^(der|die|das) /, "");
      const nativeWord = recognition?.native?.word ?? targetWordBare;
      const card = {
        targetWord: targetWordBare,
        nativeWord,
        targetSentence:
          (entry?.examples.b1?.[0] ?? examplesB1[0]) ?? `Ich arbeite gerade mit ${targetWordBare}.`,
        nativeSentence: nativeWord,
        targetWordDef,
        targetWordIndef,
        examplesB1: entry?.examples.b1?.length
          ? entry.examples.b1
          : examplesB1.length
          ? examplesB1
          : [`Ich arbeite gerade mit ${targetWordBare}.`, `Wo ist ${targetWordBare}?`],
        examplesC1: entry?.examples.c1?.length
          ? entry.examples.c1
          : examplesC1.length
          ? examplesC1
          : [`Ich benutze ${targetWordBare} täglich bei der Arbeit.`],
      };
      const stickerBase64 = await removeBackground(base64);
      if (stickerBase64) {
        setImageUri(stickerBase64);
      }
      setCardData({ ...card, stickerUri: stickerBase64 ? stickerBase64 : undefined });
      setSelectedLevel("b1");
      setSelectedExampleIndex(0);

      const id = uuid();
      await saveCard({
        id,
        createdAt: Date.now(),
        imageUri: stickerBase64 ? stickerBase64 : uri,
        objectLabel: bestLabel,
        targetWord: card.targetWord,
        nativeWord: card.nativeWord,
        targetSentence: card.targetSentence,
        nativeSentence: card.nativeSentence,
        targetLanguageCode,
        nativeLanguageCode,
      });
      setCardId(id);
      setSaved(false);
      autoStartSpeakMode();
    } catch {
      setError("Could not recognize, choose a label");
    } finally {
      setIsProcessing(false);
    }
  }

  async function onSave() {
    if (!cardData || !imageUri) return;
    if (saved) return;
    if (cardId) {
      await addToDailyQueue(cardId);
      setSaved(true);
      return;
    }
    const label = getLabel() || cardData.targetWord;
    const id = uuid();
    await saveCard({
      id,
      createdAt: Date.now(),
      imageUri,
      objectLabel: label,
      targetWord: cardData.targetWord,
      nativeWord: cardData.nativeWord,
      targetSentence:
        (selectedLevel === "c1" ? cardData.examplesC1 : cardData.examplesB1)[
          selectedExampleIndex
        ] ?? cardData.targetSentence,
      nativeSentence: cardData.nativeSentence,
      targetLanguageCode,
      nativeLanguageCode,
    });
    await addToDailyQueue(id);
    setSaved(true);
  }

  async function onToggleFavorite(cardId: string) {
    await toggleFavorite(cardId);
    const list = await getCards();
    setCards(list);
  }

  async function onDeleteCard(cardId: string) {
    await deleteCard(cardId);
    const list = await getCards();
    setCards(list);
  }

  return (
    <ScreenShell title={t("snap.title")} showBack>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <YStack padding="$4" gap="$4">
          <GlassCard>
            <Text fontSize={18} fontWeight="800" color="$text" marginBottom={8}>
              {t("snap.take_photo")}
            </Text>
            {imageUri ? (
              <Stack marginTop="$3" borderRadius="$5" overflow="hidden" backgroundColor="$card" position="relative">
                <Animated.View
                  style={[
                    stickerReady
                      ? {
                          alignSelf: "center",
                          backgroundColor: "white",
                          borderRadius: 18,
                          padding: 6,
                          shadowColor: "#ffffff",
                          shadowOpacity: 0.65,
                          shadowRadius: 14,
                          shadowOffset: { width: 0, height: 6 },
                          elevation: 8,
                        }
                      : null,
                    stickerReady ? stickerStyle : null,
                  ]}
                >
                  {stickerReady ? (
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        {
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bottom: -8,
                          left: -8,
                          borderRadius: 22,
                          backgroundColor: "white",
                        },
                        glowStyle,
                      ]}
                    />
                  ) : null}
                  <Image source={{ uri: imageUri }} style={{ width: "100%", height: 220 }} />
                </Animated.View>
                {isProcessing ? (
                  <Stack
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    backgroundColor="rgba(0,0,0,0.25)"
                    alignItems="center"
                    justifyContent="center"
                    gap="$2"
                  >
                    <ActivityIndicator />
                    <Text color="$textOnDark" fontWeight="800">
                      {t("snap.analyzing")}
                    </Text>
                  </Stack>
                ) : null}
                <Pressable
                  accessibilityRole="button"
                  onPress={takePhoto}
                  style={{ position: "absolute", top: 10, right: 10 }}
                >
                  <Stack
                    width={36}
                    height={36}
                    borderRadius="$4"
                    backgroundColor="$gray3"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Camera size={18} color="#111827" />
                  </Stack>
                </Pressable>
              </Stack>
            ) : null}
            {!imageUri ? (
              <Pressable accessibilityRole="button" onPress={takePhoto}>
                <Stack
                  marginTop="$3"
                  paddingVertical="$3"
                  borderRadius="$4"
                  backgroundColor="$gray3"
                  alignItems="center"
                  justifyContent="center"
                >
                <Camera size={20} color="#111827" />
              </Stack>
            </Pressable>
            ) : null}
          </GlassCard>

          <GlassCard>
            <Text fontSize={16} fontWeight="800" color="$text" marginBottom={8}>
              {t("snap.choose_label")}
            </Text>
            {suggestions.length ? (
              <Animated.View style={chipsStyle}>
                <YStack gap="$2" marginBottom="$2">
                  <Text fontSize={12} color="$muted">
                    {t("snap.suggestions")}
                  </Text>
                  <XStack flexWrap="wrap" gap="$2">
                  {suggestions.map((label) => (
                    <PillButton
                      key={label}
                      label={label}
                      backgroundColor={selectedLabel === (keyForLabel(label) ?? label) ? "$card" : "$cardSubtle"}
                      onPress={() => {
                        const key = keyForLabel(label) ?? label;
                        setSelectedLabel(key);
                        setManualLabel(label);
                        setSuggestions([]);
                        if (imageUri) {
                          generateFromLabel(key, imageUri);
                        }
                      }}
                    />
                  ))}
                </XStack>
                </YStack>
              </Animated.View>
            ) : null}
            {error ? (
              <Text fontSize={12} color="$muted" marginBottom={6}>
                {error}
              </Text>
            ) : null}
            <Text fontSize={12} color="$muted" marginTop={10}>
              {t("common.or")}
            </Text>
            <TextInput
              value={manualLabel}
              onChangeText={(v) => {
                setManualLabel(v);
                if (v.trim()) setSelectedLabel(null);
              }}
              onSubmitEditing={() => {
                const label = manualLabel.trim();
                if (label && imageUri) {
                  generateFromLabel(label, imageUri);
                }
              }}
              placeholder={t("snap.label_placeholder")}
              style={{
                marginTop: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.1)",
                backgroundColor: "white",
              }}
            />
          </GlassCard>

          {cardData ? (
            <GlassCard>
              <Text fontSize={22} fontWeight="800" color="$text" marginBottom={4}>
                {cardData.targetWordDef || cardData.targetWord}
              </Text>
              <Text color="$muted" marginBottom={10}>
                ({cardData.nativeWord})
              </Text>

              <XStack gap="$2" marginBottom="$2">
                <PillButton
                  label="B1"
                  backgroundColor={selectedLevel === "b1" ? "$green3" : "$cardSubtle"}
                  onPress={() => setSelectedLevel("b1")}
                />
                <PillButton
                  label="C1"
                  backgroundColor={selectedLevel === "c1" ? "$green3" : "$cardSubtle"}
                  onPress={() => setSelectedLevel("c1")}
                />
              </XStack>

              <YStack gap="$2" marginBottom="$3">
                {(selectedLevel === "c1" ? cardData.examplesC1 : cardData.examplesB1).map(
                  (sentence, idx) => (
                    <Pressable
                      key={sentence}
                      onPress={() => setSelectedExampleIndex(idx)}
                    >
                      <Stack
                        padding="$3"
                        borderRadius="$4"
                        backgroundColor={
                          selectedExampleIndex === idx ? "$green3" : "$cardSubtle"
                        }
                      >
                        <Text color="$text" fontWeight="700">
                          {sentence}
                        </Text>
                      </Stack>
                    </Pressable>
                  )
                )}
              </YStack>

              {showPractice ? (
                <ListenRepeatStep
                  prompt={t("snap.practice_prompt")}
                  text={
                    (selectedLevel === "c1" ? cardData.examplesC1 : cardData.examplesB1)[
                      selectedExampleIndex
                    ] ?? cardData.targetSentence
                  }
                  onSolved={() => {}}
                  onCorrectChange={(ok) => setCanSave(ok)}
                />
              ) : null}

              <XStack justifyContent="flex-end" marginTop={12}>
                <SoftButton
                  label={saved ? t("snap.saved") : t("common.next")}
                  onPress={onSave}
                  disabled={!canSave || saved}
                  backgroundColor={canSave && !saved ? "$green9" : "$gray4"}
                  textColor={canSave && !saved ? "$color11" : "$gray9"}
                />
              </XStack>
            </GlassCard>
          ) : null}

          {cards.length ? (
            <GlassCard>
              <Text fontSize={16} fontWeight="800" color="$text" marginBottom={8}>
                {t("snap.saved_cards")}
              </Text>
              <YStack gap="$2">
                {cards.slice(0, 5).map((card) => (
                  <Swipeable
                    key={card.id}
                    renderLeftActions={() => (
                      <Pressable
                        onPress={() => onToggleFavorite(card.id)}
                        style={{ flex: 1 }}
                      >
                        <XStack
                          backgroundColor="$green4"
                          alignItems="center"
                          justifyContent="center"
                          gap="$2"
                          paddingHorizontal="$4"
                          height="100%"
                        >
                          <Star size={18} color="#0f172a" />
                          <Text fontWeight="800" color="$text">
                            Favorite
                          </Text>
                        </XStack>
                      </Pressable>
                    )}
                    renderRightActions={() => (
                      <Pressable
                        onPress={() => onDeleteCard(card.id)}
                        style={{ flex: 1 }}
                      >
                        <XStack
                          backgroundColor="$red5"
                          alignItems="center"
                          justifyContent="center"
                          gap="$2"
                          paddingHorizontal="$4"
                          height="100%"
                        >
                          <Trash2 size={18} color="#7f1d1d" />
                          <Text fontWeight="800" color="$text">
                            Delete
                          </Text>
                        </XStack>
                      </Pressable>
                    )}
                  >
                    <XStack gap="$3" alignItems="center">
                      <Stack width={56} height={56} borderRadius={12} overflow="hidden" backgroundColor="$card">
                        <Image source={{ uri: card.imageUri }} style={{ width: "100%", height: "100%" }} />
                        {card.isFavorite ? (
                          <Stack
                            position="absolute"
                            top={4}
                            right={4}
                            width={18}
                            height={18}
                            borderRadius={9}
                            backgroundColor="$yellow4"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Star size={12} color="#7c2d12" />
                          </Stack>
                        ) : null}
                      </Stack>
                      <YStack flex={1}>
                        <Text fontWeight="800" color="$text">
                          {card.targetWord}
                        </Text>
                        <Text color="$muted" numberOfLines={1}>
                          {card.targetSentence}
                        </Text>
                      </YStack>
                    </XStack>
                  </Swipeable>
                ))}
              </YStack>
            </GlassCard>
          ) : null}
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}
