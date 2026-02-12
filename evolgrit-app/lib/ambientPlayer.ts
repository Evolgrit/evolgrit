import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { resolveSource } from "expo-audio/build/utils/resolveSource";

import type { AmbientId } from "./ambientStore";

const ASSETS: Record<Exclude<AmbientId, "off">, number> = {
  ocean: require("../assets/ambient/ocean.mp3"),
  forest: require("../assets/ambient/forest.mp3"),
  rain: require("../assets/ambient/rain.mp3"),
  wind: require("../assets/ambient/wind.mp3"),
};

let currentPlayer: AudioPlayer | null = null;
let currentSub: { remove: () => void } | null = null;
let currentId: AmbientId = "off";
let baseVolume = 0.12;
let isDucked = false;

function applyVolume() {
  if (!currentPlayer) return;
  const target = isDucked ? 0.04 : baseVolume;
  try {
    currentPlayer.setVolume(target);
  } catch {
    // ignore
  }
}

async function stopCurrent() {
  if (currentSub) {
    try {
      currentSub.remove();
    } catch {}
    currentSub = null;
  }
  if (currentPlayer) {
    try {
      currentPlayer.pause();
    } catch {}
    try {
      currentPlayer.remove?.();
    } catch {}
    currentPlayer = null;
  }
  currentId = "off";
}

export async function startAmbient(id: AmbientId, volume = 0.12) {
  if (id === "off") {
    await stopAmbient();
    return;
  }

  baseVolume = volume;

  if (currentPlayer && currentId === id) {
    applyVolume();
    return;
  }

  await stopCurrent();

  const asset = ASSETS[id as Exclude<AmbientId, "off">];
  if (!asset) return;

  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
      interruptionMode: "mixWithOthers",
    });
  } catch {
    // ignore
  }

  try {
    const source = resolveSource(asset);
    const player = createAudioPlayer(null, { updateInterval: 500, downloadFirst: true });
    currentPlayer = player;
    currentId = id;
    isDucked = false;

    const sub = player.addListener?.("playbackStatusUpdate", (status: any) => {
      if (status?.didJustFinish) {
        try {
          player.play();
        } catch {
          // ignore
        }
      }
    });
    currentSub = sub ?? null;

    player.replace(source);
    applyVolume();
    player.play();
  } catch {
    await stopCurrent();
  }
}

export async function stopAmbient() {
  await stopCurrent();
}

export function setAmbientVolume(volume: number) {
  baseVolume = volume;
  applyVolume();
}

export function duckForTts(isSpeaking: boolean) {
  isDucked = isSpeaking;
  applyVolume();
}
