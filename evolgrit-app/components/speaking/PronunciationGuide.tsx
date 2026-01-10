import React from "react";
import { SizableText, YStack, XStack } from "tamagui";

export type PronunciationGuideItem = {
  word: string;
  guide: string; // e.g. "ent·SCHUL·di·gung"
  note?: string;
};

type Props = {
  items: PronunciationGuideItem[];
  title?: string;
};

export function PronunciationGuide({ items, title = "Aussprache" }: Props) {
  if (!items?.length) return null;

  return (
    <YStack gap="$2" marginTop="$2">
      <SizableText fontSize={12} opacity={0.6} fontWeight="700" letterSpacing={0.3}>
        {title.toUpperCase()}
      </SizableText>

      <YStack gap="$2">
        {items.map((it) => (
          <YStack key={`${it.word}-${it.guide}`} gap="$1">
            <SizableText fontSize={22} fontWeight="700" letterSpacing={0.2} color="rgba(0,0,0,0.92)">
              {it.guide}
            </SizableText>

            {it.note ? (
              <SizableText fontSize={13} opacity={0.65} lineHeight={18}>
                {it.note}
              </SizableText>
            ) : null}

            <XStack height={4} />
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
}
