import { NativeModulesProxy } from "expo-modules-core";

const EvolgritVision = NativeModulesProxy.EvolgritVision;

export async function extractSubjectCutoutAsync(imageUri: string): Promise<string> {
  if (!EvolgritVision?.extractSubjectCutoutAsync) {
    throw new Error("EvolgritVision module not available");
  }
  return EvolgritVision.extractSubjectCutoutAsync(imageUri);
}
