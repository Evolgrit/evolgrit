import React, { useEffect, useMemo, useState } from "react";
import { Linking, Modal, Pressable, ScrollView } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";
import * as DocumentPicker from "expo-document-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useI18n } from "../../lib/i18n";
import { getDocuments, upsertDocument } from "../../lib/migration/storage";
import type { DocumentItem } from "../../lib/migration/types";
import { defaultDocuments } from "../../lib/migration/templates";

export default function JourneyDocuments() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [pendingFile, setPendingFile] = useState<{ uri: string; name?: string } | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const docs = await getDocuments();
        if (!active) return;
        setDocuments(docs ?? []);
      } catch (err) {
        console.error("[journey] load documents failed", (err as any)?.stack ?? err);
        if (!active) return;
        setDocuments(defaultDocuments());
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const docList = useMemo(() => (documents.length ? documents : defaultDocuments()), [documents]);

  async function pickFile() {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (res.canceled) return null;
    const asset = res.assets?.[0];
    if (!asset?.uri) return null;
    return { uri: asset.uri, name: asset.name };
  }

  async function attachFileToDoc(doc: DocumentItem, uri: string) {
    const updated: DocumentItem = {
      ...doc,
      status: "uploaded",
      fileUri: uri,
      updatedAt: Date.now(),
    };
    await upsertDocument(updated);
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
  }

  async function onUpload(doc?: DocumentItem) {
    const file = await pickFile();
    if (!file) return;
    if (doc) {
      await attachFileToDoc(doc, file.uri);
      return;
    }
    setPendingFile(file);
    setShowTypePicker(true);
  }

  async function onView(doc: DocumentItem) {
    if (!doc.fileUri) return;
    try {
      await Linking.openURL(doc.fileUri);
    } catch (err) {
      console.error("[journey] open file failed", (err as any)?.stack ?? err);
    }
  }

  async function onPickType(doc: DocumentItem) {
    if (!pendingFile) return;
    await attachFileToDoc(doc, pendingFile.uri);
    setPendingFile(null);
    setShowTypePicker(false);
  }

  const StatusPill = ({ label }: { label: string }) => (
    <Stack backgroundColor="$gray3" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$4">
      <Text fontSize={12} fontWeight="700" color="$text">
        {label}
      </Text>
    </Stack>
  );

  const ActionButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Stack backgroundColor="$gray3" paddingHorizontal="$4" paddingVertical="$2" borderRadius="$4">
        <Text fontSize={13} fontWeight="700" color="$text">
          {label}
        </Text>
      </Stack>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <YStack padding="$4" gap="$4" paddingTop={insets.top + 12}>
        <YStack gap="$1">
          <Text fontSize={24} fontWeight="800" color="$text">
            {t("journey.documents_title")}
          </Text>
          <Text color="$muted">{t("journey.documents")}</Text>
        </YStack>

        <ActionButton label={t("journey.add_document")} onPress={() => onUpload()} />

        <YStack gap="$2">
          {docList.map((doc) => (
            <Stack key={doc.id} backgroundColor="$gray2" borderRadius="$6" padding="$4">
              <XStack alignItems="center" justifyContent="space-between" marginBottom="$2">
                <Text fontSize={16} fontWeight="800" color="$text">
                  {doc.title}
                </Text>
                <StatusPill
                  label={
                    doc.status === "uploaded"
                      ? t("journey.uploaded")
                      : doc.status === "needs_translation"
                      ? t("journey.needs_translation")
                      : t("journey.missing")
                  }
                />
              </XStack>
              <XStack gap="$2">
                {doc.status === "uploaded" ? (
                  <ActionButton label={t("journey.view")} onPress={() => onView(doc)} />
                ) : (
                  <ActionButton label={t("journey.upload")} onPress={() => onUpload(doc)} />
                )}
              </XStack>
            </Stack>
          ))}
        </YStack>
      </YStack>

      <Modal visible={showTypePicker} transparent animationType="fade">
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" backgroundColor="rgba(0,0,0,0.35)">
          <Stack backgroundColor="$gray2" borderRadius="$6" padding="$4" width="100%">
            <Text fontSize={16} fontWeight="800" color="$text" marginBottom="$2">
              {t("journey.choose_type")}
            </Text>
            <YStack gap="$2" marginBottom="$3">
              {docList.map((doc) => (
                <Pressable key={doc.id} onPress={() => onPickType(doc)}>
                  <Stack backgroundColor="$gray3" padding="$3" borderRadius="$4">
                    <Text color="$text">{doc.title}</Text>
                  </Stack>
                </Pressable>
              ))}
            </YStack>
            <ActionButton label={t("journey.cancel")} onPress={() => setShowTypePicker(false)} />
          </Stack>
        </YStack>
      </Modal>
    </ScrollView>
  );
}
