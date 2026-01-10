import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAvatarUri } from "../lib/profileAvatarStore";

export function TopBar({ title }: { title: string }) {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    (async () => setAvatar(await getAvatarUri()))();
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F6F7FB",
      }}
    >
      {/* Avatar left */}
      <Pressable onPress={() => router.push("/profile")} style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden" }}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={{ width: 40, height: 40 }} />
        ) : (
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontWeight: "900", color: "#111827" }}>DW</Text>
          </View>
        )}
      </Pressable>

      {/* Title center */}
      <Text style={{ fontSize: 18, fontWeight: "900", color: "#111827" }}>{title}</Text>

      {/* Chat icon right */}
      <Pressable
        onPress={() => router.push("/chat/mentor-default")}
        style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#111827" />
      </Pressable>
    </View>
  );
}
