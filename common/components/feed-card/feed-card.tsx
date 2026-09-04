import { FeedItem } from "@/common/types";
import { Image, StyleSheet, Text, View } from "react-native";

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.username}>{item.username}</Text>

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
  username: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 12,
  },
  image: { width: "100%", aspectRatio: 4 / 3, backgroundColor: "#f0f0f0" },
  description: {
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 12,
  },
});
