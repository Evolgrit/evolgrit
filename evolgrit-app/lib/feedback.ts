import * as Haptics from "expo-haptics";
// expo-audio hook-based API; we use the underlying AudioPlayer for tiny UI SFX.
// This keeps sounds out of React trees.
import { resolveSource } from "expo-audio/build/utils/resolveSource";
import AudioModule from "expo-audio/build/AudioModule";

const correctAsset = require("../assets/sfx/correct.mp3");
const wrongAsset = require("../assets/sfx/wrong.mp3");

let correctPlayer: any = null;
let wrongPlayer: any = null;

function getPlayer(kind: "correct" | "wrong") {
  try {
    if (kind === "correct") {
      if (!correctPlayer) {
        correctPlayer = new AudioModule.AudioPlayer(resolveSource(correctAsset), 500, false);
      }
      return correctPlayer;
    }
    if (!wrongPlayer) {
      wrongPlayer = new AudioModule.AudioPlayer(resolveSource(wrongAsset), 500, false);
    }
    return wrongPlayer;
  } catch {
    return null;
  }
}

export async function playCorrect() {
  try {
    const p = getPlayer("correct");
    p?.play();
  } catch {}
}

export async function playWrong() {
  try {
    const p = getPlayer("wrong");
    p?.play();
  } catch {}
}

export async function hapticCorrect() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}

export async function hapticWrong() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {}
}
