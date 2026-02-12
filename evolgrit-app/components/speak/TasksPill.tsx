import React, { useEffect, useState } from "react";
import { Pressable, ViewStyle } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, Text, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

type Task = { id: string; title: string };

type Props = {
  storageKey: string;
  tasks: Task[];
  style?: ViewStyle;
  completed?: Record<string, boolean>;
  onChangeCompleted?: (next: Record<string, boolean>) => void;
  onLoaded?: (loaded: Record<string, boolean>) => void;
};

const keyFor = (k: string) => `evolgrit.tasks.${k}`;

export function TasksPill({ storageKey, tasks, style, completed, onChangeCompleted, onLoaded }: Props) {
  const [open, setOpen] = useState(false);
  const [internalCompleted, setInternalCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(keyFor(storageKey));
        if (raw) {
          const parsed = JSON.parse(raw);
          setInternalCompleted(parsed);
          onLoaded?.(parsed);
        }
      } catch {
        // ignore
      }
    })();
  }, [storageKey, onLoaded]);

  useEffect(() => {
    if (completed) {
      setInternalCompleted(completed);
    }
  }, [completed]);

  async function toggle(id: string) {
    const update = (prev: Record<string, boolean>) => ({ ...prev, [id]: !prev[id] });
    if (onChangeCompleted) {
      onChangeCompleted(update(completed ?? internalCompleted));
    } else {
      setInternalCompleted((prev) => {
        const next = update(prev);
        void AsyncStorage.setItem(keyFor(storageKey), JSON.stringify(next));
        return next;
      });
    }
  }

  const merged = completed ?? internalCompleted;
  const doneCount = tasks.filter((t) => merged[t.id]).length;

  return (
    <Stack>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "rgba(17,24,39,0.08)",
            gap: 10,
          },
          style,
        ]}
      >
        <Text fontWeight="800" color="#111827">
          Aufgaben
        </Text>
        <XStack gap="$1" alignItems="center">
          {tasks.slice(0, 2).map((_, idx) => {
            const filled = doneCount > idx;
            return (
              <Ionicons
                key={idx}
                name={filled ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={filled ? "#10B981" : "rgba(17,24,39,0.35)"}
              />
            );
          })}
        </XStack>
        <Stack flex={1} />
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="rgba(17,24,39,0.65)"
        />
      </Pressable>

      {open ? (
        <Stack
          marginTop={10}
          borderRadius={18}
          backgroundColor="#fff"
          borderWidth={1}
          borderColor="rgba(17,24,39,0.08)"
          padding={12}
          gap={10}
        >
          {tasks.map((task) => {
            const done = !!merged[task.id];
            return (
              <Pressable
                key={task.id}
                onPress={() => toggle(task.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 6,
                }}
              >
                <Ionicons
                  name={done ? "checkmark-circle" : "ellipse-outline"}
                  size={20}
                  color={done ? "#10B981" : "rgba(17,24,39,0.35)"}
                />
                <Text color={done ? "rgba(17,24,39,0.45)" : "#111827"} fontWeight="700">
                  {task.title}
                </Text>
              </Pressable>
            );
          })}
        </Stack>
      ) : null}
    </Stack>
  );
}
