declare module "expo-audio" {
  import type { PermissionResponse } from "expo-modules-core";

  export type AudioSource = string | number | null | { uri?: string; assetId?: number };

  export type AudioPlayerStatus = {
    playing?: boolean;
    didJustFinish?: boolean;
    [key: string]: any;
  };

  export type AudioPlayer = {
    play: () => void;
    pause: () => void;
    replace: (source: AudioSource) => void;
    remove: () => void;
    addListener?: (
      event: "playbackStatusUpdate",
      cb: (status: AudioPlayerStatus) => void
    ) => { remove: () => void };
  };

  export function createAudioPlayer(
    source?: AudioSource | null,
    options?: { updateInterval?: number; downloadFirst?: boolean; keepAudioSessionActive?: boolean }
  ): AudioPlayer;

  export function setAudioModeAsync(mode: {
    playsInSilentMode: boolean;
    allowsRecording?: boolean;
    shouldPlayInBackground?: boolean;
    shouldRouteThroughEarpiece?: boolean;
    interruptionMode?: "mixWithOthers" | "doNotMix" | "duckOthers";
  }): Promise<void>;

  export function requestRecordingPermissionsAsync(): Promise<PermissionResponse>;
  export function getRecordingPermissionsAsync(): Promise<PermissionResponse>;

  // Recording stubs used in lesson.tsx
  export const RecordingPresets: {
    HIGH_QUALITY: any;
  };

  export type RecorderState = {
    isRecording: boolean;
    durationMillis?: number;
    url?: string | null;
    canRecord?: boolean;
  };

  export type AudioRecorder = {
    prepareToRecordAsync: (options?: any) => Promise<void>;
    record: (options?: any) => void;
    stop: () => Promise<void>;
  };

  export function useAudioRecorder(preset?: any, listener?: (state: RecorderState) => void): AudioRecorder;
  export function useAudioRecorderState(recorder: AudioRecorder): RecorderState;

  export const AudioModule: {
    requestRecordingPermissionsAsync: typeof requestRecordingPermissionsAsync;
  };
}
