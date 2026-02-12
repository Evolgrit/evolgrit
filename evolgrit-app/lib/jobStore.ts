import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const KEY = "evolgrit.job.selected";
export const DEFAULT_JOB_TRACK = "pflege";

export async function getSelectedJobTrack() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw || DEFAULT_JOB_TRACK;
  } catch {
    return DEFAULT_JOB_TRACK;
  }
}

export async function setSelectedJobTrack(track: string) {
  try {
    await AsyncStorage.setItem(KEY, track);
  } catch {
    // ignore
  }
}

export function useSelectedJobTrack() {
  const [selected, setSelected] = useState(DEFAULT_JOB_TRACK);

  useEffect(() => {
    let isMounted = true;
    getSelectedJobTrack().then((track) => {
      if (isMounted) setSelected(track);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return selected;
}
