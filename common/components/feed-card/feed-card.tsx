import { FeedItem } from "@/common/types";
import { UserAvatar } from "@/common/components/user-avatar";
import { Image, StyleSheet, Text, View } from "react-native";

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.authorRow}>
        <UserAvatar
          username={item.username}
          avatarUrl={item.avatarUrl}
          size={40}
        />
        <Text style={styles.username}>{item.username}</Text>
      </View>

      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : null}

      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    gap: 10,
    paddingVertical: 12,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
  },
  username: {
    fontSize: 15,
    fontWeight: "700",
  },
  image: { width: "100%", aspectRatio: 4 / 3, backgroundColor: "#f0f0f0" },
  description: {
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 12,
  },
});
