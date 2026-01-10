import React from "react";
import { Dialog, Text, XStack, YStack, Button } from "tamagui";
import { X } from "lucide-react-native";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  onClose,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: Props) {
  return (
    <Dialog modal open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          key="content"
          animation="quick"
          enterStyle={{ scale: 0.96, opacity: 0 }}
          exitStyle={{ scale: 0.96, opacity: 0 }}
          backgroundColor="$background"
          borderRadius="$6"
          padding="$4"
          gap="$3"
          width="90%"
          maxWidth={420}
          alignSelf="center"
          bordered={false}
        >
          <YStack gap="$3">
            <XStack justifyContent="space-between" alignItems="flex-start" gap="$2">
              <YStack gap="$2" flex={1} paddingRight="$2">
                <Dialog.Title>
                  <Text fontSize={18} fontWeight="700" color="$color">
                    {title}
                  </Text>
                </Dialog.Title>
                {description ? (
                  <Dialog.Description>
                    <Text color="$muted">{description}</Text>
                  </Dialog.Description>
                ) : null}
              </YStack>

              <Button
                size="$3"
                circular
                backgroundColor="$color2"
                borderWidth={0}
                onPress={onClose}
                icon={<X size={18} color="#111827" />}
                accessibilityLabel="Schließen"
              />
            </XStack>

            <XStack gap="$2" justifyContent="flex-end" flexWrap="wrap">
              {primaryLabel && onPrimary ? (
                <Button
                  backgroundColor="$background"
                  borderWidth={0}
                  onPress={() => {
                    onPrimary?.();
                  }}
                >
                  {primaryLabel}
                </Button>
              ) : null}

              {secondaryLabel && onSecondary ? (
                <Button
                  backgroundColor="$background"
                  borderWidth={0}
                  onPress={() => {
                    onSecondary?.();
                  }}
                >
                  {secondaryLabel}
                </Button>
              ) : null}
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
