import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const STORAGE_KEY = "@evolgrit/reminderNotificationIds";

export async function ensureNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === "granted";
}

export async function cancelEvolgritReminders() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) {
    const ids: string[] = JSON.parse(raw);
    await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  }
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function scheduleEvolgritReminders({
  weekdays,
  hour,
  minute,
}: {
  weekdays: number[];
  hour: number;
  minute: number;
}) {
  await cancelEvolgritReminders();
  const ids: string[] = [];
  for (const weekday of weekdays) {
    const expoWeekday = weekday === 0 ? 1 : weekday + 1; // Expo: 1=Sun ... 7=Sat
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Evolgrit Erinnerung",
        body: "3 Minuten reichen. Starte jetzt deine nächste Übung.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday: expoWeekday,
        hour,
        minute,
        repeats: true,
      },
    });
    ids.push(id);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
