import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const KEY = "evolgrit.avatar.selected";
export const DEFAULT_AVATAR_ID = "coach_lena";

export async function getSelectedAvatarId() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw || DEFAULT_AVATAR_ID;
  } catch {
    return DEFAULT_AVATAR_ID;
  }
}

export async function setSelectedAvatarId(id: string) {
  try {
    await AsyncStorage.setItem(KEY, id);
  } catch {
    // ignore
  }
}

export function useSelectedAvatarId() {
  const [selected, setSelected] = useState(DEFAULT_AVATAR_ID);

  useEffect(() => {
    let isMounted = true;
    getSelectedAvatarId().then((id) => {
      if (isMounted) setSelected(id);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return selected;
}
