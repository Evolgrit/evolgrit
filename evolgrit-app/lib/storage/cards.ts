import AsyncStorage from "@react-native-async-storage/async-storage";

export type SnapCard = {
  id: string;
  createdAt: number;
  imageUri: string;
  objectLabel: string;
  targetWord: string;
  nativeWord: string;
  targetSentence: string;
  nativeSentence: string;
  targetLanguageCode: string;
  nativeLanguageCode: string;
  isFavorite?: boolean;
};

const CARDS_KEY = "evolgrit.snap.cards";
const DAILY_QUEUE_KEY = "evolgrit.snap.daily_queue";

export async function getCards(): Promise<SnapCard[]> {
  const raw = await AsyncStorage.getItem(CARDS_KEY);
  return raw ? (JSON.parse(raw) as SnapCard[]) : [];
}

export async function saveCard(card: SnapCard) {
  const cards = await getCards();
  const next = [card, ...cards];
  await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(next));
}

export async function toggleFavorite(cardId: string) {
  const cards = await getCards();
  const next = cards.map((c) =>
    c.id === cardId ? { ...c, isFavorite: !c.isFavorite } : c
  );
  await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(next));
}

export async function deleteCard(cardId: string) {
  const cards = await getCards();
  const next = cards.filter((c) => c.id !== cardId);
  await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(next));
  await removeFromDailyQueue(cardId);
}

export async function getDailyQueue(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(DAILY_QUEUE_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function addToDailyQueue(cardId: string) {
  const queue = await getDailyQueue();
  if (!queue.includes(cardId)) {
    queue.unshift(cardId);
  }
  await AsyncStorage.setItem(DAILY_QUEUE_KEY, JSON.stringify(queue));
}

export async function removeFromDailyQueue(cardId: string) {
  const queue = await getDailyQueue();
  const next = queue.filter((id) => id !== cardId);
  await AsyncStorage.setItem(DAILY_QUEUE_KEY, JSON.stringify(next));
}
