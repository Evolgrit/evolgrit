import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDocuments } from "../../lib/migration/storage";
import type { DocumentItem } from "../../lib/migration/types";

export default function JourneyHub() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const counts = useMemo(() => {
    const missing = documents.filter((d) => d.status === "missing").length;
    const uploaded = documents.filter((d) => d.status === "uploaded").length;
    return { missing, uploaded };
  }, [documents]);

  const loadDocs = useCallback(async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs ?? []);
    } catch (err) {
      console.error("[journey] load documents failed", (err as any)?.stack ?? err);
      setDocuments([]);
    }
  }, []);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  useFocusEffect(
    useCallback(() => {
      loadDocs();
    }, [loadDocs])
  );

  const StatusPill = ({ label }: { label: string }) => (
    <Stack
      backgroundColor="$gray3"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$4"
    >
      <Text fontSize={12} fontWeight="700" color="$text">
        {label}
      </Text>
    </Stack>
  );

  const ActionChip = ({ label }: { label: string }) => (
    <Stack backgroundColor="$gray3" paddingHorizontal="$4" paddingVertical="$2" borderRadius="$4">
      <Text fontSize={13} fontWeight="700" color="$text">
        {label}
      </Text>
    </Stack>
  );

  const MiniBadge = ({ label }: { label: string }) => (
    <Stack backgroundColor="$gray3" paddingHorizontal="$3" paddingVertical="$1" borderRadius="$3">
      <Text fontSize={12} fontWeight="700" color="$text">
        {label}
      </Text>
    </Stack>
  );

  const Chevron = () => (
    <Text fontSize={18} color="$muted">
      ›
    </Text>
  );

  const JourneyTile = ({
    title,
    subtitle,
    icon,
    bgToken,
    onPress,
  }: {
    title: string;
    subtitle: string;
    icon: string;
    bgToken: string;
    onPress?: () => void;
  }) => (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Stack backgroundColor={bgToken} borderRadius="$6" padding="$4" minHeight={120}>
        <Text fontSize={20} fontWeight="800" color="$text" marginBottom="$2">
          {icon} {title}
        </Text>
        <Text color="$muted">{subtitle}</Text>
      </Stack>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <YStack padding="$4" gap="$4" paddingTop={insets.top + 12}>
        <YStack gap="$2">
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap="$3">
              <Stack width={36} height={36} borderRadius={18} backgroundColor="$gray3" />
              <YStack gap="$1">
                <Text fontSize={28} fontWeight="800" color="$text">
                  Journey
                </Text>
                <Text color="$muted">Documents · Recognition · Visa</Text>
              </YStack>
            </XStack>
            <Stack backgroundColor="$gray3" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$4">
              <Text fontSize={12} fontWeight="700" color="$text">
                0% complete
              </Text>
            </Stack>
          </XStack>
        </YStack>

        <Stack backgroundColor="$gray2" borderRadius="$6" padding="$3">
          <Text color="$muted">Search documents…</Text>
        </Stack>

        <YStack gap="$3">
          <XStack gap="$3">
            <Stack flex={1}>
              <JourneyTile
                title="Documents"
                subtitle="Upload & track"
                icon="📄"
                bgToken="$yellow2"
                onPress={() => router.push("/journey/documents")}
              />
            </Stack>
            <Stack flex={1}>
              <JourneyTile
                title="ID / Passport"
                subtitle="Identity & travel"
                icon="🪪"
                bgToken="$blue2"
                onPress={() => router.push("/journey/documents")}
              />
            </Stack>
          </XStack>
          <XStack gap="$3">
            <Stack flex={1}>
              <JourneyTile
                title="Recognition"
                subtitle="Degree validation"
                icon="✅"
                bgToken="$purple2"
                onPress={() => router.push("/journey/recognition")}
              />
            </Stack>
            <Stack flex={1}>
              <JourneyTile
                title="Visa"
                subtitle="Appointment & docs"
                icon="🛂"
                bgToken="$green2"
                onPress={() => router.push("/journey/visa")}
              />
            </Stack>
          </XStack>
        </YStack>

        <YStack gap="$2" marginTop="$2">
          <Text fontSize={14} fontWeight="700" color="$muted">
            Status
          </Text>
          <Pressable onPress={() => router.push("/journey/documents")} accessibilityRole="button">
            <Stack backgroundColor="$gray2" borderRadius="$6" padding="$4">
              <XStack alignItems="center" justifyContent="space-between" marginBottom="$2">
                <Text fontSize={18} fontWeight="800" color="$text">
                  Documents
                </Text>
                <StatusPill label="Not started" />
              </XStack>
              <Text color="$muted">Missing: {counts.missing} · Uploaded: {counts.uploaded}</Text>
            </Stack>
          </Pressable>
          <XStack gap="$3">
            <Pressable onPress={() => router.push("/journey/recognition")} accessibilityRole="button">
              <Stack flex={1} backgroundColor="$gray2" borderRadius="$6" padding="$3">
              <XStack alignItems="center" justifyContent="space-between" marginBottom="$2">
                <Text fontSize={16} fontWeight="800" color="$text">
                  Recognition
                </Text>
                <StatusPill label="Not started" />
              </XStack>
              <Text color="$muted">Start recognition steps</Text>
              </Stack>
            </Pressable>
            <Pressable onPress={() => router.push("/journey/visa")} accessibilityRole="button">
              <Stack flex={1} backgroundColor="$gray2" borderRadius="$6" padding="$3">
              <XStack alignItems="center" justifyContent="space-between" marginBottom="$2">
                <Text fontSize={16} fontWeight="800" color="$text">
                  Visa
                </Text>
                <StatusPill label="Not started" />
              </XStack>
              <Text color="$muted">Prepare appointment & documents</Text>
              </Stack>
            </Pressable>
          </XStack>
        </YStack>

        <Text color="$muted" fontSize={12}>
          Germany · Pflege
        </Text>
      </YStack>
    </ScrollView>
  );
}
