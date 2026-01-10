import { useEffect, useRef, useState } from "react";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from "expo-audio";

export function useAudioPlayer() {
  const playerRef = useRef<AudioPlayer | null>(null);
  const subRef = useRef<{ remove: () => void } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);

  async function stop() {
    if (!playerRef.current) return;
    try {
      playerRef.current.pause();
    } catch {}
    try {
      playerRef.current.remove();
    } catch {}

    if (subRef.current) {
      try {
        subRef.current.remove();
      } catch {}
      subRef.current = null;
    }

    playerRef.current = null;
    setIsPlaying(false);
  }

  async function play(source: AudioSource) {
    if (!source) return;

    setIsLoading(true);

    try {
      await stop();

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false,
        interruptionMode: "mixWithOthers",
      });

      const downloadFirst = typeof source === "string";
      const player = createAudioPlayer(null, { updateInterval: 250, downloadFirst });
      playerRef.current = player;

      const sub = player.addListener?.("playbackStatusUpdate", (status: any) => {
        const playing = Boolean(status?.playing);
        setIsPlaying(playing);
        if (typeof status?.duration === "number") {
          setDurationMs(Math.max(0, status.duration * 1000));
        }
        if (typeof status?.currentTime === "number") {
          setPositionMs(Math.max(0, status.currentTime * 1000));
        }
        if (status?.didJustFinish) {
          setIsPlaying(false);
          setPositionMs(durationMs);
        }
      });
      subRef.current = sub ?? null;

      player.replace(typeof source === "string" || typeof source === "number" ? source : { uri: source?.uri });
      player.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio play error", err);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function seek(seconds: number) {
    if (!playerRef.current) return;
    try {
      const nativePlayer = playerRef.current as any;
      nativePlayer?.seekTo?.(Math.max(0, seconds));
    } catch {}
  }

  async function pause() {
    if (!playerRef.current) return;
    try {
      playerRef.current.pause();
    } catch {}
    setIsPlaying(false);
  }

  useEffect(() => {
    return () => {
      void stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress =
    durationMs > 0 ? Math.min(1, Math.max(0, positionMs / durationMs)) : 0;

  return { play, stop, pause, seek, isLoading, isPlaying, durationMs, positionMs, progress };
}
